/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { create } from "zustand";

export interface Address {
	id: string;
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

interface AddressStoreState {
	addresses: Address[];
	isLoading: boolean;

	getAllAddresses: (userId?: string) => Promise<void>;
	setAddresses: (addresses: Address[]) => void;
	addAddress: (address: Address) => void;
	updateAddress: (address: Address) => void;
	deleteAddress: (addressId: string) => void;

	clearStore: () => void;
}

export const useAddressStore = create<AddressStoreState>((set, get) => ({
	addresses: [],
	isLoading: false,

	getAllAddresses: async (userId?: string) => {
		set({ isLoading: true });
		try {
			const id = userId || "6fd9c6b8-8ecd-482b-b321-a7ae05e44dc9";
			const res = await axios.get(`/api/enderecos?userId=${id}`);
			const data = res.data.enderecos || [];
			set({ addresses: data });
		} catch (err: any) {
			console.error("Erro ao buscar endereços:", err);
			set({ addresses: [] });
		} finally {
			set({ isLoading: false });
		}
	},

	setAddresses: (addresses: Address[]) => {
		set({ addresses });
	},

	addAddress: (address: Address) => {
		const current = get().addresses;
		set({ addresses: [address, ...current] });
	},

	updateAddress: (address: Address) => {
		const updated = get().addresses.map((a) =>
			a.id === address.id ? address : a
		);
		set({ addresses: updated });
	},

	deleteAddress: (addressId: string) => {
		const filtered = get().addresses.filter((a) => a.id !== addressId);
		set({ addresses: filtered });
	},

	clearStore: () => {
		set({ addresses: [], isLoading: false });
	},
}));
