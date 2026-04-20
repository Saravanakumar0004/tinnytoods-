import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Pencil, Trash2, Navigation } from "lucide-react";
import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export default function Branches() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [branches, setBranches] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    branch_name: "",
    phone: "",
    location: "",
    mapurl: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState<any>({});
  const formRef = useRef<HTMLDivElement | null>(null);
  // ================= FETCH =================
  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(endpoints.branches.list);
      const result = res.data;
      const allData = result?.results ? result.results : result;

      setBranches(allData);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate(endpoints.admin.login), 1000);
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBranches();
  }, []);
  // ================= INPUT CHANGE =================
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };
  // ================= VALIDATION =================
  const validateForm = () => {
    let newErrors: any = {};

    if (!form.branch_name.trim())
      newErrors.branch_name = "Branch name is required";

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (form.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!form.location.trim())
      newErrors.location = "Location is required";

    if (!form.mapurl.trim())
      newErrors.mapurl = "Map URL is required";

    if (!form.latitude.trim())
      newErrors.latitude = "Latitude is required";

    if (!form.longitude.trim())
      newErrors.longitude = "Longitude is required";    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // ================= ADD =================
  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      await api.post(endpoints.branches.list, {
        branch_name: form.branch_name,
        phone: form.phone,
        location: form.location,
        mapurl: form.mapurl,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      });
      resetForm();
      fetchBranches();
    } catch (err: any) {
      console.error(err);
      setError("Add failed. Please try again.");
    }
  };
  // ================= EDIT LOAD =================
  const handleEdit = (branch: any) => {
    setEditingId(branch.id);
    setForm({
      branch_name: branch.branch_name || "",
      phone: branch.phone || "",
      location: branch.location || "",
      mapurl: branch.mapurl || "",
      latitude:
        branch.latitude !== null && branch.latitude !== undefined
          ? String(branch.latitude)
          : "",
      longitude:
        branch.longitude !== null && branch.longitude !== undefined
          ? String(branch.longitude)
          : "",
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!editingId) return;
    if (!validateForm()) return;

    try {
      await api.patch(`${endpoints.branches.list}${editingId}/`, {
        branch_name: form.branch_name,
        phone: form.phone,
        location: form.location,
        mapurl: form.mapurl,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      });

      setEditingId(null);
      resetForm();
      fetchBranches();
    } catch (err: any) {
      console.error(err);
      setError("Update failed. Please try again.");
    }
  };


  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`${endpoints.branches.list}${id}/`);
      fetchBranches();
    } catch (err: any) {
      console.error(err);
      setError("Delete failed. Please try again.");
    }
  };


  const resetForm = () => {
    setForm({
      branch_name: "",
      phone: "",
      location: "",
      mapurl: "",
      latitude: "",
      longitude: "",
    });
    setErrors({});
  };

  const getMapLink = (branch: any) => {
    if (branch.mapurl) return branch.mapurl;

    if (
      branch.latitude !== null &&
      branch.longitude !== null
    ) {
      return `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`;
    }

    return "#";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:pt-5 text-primary font-bold mb-8">
          Branches <span className="text-black">Page</span>
        </h1>

        {/* ================= FORM ================= */}
        <div
          ref={formRef}
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md mb-6 sm:mb-10"
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {editingId ? "Edit Branch" : "Add Branch"}
          </h2>

          {/* ✅ Responsive Grid: 1 col (mobile) → 2 col (sm/md) → 3 col (lg+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Branch Name */}
            <div className="flex flex-col">
              {errors.branch_name && (
                <p className="text-red-500 text-xs sm:text-sm mb-1">
                  {errors.branch_name}
                </p>
              )}
              <input
                name="branch_name"
                value={form.branch_name}
                onChange={handleChange}
                placeholder="Branch Name *"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                  ${
                    errors.branch_name
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-300"
                  }`}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              {errors.phone && (
                <p className="text-red-500 text-xs sm:text-sm mb-1">
                  {errors.phone}
                </p>
              )}
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone *"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                  ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-300"
                  }`}
              />
            </div>

            {/* Location */}
            <div className="flex flex-col">
              {errors.location && (
                <p className="text-red-500 text-xs sm:text-sm mb-1">
                  {errors.location}
                </p>
              )}
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Area Name *"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                  ${
                    errors.location
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-300"
                  }`}
              />
            </div>

            {/* Map URL */}
            <div className="flex flex-col">
              {errors.mapurl && (
                <p className="text-red-500 text-xs sm:text-sm mb-1">
                  {errors.mapurl}
                </p>
              )}
              <input
                name="mapurl"
                value={form.mapurl}
                onChange={handleChange}
                placeholder="Google Map URL *"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                  ${
                    errors.mapurl
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-300"
                  }`}
              />
            </div>

            {/* Latitude */}
            <div className="flex flex-col">
              {errors.latitude && (
                <p className="text-red-500 text-xs sm:text-sm mb-1">
                  {errors.latitude}
                </p>
              )}
              <input
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="Latitude *"
                type="number"
                step="any"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                  ${
                    errors.latitude
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-300"
                  }`}
              />
            </div>

            {/* Longitude */}
            <div className="flex flex-col">
              {errors.longitude && (
                <p className="text-red-500 text-xs sm:text-sm mb-1">
                  {errors.longitude}
                </p>
              )}
              <input
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="Longitude *"
                type="number"
                step="any"
                className={`w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl border focus:outline-none focus:ring-2 transition
                  ${
                    errors.longitude
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-orange-300"
                  }`}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition"
                >
                  Update
                </button>

                <button
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                  }}
                  className="w-full sm:w-auto bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAdd}
                className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition hover:opacity-95"
              >
                Add Branch
              </button>
            )}
          </div>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <div className="flex justify-between mb-4">
                <MapPin size={28} className="text-orange-500" />
                <div className="flex gap-3">
                  <Pencil
                    onClick={() => handleEdit(branch)}
                    className="cursor-pointer text-blue-500"
                    size={20}
                  />
                  <Trash2
                    onClick={() => handleDelete(branch.id)}
                    className="cursor-pointer text-red-500"
                    size={20}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold">
                {branch.branch_name}
              </h3>
              <p className="text-gray-500">{branch.location}</p>

              <div className="flex items-center gap-2 mt-2">
                <Phone size={16} />
                <span>{branch.phone}</span>
              </div>
              {branch.latitude !== null &&
              branch.latitude !== undefined &&
              branch.longitude !== null &&
              branch.longitude !== undefined && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Latitude: {branch.latitude}</p>
                  <p>Longitude: {branch.longitude}</p>
                </div>
              )}

              <a
                href={getMapLink(branch)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
              >
                <Navigation size={16} />
                Get Direction
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}