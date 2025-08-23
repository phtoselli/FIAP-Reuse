/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeService } from "@/service/type";
import { GetTypeParam, Type } from "@/types/type";
import { useCallback, useState } from "react";

export default function useTypeService() {
  const [data, setData] = useState<Type[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const get = useCallback(async (params: GetTypeParam) => {
    setIsLoading(true);
    try {
      const response = await TypeService.get(params);
      setData(response);
    } catch (error: any) {
      setError(error.message || "Erro");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { get, data, isLoading, error };
}
