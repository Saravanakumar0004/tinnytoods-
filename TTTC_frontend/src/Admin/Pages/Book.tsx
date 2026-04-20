import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { endpoints } from "@/services/api/endpoints";
import { api } from "@/services/api/client";

type ContactType = {
  id: number;
  date: string;
  time: string;
  branch: string; 
  therapy_type: string;
  parent_name: string;
  child_name: string
  phone: string;
  email: string;
  notes: string;
  status: string;
};

export default function Contact() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch All Contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(endpoints.book.create);

      const result = res.data;
      const allData = result?.results ? result.results : result;

      setContacts(allData);
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
    fetchContacts();
  }, []);
  
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.patch(
        endpoints.book.list_id.replace(":id", String(id)),
        { status }
      );

      // Update UI instantly (no refetch needed)
      setContacts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );

    } catch (err: any) {
      console.error("Status update error:", err);
      setError(
        err?.response?.data?.detail ||
        "Status update failed. Please try again."
      );
    }
  };


  // Delete Contact
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await api.delete(endpoints.book.list_id.replace(":id",String(id)));
      setContacts((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError("Delete failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <h1 className="text-3xl pt-4 font-bold text-primary mb-6 sm:mb-8">
        Therapy <span className="text-black">Bookings</span>
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* ================= RESPONSIVE CARD GRID (Mobile 1 / Laptop 2) ================= */}
      <div className="mt-6">
        {!loading && contacts.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            No bookings found
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  {item.date} | {item.time}
                </span>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              <p><strong>Branch:</strong> {item.branch}</p>
              <p><strong>Therapy:</strong> {item.therapy_type}</p>
              <p><strong>Parent:</strong> {item.parent_name}</p>
              <p><strong>Child:</strong> {item.child_name}</p>
              <p><strong>Phone:</strong> {item.phone}</p>
              <p><strong>Email:</strong> {item.email}</p>
              <p className="break-words"><strong>Notes:</strong> {item.notes}</p>

              <div className="pt-2">
                <strong>Status:</strong>
                <select
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  className="border px-2 py-1 rounded text-sm w-full mt-1"
                >
                  <option value="pending">Pending</option>
                  <option value="on_hold">On Hold</option>
                  <option value="closed">Closed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
