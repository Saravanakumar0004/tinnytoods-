import { endpoints } from "../api/endpoints";
import { api } from "../api/client";

// 🧠 GET Autism (List → first object)
export const getAutism = async () => {
  const res = await api.get(endpoints.autism.list);

  const data = res.data;
  return data.results ? data.results[0] : data;
};

// ✏️ PUT Autism (Update by ID)
export const updateAutism = async (id: number, payload: any) => {
  const res = await api.put(
    `${endpoints.autism.list_id.replace(":id", String(id))}`,
    payload
  );
  return res.data;
};