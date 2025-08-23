/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";

type AsyncFunction<T> = () => Promise<Array<T>>;

export default function useService<T>(ayncFunction: AsyncFunction<T>) {
  const [data, setData] = useState<Array<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ayncFunction();
      setData(response);
    } catch (error: any) {
      setError(error.message || "Erro");
    } finally {
      setIsLoading(false);
    }
  }, [ayncFunction]);

  return {
    execute,
    data,
    isLoading,
    error,
  };
}
