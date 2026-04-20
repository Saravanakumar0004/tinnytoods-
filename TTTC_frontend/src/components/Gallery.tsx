import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Star,
  ExternalLink,
} from "lucide-react";
import {
  getAllCategories,
  getAllPhotos,
  getPhotosByCategorySlug,
  type GalleryCategory,
  type GalleryPhoto,
} from "@/services/modules/gallery.api";

// ── category badge colours ────────────────────────────────────────────────────
const categoryColors: Record<string, string> = {
  Therapy: "bg-primary text-primary-foreground",
  Facilities: "bg-sky text-sky-foreground",
  Activities: "bg-accent text-accent-foreground",
  Support: "bg-lavender text-lavender-foreground",
  iqsharp: "bg-primary text-primary-foreground",
};

const getCategoryBadgeClass = (slug?: string) =>
  categoryColors[slug ?? ""] ??
  "bg-card text-foreground border border-border";

// ─────────────────────────────────────────────────────────────────────────────

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [likedImages, setLikedImages] = useState<number[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<Record<string, GalleryPhoto[]>>({});

  // ── initial load ────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const cats = await getAllCategories();
        setCategories(cats);
        const all = await getAllPhotos();
        setPhotos(all);
        cacheRef.current["all"] = all;
      } catch (e) {
        console.error(e);
        setError("Failed to load gallery. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── category buttons ────────────────────────────────────────────────────────
  const categoryButtons = useMemo(
    () => [
      { label: "All", value: "all" },
      ...categories.map((c) => ({ label: c.name, value: c.slug })),
    ],
    [categories]
  );

  // ── filter handler ──────────────────────────────────────────────────────────
  const handleCategoryClick = async (slug: string) => {
    setFilter(slug);
    setSelectedImage(null);

    const cached = cacheRef.current[slug];
    if (cached) {
      setPhotos(cached);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data =
        slug === "all"
          ? await getAllPhotos()
          : await getPhotosByCategorySlug(slug);
      cacheRef.current[slug] = data;
      setPhotos(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load photos for this category.");
    } finally {
      setLoading(false);
    }
  };

  // ── lightbox navigation ─────────────────────────────────────────────────────
  const handlePrev = () => {
    if (selectedImage === null) return;
    const idx = photos.findIndex((img) => img.id === selectedImage);
    const prev = idx > 0 ? idx - 1 : photos.length - 1;
    setSelectedImage(photos[prev].id);
  };

  const handleNext = () => {
    if (selectedImage === null) return;
    const idx = photos.findIndex((img) => img.id === selectedImage);
    const next = idx < photos.length - 1 ? idx + 1 : 0;
    setSelectedImage(photos[next].id);
  };

  // ── keyboard navigation ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedImage, photos]);

  // ── like toggle ─────────────────────────────────────────────────────────────
  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedImages((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedImageData = photos.find((img) => img.id === selectedImage);

  // ── close lightbox ──────────────────────────────────────────────────────────
  const closeLightbox = () => setSelectedImage(null);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="gallery"
      className="py-10 md:py-24 bg-background relative overflow-hidden"
    >
      {/* Background blobs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 30, repeat: Infinity }}
        className="absolute top-20 right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Floating icons */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [-10, 10, -10] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-32 left-16 text-primary/30 hidden md:block pointer-events-none"
      >
        <Images className="w-10 h-10" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-40 right-16 text-accent/40 hidden md:block pointer-events-none"
      >
        <Star className="w-8 h-8 fill-current" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Images className="w-4 h-4" />
            Our Moments
          </motion.div>

          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Photo <span className="text-gradient">Gallery</span>
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Explore our therapy center, activities, and the joyful moments we
            share with our children.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10"
        >
          {categoryButtons.map((c) => (
            <motion.button
              key={c.value}
              onClick={() => handleCategoryClick(c.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 md:px-5 py-2 rounded-full font-medium text-xs md:text-sm transition-all ${
                filter === c.value
                  ? "bg-primary text-primary-foreground shadow-colored"
                  : "bg-card text-muted-foreground hover:bg-secondary border border-border"
              }`}
            >
              {c.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
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
              Loading photos...
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && photos.length === 0 && (
          <div className="text-center text-muted-foreground py-20 bg-card rounded-2xl border border-border">
            <Images className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No photos found.</p>
          </div>
        )}

        {/* ── GALLERY GRID ────────────────────────────────────────────────── */}
        {!loading && photos.length > 0 && (
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1rem",
            }}
          >
            <AnimatePresence mode="popLayout">
              {photos.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedImage(image.id)}
                  className="cursor-pointer group relative"
                >
                  {/* Card — uniform 4:3 aspect, no row-span */}
                  <div
                    className="relative overflow-hidden rounded-2xl shadow-soft group-hover:shadow-float transition-shadow duration-500"
                    style={{ aspectRatio: "4/3" }}
                  >
                    {/* Photo */}
                    <img
                      src={image.image_url}
                      alt={image.title || image.category?.name || "Photo"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${getCategoryBadgeClass(
                        image.category?.slug
                      )}`}
                    >
                      {image.category?.name}
                    </div>

                    {/* Like button */}
                    <motion.button
                      onClick={(e) => toggleLike(image.id, e)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          likedImages.includes(image.id)
                            ? "text-destructive fill-destructive"
                            : "text-muted-foreground"
                        }`}
                      />
                    </motion.button>

                    {/* Title + description overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="text-white font-heading font-bold text-sm md:text-base line-clamp-1">
                        {image.title || image.category?.name}
                      </h3>
                      <p className="text-white/80 text-xs mt-1 line-clamp-2 hidden md:block">
                        {image.description}
                      </p>
                    </div>

                    {/* Centre view icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── LIGHTBOX ──────────────────────────────────────────────────────
         *
         * FIXES APPLIED:
         *   1. style={{ zIndex: 99999 }} on the backdrop — ensures the lightbox
         *      renders ABOVE the sticky/fixed navbar (which typically uses
         *      z-index 50–100). Tailwind's z-50 class resolves to z-index:50
         *      which is lower than most navbars.
         *
         *   2. Every interactive element (close btn, prev, next, content div)
         *      uses e.stopPropagation() so clicks inside don't bubble up to
         *      the backdrop's onClick and accidentally close the lightbox.
         *
         *   3. Close button uses BOTH e.stopPropagation() AND calls
         *      closeLightbox() explicitly — belt-and-suspenders approach.
         *
         *   4. Added a visible "← Back" text button in the top-left as a
         *      clear, accessible exit affordance in addition to the X icon.
         * ─────────────────────────────────────────────────────────────────── */}
      </div>

      {/* Lightbox rendered OUTSIDE the container div so nothing clips it */}
      <AnimatePresence>
        {selectedImage !== null && selectedImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,          /* ← Above navbar */
              backgroundColor: "rgba(0,0,0,0.93)",
              backdropFilter: "blur(12px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            {/* ── Top bar: Back button (left) + Close button (right) ── */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.5rem",
                zIndex: 100000,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Back / Cancel button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  padding: "0.45rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  backdropFilter: "blur(8px)",
                }}
              >
                <ChevronLeft style={{ width: 16, height: 16 }} />
                Back
              </motion.button>


            </div>

            {/* ── Prev arrow ── */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 100000,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronLeft style={{ width: 28, height: 28, color: "#fff" }} />
            </motion.button>

            {/* ── Next arrow ── */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              style={{
                position: "absolute",
                right: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 100000,
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              <ChevronRight style={{ width: 28, height: 28, color: "#fff" }} />
            </motion.button>

            {/* ── Image + details card ── */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 860,
                width: "100%",
                zIndex: 100000,
                marginTop: "4rem", /* space for top bar */
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                  aspectRatio: "16/9",
                }}
              >
                <img
                  src={selectedImageData.image_url}
                  alt={selectedImageData.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Info */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ textAlign: "center", marginTop: "1.25rem" }}
              >
                <h3
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
                    marginBottom: "0.5rem",
                    lineHeight: 1.3,
                  }}
                >
                  {selectedImageData.title}
                </h3>

                {selectedImageData.description && (
                  <p
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.9rem",
                      maxWidth: 520,
                      margin: "0 auto 0.75rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedImageData.description}
                  </p>
                )}

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    padding: "0.3rem 0.9rem",
                    borderRadius: "9999px",
                    fontSize: "0.8rem",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Sparkles style={{ width: 14, height: 14 }} />
                  {selectedImageData.category?.name}
                </span>

                {/* Counter */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: "0.75rem",
                    marginTop: "0.75rem",
                  }}
                >
                  {photos.findIndex((p) => p.id === selectedImage) + 1} /{" "}
                  {photos.length}
                </p>


              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;