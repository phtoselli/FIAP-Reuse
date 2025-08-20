"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";

/**
 * Hook genérico para controle de modais via searchParams
 *
 * @param modalValue valor do parâmetro "modal" (ex: "createPost")
 * @param paramKey nome do parâmetro da URL (default: "modal")
 */
export function useModalController(modalValue: string, paramKey = "modal") {
  const searchParams = useSearchParams();
  const router = useRouter();

  const open = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramKey, modalValue);

    const pathname = window.location.pathname;
    const newUrl = `${pathname}?${params.toString()}`;

    router.push(newUrl);
  };

  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    const pathname = window.location.pathname;

    if (params.get(paramKey) === modalValue) {
      params.delete(paramKey);
    }

    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    router.push(newUrl);
  };

  const isOpen = useMemo(() => {
    return searchParams.get(paramKey) === modalValue;
  }, [searchParams, paramKey, modalValue]);

  return { isOpen, open, close };
}
