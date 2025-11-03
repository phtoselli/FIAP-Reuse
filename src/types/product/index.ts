export interface Product {
	id: string;
	name: string;
	description: string | null;
	image: string | null;
	rating: number | null;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	user: {
		id: string;
		name: string;
		city: string | null;
		state: string | null;
		avatarUrl: string | null;
	};
	category: {
		id: string;
		name: string;
		description: string | null;
	};
	condition: {
		id: string;
		code: string;
		type: string;
		description: string | null;
	} | null;
}
