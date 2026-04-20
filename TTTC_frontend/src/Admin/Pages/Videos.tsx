import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { endpoints } from "@/services/api/endpoints";
import { api } from "@/services/api/client";

export default function Videos() {
  const navigate = useNavigate();

  const [videos, setVideos] = useState<any[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const token = localStorage.getItem("token");

  // ================= FETCH VIDEOS =================
  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(endpoints.youtube.list);

      const result = res.data;
      const allData = result?.results ? result.results : result;

      setVideos(allData);
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
    fetchVideos();
  }, []);

  // ================= UPLOAD VIDEO =================
  const handleUpload = async () => {
    if (!youtubeUrl.trim()) {
      setError("YouTube URL is required");
      return;
    }

    try {
      await api.post(endpoints.youtube.list, {
        youtube_url: youtubeUrl,
      });

      setYoutubeUrl("");
      setError("");
      fetchVideos();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate(endpoints.admin.login);
      } else {
        setError("Upload failed");
      }
    }
  };

  // ================= DELETE VIDEO =================
  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm("Delete this video?")) return;

    try {
      await api.delete(`${endpoints.youtube.list}${id}/`);
      fetchVideos();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        navigate(endpoints.admin.login);
      } else {
        console.log("Delete error", err);
      }
    }
  };

  // ================= EXTRACT EMBED URL =================
  const getEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2]?.length === 11 ? match[2] : "";
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // ================= UI =================
 return (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
    <h1 className="text-2xl pt-8 sm:text-3xl text-primary font-bold mb-6 sm:mb-8">
      YouTube <span className="text-black">Videos</span>
    </h1>

    {/* ================= Upload Section ================= */}
    <div className="mb-8 sm:mb-10">
      {error && (
        <p className="text-red-500 text-sm mb-2">
          {error}
        </p>
      )}

      {/* Mobile = column | Desktop = row */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Enter YouTube URL *"
          value={youtubeUrl}
          onChange={(e) => {
            setYoutubeUrl(e.target.value);
            setError("");
          }}
          className={`border px-4 py-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-300"
              : "border-gray-300 focus:ring-primary/40"
          }`}
        />

        <button
          onClick={handleUpload}
          className="bg-primary text-white px-6 py-3 rounded-lg shadow hover:opacity-90 w-full sm:w-auto"
        >
          Upload
        </button>
      </div>
    </div>

    {loading && <p>Loading...</p>}

    {/* ================= Empty State ================= */}
    {videos.length === 0 && !loading ? (
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow text-center text-gray-500">
        No Videos Available
      </div>
    ) : (
      /* Desktop same layout | Mobile improved */
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {videos.map((video) => (
          <div
            key={video.id}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden border p-4"
          >
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">
              {video.title}
            </h2>

            <button
              onClick={() => handleDelete(video.id)}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md z-10"
            >
              <Trash2 size={16} />
            </button>

            {/* Responsive iframe height */}
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full rounded-lg"
                src={getEmbedUrl(video.youtube_url)}
                title="YouTube video"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
