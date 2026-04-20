import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import { Pencil, Trash2, Plus, X, Loader2, AlertCircle, ServerCrash } from "lucide-react";
import { endpoints } from "@/services/api/endpoints";
import { api } from "@/services/api/client";

import {
  Activity, Award, Baby, BookOpen, Brain, Calculator, ClipboardList,
  Dna, Ear, Eye, GraduationCap, HandHeart, HeartPulse, HelpingHand,
  Library, Lightbulb, Mic, Notebook, PenTool, Puzzle, School,
  ShieldCheck, Smile, Sparkles, Star, Stethoscope, Target, Timer,
  UserCheck, Users,
} from "lucide-react";

const iconList = {
  Activity, Award, Baby, BookOpen, Brain, Calculator, ClipboardList,
  Dna, Ear, Eye, GraduationCap, HandHeart, HeartPulse, HelpingHand,
  Library, Lightbulb, Mic, Notebook, PenTool, Puzzle, School,
  ShieldCheck, Smile, Sparkles, Star, Stethoscope, Target, Timer,
  UserCheck, Users,
};

const EMPTY_FORM = { title: "", description: "", icon: "" };
const EMPTY_ERRS = { title: "", description: "", icon: "" };

function IconBadge({ name, size = 20 }: { name: string; size?: number }) {
  const Comp = iconList[name as keyof typeof iconList] || Icons.HelpCircle;
  return <Comp size={size} />;
}

export default function Service() {
  const navigate = useNavigate();

  const [data, setData]               = useState<any[]>([]);
  const [editingId, setEditingId]     = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formRef     = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading]         = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [deletingId, setDeletingId]   = useState<number | null>(null);

  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_ERRS);

  // ── fetch ────────────────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res    = await api.get(endpoints.services.list);
      const result = res.data;
      setData(
        Array.isArray(result)
          ? result
          : Array.isArray(result?.results)
          ? result.results
          : []
      );
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate(endpoints.admin.login), 1500);
      } else {
        setError(err.message || "Failed to load services.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── close dropdown on outside click ─────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpenDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors(EMPTY_ERRS);
  };

  // ── submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const newErrors: any = {};
    if (!form.title.trim())       newErrors.title       = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.icon)               newErrors.icon        = "Please select an icon";
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(endpoints.services.list_id(editingId), form);   // ✅ function call
      } else {
        await api.post(endpoints.services.list, form);
      }
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── edit ─────────────────────────────────────────────────────────────────
  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, icon: item.icon });
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  // ── delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      setDeletingId(id);
      await api.delete(endpoints.services.list_id(id));               // ✅ function call
      fetchData();
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              Services <span className="text-primary">Management</span>
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, update and manage your service offerings.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full">
            <Icons.Layers size={15} />
            {data.length} service{data.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Form card */}
        <div ref={formRef} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="bg-primary/5 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              {editingId
                ? <><Pencil size={16} className="text-primary" /> Edit Service</>
                : <><Plus   size={16} className="text-primary" /> Add New Service</>}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition">
                <X size={18} />
              </button>
            )}
          </div>

          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Icon picker */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Icon</label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className={`w-full flex items-center justify-between gap-2 border rounded-xl px-4 py-2.5 bg-white text-sm transition focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                    errors.icon ? "border-red-400" : "border-slate-200 hover:border-primary/50"
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {form.icon
                      ? <span className="text-primary"><IconBadge name={form.icon} size={17} /></span>
                      : <span className="text-slate-400"><Icons.Smile size={17} /></span>}
                    <span className={form.icon ? "text-slate-700" : "text-slate-400"}>
                      {form.icon || "Choose icon"}
                    </span>
                  </span>
                  <Icons.ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform ${openDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {errors.icon && <p className="mt-1 text-xs text-red-500">{errors.icon}</p>}

                {openDropdown && (
                  <div className="absolute left-0 top-full mt-2 w-full sm:w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-56 overflow-y-auto">
                    {Object.keys(iconList).map((name) => (
                      <div
                        key={name}
                        onClick={() => {
                          setForm({ ...form, icon: name });
                          setErrors({ ...errors, icon: "" });
                          setOpenDropdown(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm hover:bg-primary/10 transition ${
                          form.icon === name ? "bg-primary/10 text-primary font-medium" : "text-slate-700"
                        }`}
                      >
                        <span className="text-primary"><IconBadge name={name} size={16} /></span>
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Title</label>
                <input
                  name="title"
                  placeholder="e.g. Speech Therapy"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                    errors.title ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-primary/30 hover:border-primary/50"
                  }`}
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  name="description"
                  placeholder="Briefly describe this service…"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full border rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 transition ${
                    errors.description ? "border-red-400 focus:ring-red-200" : "border-slate-200 focus:ring-primary/30 hover:border-primary/50"
                  }`}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition"
              >
                {submitting
                  ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  : editingId
                  ? <><Pencil size={15} /> Update Service</>
                  : <><Plus   size={15} /> Add Service</>}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-3">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm">Loading services…</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
            <ServerCrash size={40} strokeWidth={1.5} />
            <p className="text-sm font-medium">No services found. Add one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item) => {
              const IconComp   = iconList[item.icon as keyof typeof iconList] || Icons.HelpCircle;
              const isDeleting = deletingId === item.id;
              return (
                <div
                  key={item.id}
                  className={`group relative bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 ${
                    isDeleting ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(item)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-500 transition"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
                    >
                      {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>

                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base mb-1 pr-16">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}