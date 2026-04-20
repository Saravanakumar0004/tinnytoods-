import { api } from "../api/client";
import { endpoints } from "../api/endpoints";


export type GalleryCategory = {
    id?:number,
    name?:string,
    slug?:string,

}

export type GalleryPhoto = {
    id:number,
    category:GalleryCategory,
    title:string,
    description:string,
    image_url:string,
}

function fixImageUrl(url: string) {
  if (!url) return url;

  // already absolute
  if (url.startsWith("http")) return url;

  // get baseURL from axios instance
  const base = api.defaults.baseURL || "";

  // remove /api if exists
  const origin = base.replace(/\/api\/?$/, "");

  // add /media if missing
  if (url.startsWith("/photos/")) {
    url = "/media" + url;
  }

  return origin + url;
}


export async function getAllPhotos(): Promise<GalleryPhoto[]>{
   const res = await api.get(endpoints.gallery.list_photos);
    const results = res.data?.results ?? [];
    return results.map((p: GalleryPhoto) => ({
        ...p,
        image_url: fixImageUrl(p.image_url),
    }));
}

export async function getAllCategories(): Promise<GalleryCategory[]>{
    const res = await api.get(endpoints.gallery.list);
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.results)) return res.data.results;
    return [];
}

export async function getPhotosByCategorySlug(
    slug:string
) : Promise<GalleryPhoto[]> {
    const res = await api.get(endpoints.gallery.CategoryPhotos(slug));
    const arr = res.data ?? [];
    return arr.map((p: GalleryPhoto) => ({
        ...p,
        image_url: fixImageUrl(p.image_url),
    }));
}


