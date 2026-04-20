import { useEffect, useState, useRef } from "react";
import {
  getabout,
  updateAbout,
  deleteAbout,
  addAbout,
  type About,
} from "@/services/modules/about.api";


export default function AboutPage() {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<About[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<About>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const [canAdd, setCanAdd] = useState(true);

  const editFormRef = useRef<HTMLDivElement>(null);
  const addFormRef = useRef<HTMLDivElement>(null);

  const fields = [
    "success_rate",
    "parent_satisfaction",
    "improvement_rate",
    "early_detection",
    "phone_no_one",
    "phone_no_two",
  ] as const;

  // ✅ phone helpers
  const phoneFields = ["phone_no_one", "phone_no_two"] as const;
  const onlyDigits = (v: string) => v.replace(/\D/g, "");
  const isValidIndianMobile = (v: string) => /^[6-9]\d{9}$/.test(v);

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      const result = await getabout();
      const list = result ? [result] : [];

      setData(list);
      setCanAdd(list.length === 0);
    } catch (err: any) {
      setData([]);
      setCanAdd(true);
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= HELPERS =================
  const formatValue = (key: string, value: any) => {
    const percentFields = [
      "success_rate",
      "parent_satisfaction",
      "early_detection",
      "improvement_rate",
    ];
    if (!percentFields.includes(key)) return value;
    if (typeof value === "number") return `${value}%`;
    return value;
  };

  // ✅ Updated handleChange (numbers-only for phone fields)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const nextValue = phoneFields.includes(name as any)
      ? onlyDigits(value).slice(0, 10) // max 10 digits
      : value;

    setForm({ ...form, [name]: nextValue });

    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleEdit = (item: About) => {
    setEditingId(item.id);
    setForm(item);
    setFormErrors({});
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ✅ Updated validateForm (adds phone validation)
  const validateForm = () => {
    const errors: any = {};

    fields.forEach((field) => {
      const v = (form as any)[field];

      if (v === undefined || v === null || String(v).trim() === "") {
        errors[field] = "This field is required";
        return;
      }

      if (field === "phone_no_one" || field === "phone_no_two") {
        const phone = String(v);

        if (!/^\d+$/.test(phone)) {
          errors[field] = "Only numbers allowed";
        } else if (phone.length !== 10) {
          errors[field] = "Phone number must be 10 digits";
        } else if (!isValidIndianMobile(phone)) {
          errors[field] = "Enter valid Indian mobile (starts with 6-9)";
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ================= CRUD =================
  const handleUpdate = async () => {
    if (!editingId) return;
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      await updateAbout(editingId, form);
      setEditingId(null);
      setForm({});
      await fetchData();
    } catch (err: any) {
      setError(err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      await addAbout(form);
      setForm({});
      setCanAdd(false);
      await fetchData();
    } catch (err: any) {
      setError(err?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      setLoading(true);
      setError(null);
      await deleteAbout(id);
      await fetchData();
    } catch (err: any) {
      setError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ First-load: show ONLY loading
  if (!loaded && loading) {
    return (
      <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10 flex justify-center items-center">
        <p className="text-center text-blue-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl pt-8 font-bold mb-6 md:mb-10 text-primary">
          Our Growth <span className="text-black">& Impact</span>
        </h2>

        {loaded && loading && (
          <p className="text-center text-blue-600 mb-4">Loading...</p>
        )}
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* DASHBOARD CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          {data.map((item) =>
            Object.entries(item)
              .filter(
                ([key]) =>
                  key !== "id" && key !== "created_at" && key !== "updated_at"
              )
              .map(([key, value]) => (
                <div
                  key={key + item.id}
                  className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition border border-gray-100"
                >
                  <h4 className="text-gray-500 text-[10px] sm:text-xs md:text-sm uppercase tracking-wider">
                    {key.replace(/_/g, " ")}
                  </h4>
                  <p className="text-xl sm:text-2xl md:text-4xl font-bold text-orange-500 mt-2 md:mt-4">
                    {formatValue(key, value)}
                  </p>
                </div>
              ))
          )}
        </div>

        {/* ADD FORM */}
        {loaded && !loading && canAdd && !editingId && (
          <div
            ref={addFormRef}
            className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl mb-8 md:mb-12 border border-gray-100"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-green-600">
              Add New Record
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {fields.map((key) => {
                const isPhone =
                  key === "phone_no_one" || key === "phone_no_two";

                return (
                  <div key={key} className="col-span-2 sm:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-2 capitalize text-gray-600">
                      {key.replace(/_/g, " ")}
                    </label>

                    <input
                      name={key}
                      value={(form as any)[key] ?? ""}
                      onChange={handleChange}
                      type={isPhone ? "tel" : "text"}
                      inputMode={isPhone ? "numeric" : undefined}
                      placeholder={
                        isPhone ? "Enter 10-digit mobile number" : undefined
                      }
                      className={`w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 outline-none transition text-sm sm:text-base ${
                        formErrors[key]
                          ? "border-red-500 focus:ring-red-400"
                          : "border-gray-300 focus:ring-green-400"
                      }`}
                    />

                    {formErrors[key] && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">
                        {formErrors[key]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10">
              <button
                onClick={handleAdd}
                className="bg-green-600 hover:bg-green-700 text-white py-2.5 sm:py-3 px-6 md:px-8 rounded-lg sm:rounded-xl shadow-md transition w-full sm:w-auto"
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
                Clear
              </button>
            </div>
          </div>
        )}

        {/* EDIT FORM */}
        {loaded && !loading && editingId && (
          <div
            ref={editFormRef}
            className="bg-white p-5 sm:p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl mb-8 md:mb-12 border border-gray-100"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:mb-8 text-orange-600">
              Edit Record
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {fields.map((key) => {
                const isPhone =
                  key === "phone_no_one" || key === "phone_no_two";

                return (
                  <div key={key} className="col-span-2 sm:col-span-1">
                    <label className="block text-xs sm:text-sm font-medium mb-2 capitalize text-gray-600">
                      {key.replace(/_/g, " ")}
                    </label>

                    <input
                      name={key}
                      value={(form as any)[key] ?? ""}
                      onChange={handleChange}
                      type={isPhone ? "tel" : "text"}
                      inputMode={isPhone ? "numeric" : undefined}
                      placeholder={
                        isPhone ? "Enter 10-digit mobile number" : undefined
                      }
                      className={`w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl focus:ring-2 outline-none transition text-sm sm:text-base ${
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
                );
              })}
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

        {/* TABLE (DESKTOP) */}
        <div className="hidden md:block bg-white rounded-3xl shadow-2xl overflow-x-auto relative">
          <table className="min-w-[700px] w-full text-sm">
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
                      <th key={key} className="px-6 py-4 text-left capitalize">
                        {key.replace(/_/g, " ")}
                      </th>
                    ))}
                <th className="px-6 py-4 text-left whitespace-nowrap sticky right-0 bg-primary z-10">
                  Actions
                </th>
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
                      <td key={key} className="px-6 py-4">
                        {formatValue(key, value)}
                      </td>
                    ))}

                  <td className="px-6 py-4 sticky right-0 bg-white z-10">
                    <div className="flex gap-3 whitespace-nowrap">
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
        <div className="md:hidden space-y-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border p-4"
            >
              {Object.entries(item)
                .filter(
                  ([key]) =>
                    key !== "id" && key !== "created_at" && key !== "updated_at"
                )
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-2 border-b last:border-b-0 text-sm"
                  >
                    <span className="font-medium text-gray-500 capitalize">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-primary text-right">
                      {formatValue(key, value)}
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
    </div>
  );
}