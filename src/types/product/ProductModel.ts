import { Product } from ".";

export type ProductModel = Product;

export interface ProductCreateModel {
	title: string;
	description?: string;
	image?: string;
	categoryId?: string;
	conditionId?: string;
	userId: string;
	rating?: number;
}

export interface ProductUpdateModel {
	title?: string;
	description?: string;
	image?: string;
	categoryId?: string;
	conditionId?: string;
	isActive?: boolean;
	rating?: number;
}
