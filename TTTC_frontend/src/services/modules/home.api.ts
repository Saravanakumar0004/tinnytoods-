import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";

type HomeApiResponse<> = {
  results: Array<{
    id:number,
    years_of_experience:number,
    happy_students:number,
    branches:number,
    qualified_teachers:number,
    students_enrolled:number,
}>;
};

export type HomeStats= {
    years_of_experience:number,
    happy_students:number,
    branches:number,
    qualified_teachers:number,
    students_enrolled:number,

};


export async function gethome(): Promise<HomeStats | null>{
    const { data } = await api.get<HomeApiResponse>(endpoints.home.list)

    const item = data?.results?.[0];
    if (!item) return null;

    return {
        years_of_experience: item.years_of_experience,
        happy_students: item.happy_students,
        branches: item.branches,
        qualified_teachers: item.qualified_teachers,
        students_enrolled: item.students_enrolled,

    };
}



