import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints"
import { Item } from "@radix-ui/react-accordion";



type ServicesResponse<> ={
    results: Array<{
        id:number,
        icon:string,
        title:string,
        description:string,
    }>;
};

export type Services ={
    id:number,
    icon:string,
    title:string,
    description:string,
};

export async function getservices(): Promise<Services[]> {
    const { data } = await api.get<ServicesResponse>(endpoints.services.list);
    return (data.results ?? []);
}

type AutismReponse<> ={
    results: Array<{
        id:number,
        autism_then:number,
        autism_now:number,
    }>;
};

export type Autism ={
    autism_then:number,
    autism_now:number,
};


export async function getautism(): Promise<Autism | null>{
    const { data } = await api.get<AutismReponse>(endpoints.autism.list)

    const item = data?.results?.[0];
    if (!item) return null;

    return {
        autism_then: item.autism_then,
        autism_now: item.autism_now,
    };
}

export async function createAutism(payload: Autism): Promise<Autism> {
  const { data } = await api.post(endpoints.autism.list, payload);
  return data;
}

export async function updateAutism(
  id: number,
  payload: Autism
): Promise<Autism> {
  const { data } = await api.put(
    `${endpoints.autism.list}${id}/`,
    payload
  );
  return data;
}