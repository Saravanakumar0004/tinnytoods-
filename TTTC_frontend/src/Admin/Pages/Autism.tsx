import { useState, useEffect } from "react";
import { AlertCircle, Edit, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAutism, updateAutism } from "@/services/modules/Autism.api";

const AboutAutism = () => {
  const [id, setId] = useState<number | null>(null);
  const [autismThen, setAutismThen] = useState("");
  const [autismNow, setAutismNow] = useState("");

  const [editField, setEditField] = useState<"then" | "now" | null>(null);
  const [value, setValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── FETCH ─────────────────────────────────────────────────────────────────
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAutism();
      if (!data) throw new Error("No data found");

      setId(data.id);
      setAutismThen(data.autism_then || "");
      setAutismNow(data.autism_now || "");
    } catch (err: any) {
      // FIX: just show the error — never navigate away on fetch failure.
      // The old code had: setTimeout(() => navigate(endpoints.admin.login), 1000)
      // which logged the admin out whenever this API call failed for any reason.
      setError(err.message || "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ── EDIT ──────────────────────────────────────────────────────────────────
  const handleEdit = (type: "then" | "now") => {
    setError(null);
    setEditField(type);
    setValue(type === "then" ? autismThen : autismNow);
  };

  const handleCancel = () => {
    setEditField(null);
    setValue("");
    setError(null);
  };

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const handleUpdate = async () => {
    if (id === null) {
      setError("Invalid record ID");
      return;
    }
    if (!value.trim()) {
      setError("Value cannot be empty");
      return;
    }

    const updatedData = {
      autism_then: editField === "then" ? value : autismThen,
      autism_now:  editField === "now"  ? value : autismNow,
    };

    try {
      setUpdating(true);
      setError(null);

      await updateAutism(id, updatedData);

      if (editField === "then") setAutismThen(value);
      if (editField === "now")  setAutismNow(value);

      setEditField(null);
      setValue("");
    } catch (err: any) {
      setError(err.message || "Update failed. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <section className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10 md:pt-4">
          <h2 className="text-3xl font-bold text-primary">
            Understanding <span className="text-black">Autism</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Manage autism awareness statistics.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <p className="text-blue-600 animate-pulse">Loading...</p>
          </div>
        )}

        {/* Error — show retry, never redirect */}
        {error && !loading && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchStats}
              className="text-red-600 border-red-300 hover:bg-red-100"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Retry
            </Button>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg mb-6">
                In 1970, <strong>1 in {autismThen || "—"}</strong> children were affected.
              </p>
              <div className="bg-white p-6 rounded-xl shadow flex gap-4">
                <AlertCircle className="text-red-500 mt-1 flex-shrink-0" />
                <p>
                  Recently, <strong>1 in {autismNow || "—"}</strong> children are affected.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* 1970 card */}
              <div className="bg-success/20 border-2 border-success/30 p-6 rounded-xl shadow text-center">
                <p className="text-gray-500">1970</p>

                {editField === "then" ? (
                  <>
                    <Input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="my-3 text-center"
                      placeholder="e.g. 150"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" onClick={handleUpdate} disabled={updating}>
                        {updating ? "Updating..." : "Update"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold text-success my-3">
                      1 in {autismThen || "—"}
                    </h3>
                    <Button size="sm" onClick={() => handleEdit("then")}>
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </>
                )}
              </div>

              {/* Today card */}
              <div className="bg-primary/20 border-primary/30 border-2 p-6 rounded-xl shadow text-center">
                <p className="text-gray-500">Today</p>

                {editField === "now" ? (
                  <>
                    <Input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="my-3 text-center"
                      placeholder="e.g. 36"
                    />
                    <div className="flex gap-2 justify-center">
                      <Button size="sm" onClick={handleUpdate} disabled={updating}>
                        {updating ? "Updating..." : "Update"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-bold text-primary my-3">
                      1 in {autismNow || "—"}
                    </h3>
                    <Button size="sm" onClick={() => handleEdit("now")}>
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default AboutAutism;