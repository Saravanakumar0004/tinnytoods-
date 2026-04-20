import { useEffect, useRef, useState } from "react";
import { profileAPI } from "@/services/modules/profile.api";
import { Pencil, X, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import profile from "@/assets/profile.png";

export default function Profile() {
  const [fullName, setFullName] = useState("");
  const [editMode, setEditMode] = useState(false);

  // store original name to restore on cancel
  const originalNameRef = useRef("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ loading
  const [changingPass, setChangingPass] = useState(false);
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setError("");
      const data = await profileAPI.getProfile();
      const name = data.full_name || "";
      setFullName(name);
      originalNameRef.current = name;
    } catch {
      setError("Failed to load profile");
    }
  };

  const handleStartEdit = () => {
    setMessage("");
    setError("");
    originalNameRef.current = fullName;
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setFullName(originalNameRef.current);
    setEditMode(false);
    setMessage("");
    setError("");
  };

  const handleUpdateProfile = async () => {
    try {
      setError("");
      setMessage("");

      if (!fullName.trim()) {
        setError("Full name is required");
        return;
      }

      setSavingName(true);
      await profileAPI.updateProfile(fullName.trim());

      setMessage("Profile updated successfully");
      originalNameRef.current = fullName.trim();
      setEditMode(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Profile update failed");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setError("");
      setMessage("");

      if (!oldPassword || !newPassword) {
        setError("All password fields required");
        return;
      }

      setChangingPass(true);
      await profileAPI.setPassword(oldPassword, newPassword);

      setMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setShowOld(false);
      setShowNew(false);
      setShowPasswordForm(false);
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Password change failed");
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="min-h-[90dvh] bg-gray-50 flex justify-center items-start pt-3 md:pt-[60px] py-6 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-10">
              <div className="flex justify-center">
        <div className="rounded-2xl ">
          <img
            src={profile}
            alt="Admin Logo"
            className="w-48 h-46 object-contain"
          />
        </div>
      </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-primary">
          Admin <span className="text-black">Profile</span>
        </h2>

        {(message || error) && (
          <div className="mb-3 text-sm text-center">
            {message && <div className="text-green-600">{message}</div>}
            {error && <div className="text-red-600">{error}</div>}
          </div>
        )}

        {/* ================= FULL NAME SECTION ================= */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Full Name</label>

          {!editMode ? (
            <div className="flex items-center justify-between gap-3 border px-3 py-3 rounded-lg bg-gray-50">
              <span className="text-sm sm:text-base truncate">
                {fullName || "-"}
              </span>

              <button
                onClick={handleStartEdit}
                className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border hover:bg-gray-100"
                type="button"
                title="Edit name"
              >
                <Pencil className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          ) : (
            <div className="border rounded-lg p-3 bg-white">
              <div className="relative mb-3">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border px-3 py-3 pr-12 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="Enter full name"
                  disabled={savingName}
                />
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center justify-center"
                  title="Cancel"
                  disabled={savingName}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleUpdateProfile}
                className="w-[150px] ml-[90px] bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
                type="button"
                disabled={savingName}
              >
                {savingName ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          )}
        </div>

        {/* ================= RESET PASSWORD TOGGLE ================= */}
        <div className="mb-4">
          {!showPasswordForm ? (
            <button
              type="button"
              onClick={() => {
                setMessage("");
                setError("");
                setOldPassword("");
                setNewPassword("");
                setShowOld(false);
                setShowNew(false);
                setShowPasswordForm(true);
              }}
              className="w-full inline-flex items-center justify-center gap-2 border bg-white hover:bg-gray-50 py-3 rounded-lg transition"
            >
              <Lock className="w-4 h-4 text-blue-600" />
              Reset Password
            </button>
          ) : (
            <div className="border rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Reset Password</h3>
                <button
                  type="button"
                  onClick={() => {
                    setOldPassword("");
                    setNewPassword("");
                    setShowOld(false);
                    setShowNew(false);
                    setShowPasswordForm(false);
                    setMessage("");
                    setError("");
                  }}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border bg-white hover:bg-gray-100"
                  title="Close"
                  disabled={changingPass}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative mb-3">
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old Password"
                  className="w-full border px-3 py-3 pr-12 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={changingPass}
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center justify-center"
                  title={showOld ? "Hide" : "Show"}
                  disabled={changingPass}
                >
                  {showOld ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full border px-3 py-3 pr-12 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={changingPass}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center justify-center"
                  title={showNew ? "Hide" : "Show"}
                  disabled={changingPass}
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
                type="button"
                disabled={changingPass}
              >
                {changingPass ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}