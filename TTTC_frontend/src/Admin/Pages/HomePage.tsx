import { useEffect, useState, useRef } from "react";
import { endpoints } from "@/services/api/endpoints";
import { api } from "@/services/api/client";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false); 
  const [data, setData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const [canAdd, setCanAdd] = useState(false);

  const editFormRef = useRef<HTMLDivElement>(null);

  const addFields = [
    "years_of_experience",
    "happy_students",
    "branches",
    "qualified_teachers",
    "students_enrolled",
  ];

  const displayValue = (value: any) => {
    if (value === null || value === undefined) return "-";
    if (!isNaN(value)) return Math.round(Number(value));
    return value;
  };

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.get(endpoints.home.list);

      const fetchedData = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      const limitedData = fetchedData.slice(0, 1);

      setData(limitedData);
      setCanAdd(limitedData.length === 0);
    } catch {
      setData([]);
      setCanAdd(true);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FORM =================
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const handleEdit = (item: any) => {
    setForm(item);
    setEditingId(item.id);
    setFormErrors({});

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const validateForm = () => {
    const errors: any = {};
    addFields.forEach((field) => {
      if (!form[field] || form[field].toString().trim() === "") {
        errors[field] = "This field is required";
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!validateForm()) return;

    try {
      setError(null);
      const url = endpoints.home.list_id.replace(":id", String(editingId));
      await api.put(url, form);

      setEditingId(null);
      fetchData();
    } catch {
      setError("Update failed.");
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      setError(null);
      await api.post(endpoints.home.list, form);
      setForm({});
      setCanAdd(false);
      fetchData();
    } catch {
      setError("Add failed.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      setError(null);
      await api.delete(endpoints.home.list_id.replace(":id", String(id)));
      fetchData();
    } catch {
      setError("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10 mt-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-10 text-primary">
          Home <span className="text-black">Page</span>
        </h2>

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* ✅ First-load: ONLY show Loading (no cards/table headings) */}
        {!loaded && loading && (
          <div className="flex justify-center items-center py-10">
            <p className="text-center text-blue-600">Loading...</p>
          </div>
        )}

        {/* ✅ Render rest only after first fetch finished */}
        {loaded && !loading && (
          <>
            {/* DASHBOARD CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              {data.map((item) =>
                Object.entries(item)
                  .filter(
                    ([key]) =>
                      key !== "id" &&
                      key !== "created_at" &&
                      key !== "updated_at"
                  )
                  .map(([key, value]) => (
                    <div
                      key={key + item.id}
                      className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition border border-gray-100"
                    >
                      <h4 className="text-gray-500 text-xs sm:text-sm uppercase tracking-wider">
                        {key.replace(/_/g, " ")}
                      </h4>
                      <p className="text-xl sm:text-2xl md:text-4xl font-bold text-orange-500 mt-2 md:mt-4">
                        {displayValue(value)}
                      </p>
                    </div>
                  ))
              )}
            </div>

            {/* EDIT FORM */}
            {editingId && (
              <div
                ref={editFormRef}
                className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl mb-8 md:mb-12 border border-gray-100"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-orange-600">
                  Edit Record
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {addFields.map((key) => (
                    <div key={key}>
                      <label className="block text-xs sm:text-sm font-medium mb-2 capitalize text-gray-600">
                        {key.replace(/_/g, " ")}
                      </label>

                      <input
                        name={key}
                        value={form[key] || ""}
                        onChange={handleChange}
                        className={`w-full border px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 outline-none transition text-sm sm:text-base ${
                          formErrors[key]
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-indigo-400"
                        }`}
                      />

                      {formErrors[key] && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors[key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10">
                  <button
                    onClick={handleUpdate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 sm:py-3 px-6 md:px-8 rounded-lg sm:rounded-xl shadow-md transition w-full sm:w-auto"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(null);
                      setFormErrors({});
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white py-2.5 sm:py-3 px-6 md:px-8 rounded-lg sm:rounded-xl shadow-md transition w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ADD FORM */}
            {canAdd && !editingId && (
              <div className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl mb-8 md:mb-12 border border-gray-100">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-primary">
                  Add Record
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                  {addFields.map((key) => (
                    <div key={key}>
                      <label className="block text-xs sm:text-sm font-medium mb-2 capitalize text-gray-600">
                        {key.replace(/_/g, " ")}
                      </label>

                      <input
                        name={key}
                        value={form[key] || ""}
                        onChange={handleChange}
                        className={`w-full border px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 outline-none transition text-sm sm:text-base ${
                          formErrors[key]
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-indigo-400"
                        }`}
                      />

                      {formErrors[key] && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">
                          {formErrors[key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10">
                  <button
                    onClick={handleAdd}
                    className="bg-primary hover:bg-blue-500 text-white py-2.5 sm:py-3 px-6 md:px-8 rounded-lg sm:rounded-xl shadow-md transition w-full sm:w-auto"
                  >
                    Add
                  </button>

                  <button
                    onClick={() => {
                      setForm({});
                      setFormErrors({});
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white py-2.5 sm:py-3 px-6 md:px-8 rounded-lg sm:rounded-xl shadow-md transition w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* TABLE */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl">
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-[600px] w-full text-sm">
                  <thead className="bg-primary text-white">
                    <tr>
                      {data.length > 0 &&
                        Object.keys(data[0])
                          .filter(
                            (key) =>
                              key !== "id" &&
                              key !== "created_at" &&
                              key !== "updated_at"
                          )
                          .map((key) => (
                            <th
                              key={key}
                              className="px-6 py-4 text-center capitalize"
                            >
                              {key.replace(/_/g, " ")}
                            </th>
                          ))}
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-indigo-50 transition"
                      >
                        {Object.entries(item)
                          .filter(
                            ([key]) =>
                              key !== "id" &&
                              key !== "created_at" &&
                              key !== "updated_at"
                          )
                          .map(([key, value]) => (
                            <td key={key} className="px-6 py-4 text-center">
                              {displayValue(value)}
                            </td>
                          ))}

                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW */}
              <div className="md:hidden p-4 space-y-4">
                {data.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-2xl p-4 shadow-md bg-white"
                  >
                    {Object.entries(item)
                      .filter(
                        ([key]) =>
                          key !== "id" &&
                          key !== "created_at" &&
                          key !== "updated_at"
                      )
                      .map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-start mb-3"
                        >
                          <span className="text-gray-500 text-sm capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-primary font-medium text-right max-w-[60%] break-words">
                            {displayValue(value)}
                          </span>
                        </div>
                      ))}

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg shadow-md transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow-md transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              
            </div>
          </>
        )}
      </div>
    </div>
  );
}