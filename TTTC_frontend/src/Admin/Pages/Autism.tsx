import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAutism, updateAutism } from "@/services/modules/Autism.api";
import { endpoints } from "@/services/api/endpoints";

const AboutAutism = () => {
  const navigate = useNavigate();

  const [id, setId] = useState<number | null>(null);
  const [autismThen, setAutismThen] = useState("");
  const [autismNow, setAutismNow] = useState("");

  const [editField, setEditField] = useState<"then" | "now" | null>(null);
  const [value, setValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ FETCH DATA
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
      setError(err.message || "Failed to load data");
      setTimeout(() => navigate(endpoints.admin.login), 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ✅ EDIT MODE
  const handleEdit = (type: "then" | "now") => {
    setError(null);
    setEditField(type);
    setValue(type === "then" ? autismThen : autismNow);
  };

  // ✅ UPDATE LOGIC
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
      autism_now: editField === "now" ? value : autismNow,
    };

    try {
      setUpdating(true);
      setError(null);

      await updateAutism(id, updatedData);

      // update UI immediately
      if (editField === "then") {
        setAutismThen(value);
      } else if (editField === "now") {
        setAutismNow(value);
      }

      setEditField(null);
      setValue("");
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10  md:pt-4 ">
          <h2 className="text-3xl font-bold text-primary">
            Understanding <span className="text-black">Autism</span>
          </h2>
          <p className="text-gray-500 mt-2">
            Manage autism awareness statistics.
          </p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg mb-6">
              In 1970, <strong>1 in {autismThen}</strong> children were affected.
            </p>

            <div className="bg-white p-6 rounded-xl shadow flex gap-4">
              <AlertCircle className="text-red-500 mt-1" />
              <p>
                Recently, <strong>1 in {autismNow}</strong> children are affected.
              </p>
            </div>
          </div>

          <div className="grid gap-6">

            {/* 1970 */}
            <div className="bg-success/20 border-2 border-success/30 p-6 rounded-xl shadow text-center">
              <p className="text-gray-500">1970</p>

              {editField === "then" ? (
                <>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="my-3 text-center"
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update"}
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-success my-3">
                    1 in {autismThen}
                  </h3>
                  <Button size="sm" onClick={() => handleEdit("then")}>
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                </>
              )}
            </div>

            {/* Today */}
            <div className="bg-primary/20 border-primary/30 border-2 p-6 rounded-xl shadow text-center">
              <p className="text-gray-500">Today</p>

              {editField === "now" ? (
                <>
                  <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="my-3 text-center"
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={updating}
                  >
                    {updating ? "Updating..." : "Update"}
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold text-primary my-3">
                    1 in {autismNow}
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
      </div>
    </section>
  );
};

export default AboutAutism;