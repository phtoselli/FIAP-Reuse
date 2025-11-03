const categories = [
	"Acessórios",
	"Beleza",
	"Casa",
	"Eletrônicos",
	"Roupas",
	"Outros",
];

export const CategoriesEnum = Object.fromEntries(
	categories.map((nome, index) => [
		nome
			.toUpperCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/\s+/g, "_"),
		String(index + 1),
	])
);

export const categoriesOptions = categories.map((label, index) => ({
	value: String(index + 1),
	label,
}));

export default categories;
