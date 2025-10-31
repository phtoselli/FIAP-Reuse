"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export enum URLControlledModalKeys {
	EDIT_POST_MODAL = "edit-post",
	CREATE_POST_MODAL = "create-post",
	TRADE_REQUEST_MODAL = "trade-request",
}

/**
 * Hook genérico para controle de modais via searchParams na URL
 *
 * @param paramKey - Chave usada como parâmetro na URL para identificar o modal.
 */
export function useURLControlledModal(paramKey: URLControlledModalKeys) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const open = (paramValue: string = "true") => {
		const params = new URLSearchParams(searchParams.toString());

		params.set(paramKey, paramValue.toString());

		const pathname = window.location.pathname;
		const newUrl = `${pathname}?${params.toString()}`;

		router.push(newUrl);
	};

	const close = () => {
		const params = new URLSearchParams(searchParams.toString());
		const pathname = window.location.pathname;

		if (params.get(paramKey)) {
			params.delete(paramKey);
		}

		const newUrl = params.toString()
			? `${pathname}?${params.toString()}`
			: pathname;

		router.push(newUrl);
	};

	const paramValue = useMemo(() => {
		return searchParams.get(paramKey);
	}, [searchParams, paramKey]);

	const isOpen = useMemo(() => {
		return !!searchParams.get(paramKey);
	}, [searchParams, paramKey]);

	return { isOpen, open, close, paramValue };
}
