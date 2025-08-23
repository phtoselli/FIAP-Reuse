import { StringMap, GenericTypes } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export default function useSearchParamsHelper() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getParam = (key: string): string | string[] | undefined => {
    const value = searchParams.get(key);
    if (!value) return undefined;
    return value.split(",");
  };

  const routerAddParam = (
    key: string,
    values: GenericTypes | GenericTypes[]
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(values)) {
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
    } else {
      const strValue = String(values).trim();

      if (strValue) {
        params.set(key, strValue);
      } else {
        params.delete(key);
      }
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "");
  };

  const routerRemoveParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const pathname = window.location.pathname;

    params.delete(key);

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const redirect = (route: string, queryParams?: Array<StringMap>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (queryParams) {
      queryParams.forEach((queryParam) => {
        Object.entries(queryParam).forEach(([key, value]) => {
          params.set(key, value);
        });
      });
    }

    router.push(`${route}?${params.toString()}`);
  };

  return {
    searchParams,
    router,
    getParam,
    routerAddParam,
    routerRemoveParam,
    redirect,
  };
}
