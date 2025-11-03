const conditions = ["Novo", "Usado"];

export const ConditionEnum = Object.fromEntries(
	conditions.map((label, index) => [
		label
			.toUpperCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/\s+/g, "_"),
		String(index + 1),
	])
);

export const conditionOptions = conditions.map((label, index) => ({
	value: String(index + 1),
	label,
}));

export default conditions;
