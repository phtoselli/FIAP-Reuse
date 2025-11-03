export interface ProductModel {
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
		id: number;
		name: string;
		description: string | null;
	};
	condition: {
		id: number;
		code: string;
		type: string;
		description: string | null;
	} | null;
}

export interface ProductCreateModel {
	title: string;
	description?: string;
	image?: string;
	categoryId?: number;
	conditionId?: number;
	userId: string;
	rating?: number;
}

export interface ProductUpdateModel {
	title?: string;
	description?: string;
	image?: string;
	categoryId?: number;
	conditionId?: number;
	isActive?: boolean;
	rating?: number;
}
