import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, X, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { endpoints } from "@/services/api/endpoints";
import { api } from "@/services/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────
interface QuestionItem {
  id: number;
  question: string;
  description: string;
}

interface FormState {
  question: string;
  description: string;
}

interface FormErrors {
  question: string;
  description: string;
}

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// ─── Toast component ──────────────────────────────────────────────────────────
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium
        animate-in slide-in-from-right-5 fade-in duration-300
        ${toast.type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
        }`}
    >
      {toast.type === "success"
        ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
        : <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
      }
      <span>{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="ml-1 opacity-50 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-3" />
      <div className="h-3 bg-gray-100 rounded-lg w-full mb-2" />
      <div className="h-3 bg-gray-100 rounded-lg w-5/6" />
    </div>
  );
}

// ─── Delete confirm inline ────────────────────────────────────────────────────
function DeleteConfirm({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center gap-3 z-10 p-4">
      <p className="text-sm font-medium text-gray-700 text-center">
        Delete this question?
      </p>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-xl
                     hover:bg-red-600 active:scale-[0.98] transition"
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl
                     hover:bg-gray-200 active:scale-[0.98] transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Question() {
  const navigate = useNavigate();

  const [data, setData] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({ question: "", description: "" });
  const [errors, setErrors] = useState<FormErrors>({ question: "", description: "" });

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const formRef = useRef<HTMLDivElement | null>(null);
  const toastCounter = useRef(0);

  // ─── Toast helpers ───────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastType) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Fetch ───────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await api.get(endpoints.ques.list);
      const result = res.data;
      const allData: QuestionItem[] = result?.results ?? result;
      setData(allData);
    } catch (err: unknown) {
      const e = err as { response?: { status: number }; message?: string };
      if (e.response?.status === 401) {
        setFetchError("Session expired. Redirecting to login…");
        setTimeout(() => navigate(endpoints.admin.login), 1500);
      } else {
        setFetchError(e.message ?? "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Form helpers ─────────────────────────────────────────────────────────
  const resetForm = () => {
    setForm({ question: "", description: "" });
    setErrors({ question: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = { question: "", description: "" };
    if (!form.question.trim()) newErrors.question = "Question is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return !newErrors.question && !newErrors.description;
  };

  // ─── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(endpoints.ques.list_id(editingId), form);
        addToast("Question updated successfully.", "success");
      } else {
        await api.post(endpoints.ques.list, form);
        addToast("Question added successfully.", "success");
      }
      resetForm();
      fetchData();
    } catch (err: unknown) {
      const e = err as { message?: string };
      addToast(e.message ?? "Failed to save. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Edit ────────────────────────────────────────────────────────────────
  const handleEdit = (item: QuestionItem) => {
    setEditingId(item.id);
    setForm({ question: item.question, description: item.description });
    setErrors({ question: "", description: "" });
    setShowForm(true);
    // Scroll after state settles — rAF is more reliable than setTimeout
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // ─── Delete ──────────────────────────────────────────────────────────────
  const handleDeleteConfirmed = async (id: number) => {
    setConfirmDeleteId(null);
    try {
      await api.delete(endpoints.ques.list_id(id));
      setData((prev) => prev.filter((item) => item.id !== id));
      addToast("Question deleted.", "success");
    } catch (err: unknown) {
      const e = err as { message?: string };
      addToast(e.message ?? "Failed to delete.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">

      {/* ── Toast tray ── */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismissToast} />
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pt-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Question <span className="text-black">Management</span>
          </h2>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); setForm({ question: "", description: "" }); }}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5
                         rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] transition"
            >
              <Plus size={16} />
              Add Question
            </button>
          )}
        </div>

        {/* ── Global fetch error ── */}
        {fetchError && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700
                          text-sm rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} className="flex-shrink-0" />
            {fetchError}
          </div>
        )}

        {/* ── Form ── */}
        {showForm && (
          <div
            ref={formRef}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? "Edit Question" : "New Question"}
              </h3>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Question field */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Question <span className="text-red-400">*</span>
                </label>
                <input
                  name="question"
                  placeholder="e.g. How old is your child?"
                  value={form.question}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2.5 rounded-xl text-sm outline-none transition
                    focus:ring-2 focus:ring-primary/25
                    ${errors.question ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary/50"}`}
                />
                {errors.question && (
                  <span className="text-red-500 text-xs">{errors.question}</span>
                )}
              </div>

              {/* Description field */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-400">*</span>
                </label>
                <input
                  name="description"
                  placeholder="e.g. Select the age range that applies"
                  value={form.description}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2.5 rounded-xl text-sm outline-none transition
                    focus:ring-2 focus:ring-primary/25
                    ${errors.description ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary/50"}`}
                />
                {errors.description && (
                  <span className="text-red-500 text-xs">{errors.description}</span>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-medium
                           hover:opacity-90 active:scale-[0.98] transition
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting
                  ? (editingId ? "Updating…" : "Adding…")
                  : (editingId ? "Update Question" : "Add Question")
                }
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600
                           bg-gray-100 hover:bg-gray-200 active:scale-[0.98] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Loading skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && data.length === 0 && !fetchError && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <HelpCircle size={26} className="text-primary" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">No questions yet</h3>
            <p className="text-sm text-gray-500 mb-5">Add your first question to get started.</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5
                         rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              <Plus size={16} /> Add Question
            </button>
          </div>
        )}

        {/* ── Question cards ── */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="relative bg-white rounded-2xl border border-gray-100 shadow-sm
                           p-4 sm:p-6 overflow-hidden group"
              >
                {/* Inline delete confirm overlay */}
                {confirmDeleteId === item.id && (
                  <DeleteConfirm
                    onConfirm={() => handleDeleteConfirmed(item.id)}
                    onCancel={() => setConfirmDeleteId(null)}
                  />
                )}

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-xl hover:bg-yellow-50 text-yellow-600 transition"
                    aria-label="Edit question"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(item.id)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-500 transition"
                    aria-label="Delete question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="pr-20">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 break-words leading-snug">
                    {item.question}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed break-words">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}