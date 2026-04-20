import { useState, useEffect } from "react";
import { HomeStats, gethome } from "@/services/modules/home.api";

export function useHome() {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await gethome();
        setStats(res);
      } catch (err) {
        console.error("Home hook error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stats, loading };
}
