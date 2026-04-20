// src/services/modules/clientcontect.api.ts
import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export type ClientContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export type ClientContactResponse = {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
};

export async function postClientContact(
  payload: ClientContactPayload
): Promise<ClientContactResponse> {
  const { data } = await api.post<ClientContactResponse>(
    endpoints.contact.create, payload
  );
  return data;
}
