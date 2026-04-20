import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

type AboutResponse = {
  results: Array<{
    id:number,
    success_rate:number,
    parent_satisfaction:number,
    improvement_rate:number,
    early_detection:number,

    phone_no_one:string,
    phone_no_two:string,
}>;
};

export type About= {
    id:number;
    success_rate:number,
    parent_satisfaction:number,
    improvement_rate:number,
    early_detection:number,

    phone_no_one:string,
    phone_no_two:string,

};


export async function getabout(): Promise<About | null>{
    const { data } = await api.get<AboutResponse>(endpoints.about.list)

    const item = data?.results?.[0];
    if (!item) return null;

    return item;
}
// ADD =====================================================

export const addAbout = async (data: Partial<About>): Promise<About> => {
  try {
    const response = await api.post(endpoints.about.list, data);
    return response.data;
  } catch (err: any) {
    console.error("ADD ABOUT ERROR:", err.response || err);
    throw new Error(err.response?.data?.detail || "Failed to add About");
  }
};
// UPDATE =====================================================
  
export async function updateAbout(
  id: number,
  payload: Partial<About>
): Promise<About> {
  const url = endpoints.about.list_id.replace(
    ":id",
    String(id)
  );

  const { data } = await api.put<About>(url, payload);

  return data;
}

// DELETE=====================================================
   
export async function deleteAbout(
  id: number
): Promise<void> {
  const url = endpoints.about.list_id.replace(
    ":id",
    String(id)
  );

  await api.delete(url);
}
