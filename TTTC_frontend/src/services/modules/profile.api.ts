import { api } from "@/services/api/client";
import { endpoints } from "../api/endpoints";

export const profileAPI = {
  /* ================= GET PROFILE ================= */
  async getProfile() {
    const response = await api.get(endpoints.admin.profile);
    return response.data;
  },

  /* ================= UPDATE PROFILE ================= */
  async updateProfile(full_name: string) {
    const response = await api.patch(endpoints.admin.profile, { full_name });
    return response.data;
  },

  /* ================= CHANGE PASSWORD ================= */
  async setPassword(old_password: string, new_password: string) {
    const response = await api.post(endpoints.admin.password, {
      old_password,
      new_password,
    });
    return response.data;
  },
};