import { api } from "@/services/api/client";
import { endpoints } from "../api/endpoints";
import { tokenStorage } from "@/lib/storage";

// Types for login
export type LoginPayload = { email: string; password: string };
export type LoginResponse = { access: string; refresh: string };

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  // Use Axios client instead of fetch for consistency
  const { data } = await api.post<LoginResponse>("https://tttc-backend-xpsp.onrender.com/api/admin/login/", payload);

  // Save tokens using tokenStorage abstraction
  tokenStorage.setTokens(data.access, data.refresh);

  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post(endpoints.admin.logout);
  } finally {
    tokenStorage.clear();
  }
}

export async function getHomeData() {
  const { data } = await api.get(endpoints.home.list);
  return data;
}