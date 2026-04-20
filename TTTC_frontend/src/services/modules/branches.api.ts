// src/services/modules/branches.api.ts
import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export type BranchDto = {
  id: number;
  branch_name: string;
  phone: string;
  location: string;
  mapurl: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
};

type BranchesResponse = {
  results: BranchDto[];
};

export async function getbranches(): Promise<BranchDto[]> {
  const { data } = await api.get<BranchesResponse>(endpoints.branches.list);
  return data?.results ?? [];
}
