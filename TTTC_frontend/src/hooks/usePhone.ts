import { useEffect, useState } from "react";
import { getabout, type About } from "@/services/modules/about.api";

let cacheabout : About |null = null;
let inflight : Promise<About | null> | null = null;

export function useAbout() {
    
    const [about, setAbout] = useState<About | null>(cacheabout);
    const [loading, setLoading] = useState<boolean>(!cacheabout);
    const [error, setError] = useState<string | null>(null);


    useEffect(()=>{
        let mount = true;
        (async ()=>{
            try {
                if (cacheabout) return;

                setLoading(true);
                setError(null);

                inflight = inflight ?? getabout();
                const data = await inflight

                cacheabout = data;
                inflight=null;

                if(mount) setAbout(data);
            } catch (e:any){
                inflight =null;
                if (mount) setError(e?.message ?? "faild to load info");
            } finally{
                if (mount) setLoading(false);
            }
        })();
        return () => {
        mount = false;
        };
    }, []);
    return {about, loading, error};
}