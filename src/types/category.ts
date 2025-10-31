export const Categories = {
	1: { namePT: "Produtos", nameEN: "products" },
	2: { namePT: "Eletrônicos", nameEN: "electronics" },
	3: { namePT: "Móveis", nameEN: "furniture" },
	4: { namePT: "Gadgets", nameEN: "gadgets" },
	5: { namePT: "Beleza", nameEN: "beauty" },
	6: { namePT: "Acessórios", nameEN: "accessories" },
} as const;

export type CategoryId = keyof typeof Categories;
export type CategoryPT = (typeof Categories)[CategoryId]["namePT"];
export type CategoryEN = (typeof Categories)[CategoryId]["nameEN"];
