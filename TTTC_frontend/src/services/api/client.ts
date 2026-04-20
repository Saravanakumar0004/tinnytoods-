import axios, {AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/lib/storage";
import { endpoints } from "./endpoints";
const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = axios.create({
    baseURL:API_BASE_URL,
    headers:{"content-type":"application/json"},
});

api.interceptors.request.use((config:InternalAxiosRequestConfig) =>{
    const access = tokenStorage.getAccess()
    if (access) config.headers.Authorization = `Bearer ${access}`;
    return config;
});

let isRefreshing = false;
let PendingQueue: Array<(token:string)=> void> = [];

function proccesQueue(token:string){
    PendingQueue.forEach((cb)=> cb(token));
    PendingQueue=[];
}

api.interceptors.response.use(
    (res) => res,
    async (error:AxiosError) => {
        const original = error.config as any;

        if (error.response?.status === 401 && !original._retry){
            original._retry = true;

            const refresh =  tokenStorage.getRefresh();
            if (!refresh){
                tokenStorage.clear();
                return Promise.reject(error)
            }
        
        if (isRefreshing){
            return new Promise((resolve) => {
                PendingQueue.push((newToken:string) => {
                    original.headers.Authorization = `Bearer ${newToken}`;
                    resolve(api(original));
                });
            });
        }

        isRefreshing = true

        try {
            const resp = await axios.post(`${API_BASE_URL}${endpoints.admin.refresh}`, {refresh});
            const newAccess = (resp.data as any).access
            
            tokenStorage.setTokens(newAccess);
            proccesQueue(newAccess);

            original.headers.Authorization = `Bearer ${newAccess}`;
            return api (original);
            } catch (e) {
                tokenStorage.clear();
                return Promise.reject(e);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
