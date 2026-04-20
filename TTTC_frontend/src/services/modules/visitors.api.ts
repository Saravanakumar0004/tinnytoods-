import { api } from "../api/client";
import { endpoints } from "../api/endpoints";

export type VisitorCountResponse = {
  visitors: number;
};

// GET => only read count
export async function getVisitorCount(): Promise<number> {
  const res = await api.get(endpoints.visitors.get_and_post);
  return res.data?.visitors ?? 0;
}

// POST => increment + return count
export async function incrementVisitorCount(): Promise<number> {
  const res = await api.post(endpoints.visitors.get_and_post);
  return res.data?.visitors ?? 0;
}