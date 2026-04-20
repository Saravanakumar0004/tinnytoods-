import { api } from "@/services/api/client";
import { endpoints } from "../api/endpoints";


export type BookPayload = {
  date: string;
  time: string;
  branch: string;
  therapy_type: string;
  parent_name: string;
  child_name: string;
  phone: string;
  email: string;
  notes: string;
  status:string;
};

export type BookResponse = {
  id?: number;
  date: string;
  time: string;
  branch: string;
  therapy_type: string;
  parent_name: string;
  child_name: string;
  phone: string;
  email: string;
  notes: string;
  status:string;
  created_at?: string;
};

export async function postBookConsultation(payload: BookPayload): Promise<BookResponse> {
  const { data } = await api.post<BookPayload>(endpoints.book.create, payload);
  return data;
}
