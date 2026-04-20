import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints"
import { Item } from "@radix-ui/react-accordion";

type QuestionResponse<> ={
    results: Array<{
        id:number,
        question:string,
        description:string,
    }>;
};

export type Questions ={
    id:number,
    question:string,
    description:string,
};

export async function getquestion(): Promise<Questions[]> {
    const { data } = await api.get<QuestionResponse>(endpoints.ques.list);
    return (data.results ?? []);
}
