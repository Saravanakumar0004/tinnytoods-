import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
  });

  const [newCategory, setNewCategory] = useState("");

  // ── helpers ──────────────────────────────────────────────
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const getImageUrl = (image_url) => {
    if (!image_url) return "";
    if (image_url.startsWith("http") || image_url.startsWith("data:"))
      return image_url;
    return `${BASE_URL}${image_url}`;
  };

  // ── fetch ─────────────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      const response = await api.get(endpoints.gallery.list);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      setCategories(data);
    } catch {
      setCategories([]);
    }
  };

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.gallery.list_photos);
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];
      setPhotos(data);
    } catch {
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPhotos();
  }, []);

  // ── form ──────────────────────────────────────────────────
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // ── add category ──────────────────────────────────────────
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await api.post(endpoints.gallery.list, {
        name: newCategory,
        slug: generateSlug(newCategory),
      });
      setNewCategory("");
      fetchCategories();
    } catch {
      console.error("Category create failed");
    }
  };

  // ── delete category ───────────────────────────────────────
  const handleDeleteCategory = async (slug) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await api.delete(endpoints.gallery.slug.replace(":slug", slug));
      setCategories((prev) => prev.filter((cat) => cat.slug !== slug));
      if (selectedCategory === slug) setSelectedCategory("All");
      fetchPhotos();
    } catch (err) {
      console.error("Category delete failed", err?.response);
    }
  };

  // ── upload photo ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await api.post(endpoints.gallery.list_photos, {
          category_id: Number(form.category),
          title: form.title,
          description: form.description,
          image: reader.result,
        });
        setForm({ title: "", description: "", category: "", image: null });
        fetchPhotos();
      } catch {
        console.error("Photo upload failed");
      }
    };
    reader.readAsDataURL(form.image);
  };

  // ── delete photo ──────────────────────────────────────────
  const handleDeletePhoto = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await api.delete(endpoints.gallery.list_id.replace(":id", String(id)));
      setPhotos((prev) => prev.filter((item) => item.id !== id));
    } catch {
      console.error("Delete failed");
    }
  };

  // ── derived ───────────────────────────────────────────────
  const filteredPhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter((photo) => photo.category?.slug === selectedCategory);

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // ── render ────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">

      {/* PAGE TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6 sm:mb-8">
        Gallery <span className="text-black">Management</span>
      </h1>

      {/* ── ADD CATEGORY ── */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6 sm:mb-8">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Add New Category
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            placeholder="Enter Category Name *"
            className="border border-gray-200 px-4 py-2 rounded-lg w-full sm:w-72 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
          <button
            onClick={handleAddCategory}
            className="bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg text-sm font-medium w-full sm:w-auto transition"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* ── UPLOAD IMAGE ── */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-8 sm:mb-10">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Upload New Image
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title *"
              className="border border-gray-200 px-3 py-2 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
              required
            />
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description *"
              className="border border-gray-200 px-3 py-2 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
              required
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-gray-200 px-3 py-2 rounded-lg w-full text-sm outline-none focus:ring-2 focus:ring-primary/30 transition text-gray-600"
              required
            >
              <option value="">Select Category *</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border border-gray-200 px-3 py-2 rounded-lg w-full text-sm text-gray-500 file:mr-3 file:py-1 file:px-3 file:border-0 file:rounded file:bg-primary/10 file:text-primary file:text-xs file:font-medium cursor-pointer"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:opacity-90 text-white py-3 rounded-lg text-sm font-medium transition"
          >
            Upload Image
          </button>
        </form>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            selectedCategory === "All"
              ? "bg-primary text-white shadow-sm"
              : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          All
        </button>

        {sortedCategories.map((cat) => (
          <div
            key={cat.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === cat.slug
                ? "bg-primary text-white shadow-sm"
                : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <button
              onClick={() => setSelectedCategory(cat.slug)}
              className="whitespace-nowrap"
            >
              {cat.name}
            </button>
            <Trash2
              size={13}
              className={`cursor-pointer transition hover:scale-110 ${
                selectedCategory === cat.slug
                  ? "text-white/80 hover:text-white"
                  : "text-red-400 hover:text-red-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(cat.slug);
              }}
            />
          </div>
        ))}
      </div>

      {/* ── PHOTO GRID ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Loading...
          </div>
        </div>
      ) : filteredPhotos.length > 0 ? (
        /*
         * FIX: use auto-fill + minmax so every card gets equal width
         * and the last row fills evenly — no stretched or orphaned cards.
         * Using inline style because Tailwind's JIT purge can strip
         * arbitrary grid values; inline guarantees the correct CSS.
         */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200"
            >
              {/* Image — fixed aspect ratio so all thumbnails are uniform */}
              <div className="w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <img
                  src={getImageUrl(photo.image_url)}
                  alt={photo.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Card body — flex-col + flex-1 keeps cards equal height in each row */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {photo.title}
                </h3>

                <p
                  className="text-sm text-gray-500 mt-1 flex-1"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {photo.description}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                    {photo.category?.name || "Uncategorized"}
                  </span>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="text-red-400 hover:text-red-600 transition p-1 rounded hover:bg-red-50"
                    title="Delete photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M13.5 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
          <p className="text-sm">No images found.</p>
        </div>
      )}
    </div>
  );
}