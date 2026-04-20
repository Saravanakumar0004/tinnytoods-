import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { endpoints } from "@/services/api/endpoints";
import { api } from "@/services/api/client";

export default function Contact() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================= FETCH CONTACTS =================
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(endpoints.contact.create);
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

  // ================= STATUS CHANGE =================
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.patch(
        endpoints.contact.list_id.replace(":id", String(id)),
        { status }
      );

      setContacts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (err: any) {
      console.error("Status update error:", err);
      setError(
        err?.response?.data?.detail ||
          "Status update failed. Please try again."
      );
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      await api.delete(
        endpoints.contact.list_id.replace(":id", String(id))
      );
      setContacts((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError("Delete failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl pt-5 font-bold text-primary">
            Contact <span className="text-black"> Messages </span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage and review user inquiries
          </p>
        </div>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500 mb-6">{error}</p>}

        {contacts.length === 0 && !loading ? (
          <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
            No Contact Messages Available
          </div>
        ) : (
          <>
            {/* ================= MOBILE VIEW ================= */}
            <div className="grid grid-cols-1 gap-4 sm:hidden">
              {contacts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 break-words">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 break-words">
                        {item.email}
                      </p>
                      <p className="text-sm text-gray-600 break-words">
                        {item.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="shrink-0 inline-flex items-center gap-1
                      bg-red-500 hover:bg-red-600 text-white
                      text-xs px-2 py-1 rounded-lg shadow-sm transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-gray-500">Message</p>
                    <p className="text-sm text-gray-700 leading-relaxed break-words mt-1">
                      {item.message}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Sender Time</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item.id, e.target.value)
                        }
                        className="w-full border border-gray-300
                        text-sm px-3 py-2 rounded-xl
                        bg-white outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        <option value="pending" className="text-yellow-500">Pending</option>
                        <option value="on_hold">On Hold</option>
                        <option value="closed">Closed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP / TABLET ================= */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm table-auto">
                <thead className="bg-primary text-white uppercase text-xs">
                  <tr>
                    <th className="px-3 py-4 text-center w-[120px]">Name</th>

                    {/* ✅ email only needed width */}
                    <th className="px-3 py-4 text-center w-[200px]">Email</th>

                    <th className="px-3 py-4 text-center w-[120px]">Phone</th>

                    {/* ✅ message gets max space */}
                    <th className="px-3 py-4 text-center">Message</th>

                    <th className="px-3 py-4 text-center w-[160px]">Sender Time</th>

                    {/* ✅ very compact */}
                    <th className="px-2 py-4 text-center w-[100px]">Status</th>
                    <th className="px-2 py-4 text-center w-[90px]">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {contacts.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition align-top"
                    >
                      <td className="px-3 py-4 font-medium text-gray-800 text-left break-words">
                        {item.name}
                      </td>

                      {/* ✅ email tight */}
                      <td className="px-3 py-4 text-gray-600 text-left break-all">
                        {item.email}
                      </td>

                      <td className="px-3 py-4 text-gray-600 text-center whitespace-nowrap">
                        {item.phone}
                      </td>

                      {/* ✅ message expands naturally */}
                      <td className="px-3 py-4 text-gray-600 text-left whitespace-normal break-words">
                        {item.message}
                      </td>

                      <td className="px-3 py-4 text-gray-500 text-xs text-center whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString()}
                      </td>

                      {/* ✅ smaller dropdown */}
                      <td className="px-2 py-4 text-center">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="w-[90px] border border-gray-300 px-1.5 py-1 rounded-md bg-white outline-none focus:ring-2 focus:ring-primary/30 text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="on_hold">On Hold</option>
                          <option value="closed">Closed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* ✅ smaller delete button */}
                      <td className="px-2 py-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-md text-xs shadow-sm transition"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}