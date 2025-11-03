/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "@/types/product";
import { create } from "zustand";

interface ProductStoreState {
	produtos: Product[];
	isLoading: boolean;
	getAllProducts: () => Promise<void>;
	setProducts: (products: Product[]) => void;

	clearStore: () => void;
}

export const useProductStore = create<ProductStoreState>((set) => ({
	produtos: [],
	isLoading: false,

	getAllProducts: async () => {
		set({ isLoading: true });
		try {
			const res = await fetch("/api/produtos?active=true&limit=999");
			const data = await res.json();

			set({ produtos: data.products || [] });
		} catch (err: any) {
			console.error("Erro ao buscar produtos:", err);
			set({ produtos: [] });
		} finally {
			set({ isLoading: false });
		}
	},

	setProducts: (products: Product[]) => {
		set({ produtos: products });
	},

	clearStore: () => {
		set({ produtos: [], isLoading: false });
	},
}));
