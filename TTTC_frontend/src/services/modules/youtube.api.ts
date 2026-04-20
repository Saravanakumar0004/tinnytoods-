// src/services/modules/youtube.api.ts
import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

export type Youtube = {
  id: number;
  youtube_url: string;
  video_id: string;
  title: string;
  thumbnail: string | null;
};

type YoutubeResponse = {
  results: Youtube[];
};

export async function getyoutube(): Promise<Youtube[]> {
  const { data } = await api.get<YoutubeResponse>(endpoints.youtube.list);
  return data?.results ?? [];
}
