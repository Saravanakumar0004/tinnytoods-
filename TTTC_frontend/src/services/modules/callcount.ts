import { useCallback } from "react";
import { endpoints } from "@/services/api/endpoints";
import { api } from "@/services/api/client";

export const useCallCount = () => {

  const increaseCallCount = useCallback(async () => {
    try {
      await api.post(endpoints.contact.call);
    } catch (error) {
      console.error("Call count POST error:", error);
    }
  }, []);

  return { increaseCallCount };
};