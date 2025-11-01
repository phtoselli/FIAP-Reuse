/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ProductCard from "@/components/ProductCard";
import VLibras from "@/components/Vlibras";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import { Product } from "@/types/product";
import { QueryParamsKey } from "@/types/queryParams";
import { Routes } from "@/types/routes";
import { CategoryCode } from "@/types/type/category";
import {
	Button,
	Checkbox,
	Divider,
	Flex,
	Image,
	Spin,
	Typography,
	message,
	theme,
} from "antd";
import { useEffect, useState } from "react";
import { useProductStore } from "./store";

const { Title, Paragraph } = Typography;

const categories = [
	{ label: CategoryCode.CLOTHING, value: CategoryCode.CLOTHING },
	{ label: CategoryCode.HOUSE, value: CategoryCode.HOUSE },
	{ label: CategoryCode.FOOTWEAR, value: CategoryCode.FOOTWEAR },
	{ label: CategoryCode.ACCESSORIES, value: CategoryCode.ACCESSORIES },
	{ label: CategoryCode.COSMETICS, value: CategoryCode.COSMETICS },
	{ label: CategoryCode.OTHERS, value: CategoryCode.OTHERS },
];

export default function Posts() {
	const { token } = theme.useToken();
	const { redirect } = useSearchParamsHelper();

	const [activeFilters, setActiveFilters] = useState<string[]>([]);
	const [messageApi, contextHolder] = message.useMessage();

	const { produtos, isLoading, getAllProducts } = useProductStore();

	const categoriesToShow =
		activeFilters.length > 0
			? categories.filter((cat) => activeFilters.includes(cat.value))
			: categories;

	useEffect(() => {
		if (produtos.length < 1) {
			getAllProducts();
		}
	}, []);

	return (
		<div>
			{contextHolder}
			<VLibras />
			<Flex
				wrap
				align="center"
				justify="space-between"
				style={{
					background: "#2A4BA0",
					borderRadius: 8,
					marginBottom: 48,
				}}
			>
				<div style={{ width: 700, padding: 40 }}>
					<Title level={1} style={{ color: token["yellow-6"] }}>
						A primeira plataforma de troca do país
					</Title>
					<Paragraph
						type="secondary"
						style={{ color: token.colorWhite }}
						strong
					>
						Conectando pessoas para trocar produtos de forma segura, sustentável
						e fácil.
					</Paragraph>
				</div>

				<Flex
					align="center"
					justify="end"
					style={{ flex: 1, paddingRight: 40 }}
				>
					<Image src="/hero.png" width={300} alt="Banner" preview={false} />
				</Flex>
			</Flex>

			<div
				style={{
					background: "#fff",
					padding: 16,
					borderRadius: 8,
					marginBottom: 24,
					boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
				}}
			>
				<Title level={4}>Filtros</Title>
				<Checkbox.Group
					options={categories}
					value={activeFilters}
					onChange={(values) => setActiveFilters(values as string[])}
					style={{ display: "flex", gap: 16, flexWrap: "wrap" }}
				/>
			</div>

			<Divider />

			{isLoading && (
				<div style={{ textAlign: "center", padding: "50px" }}>
					<Spin size="large" />
					<p>Carregando produtos...</p>
				</div>
			)}

			{!isLoading && (
				<div>
					{categoriesToShow.map((category) => {
						const categoryProducts = produtos?.filter((product: Product) => {
							const categoryMapping: { [key: string]: string } = {
								1: "ROUPAS",
								2: "CASA",
								3: "CALÇADOS",
								4: "ACESSÓRIOS",
								5: "COSMÉTICOS",
								6: "OUTROS",
							};

							const productCategoryCode =
								categoryMapping[product.categoryId || ""];
							const matches = productCategoryCode === category.value;

							return matches;
						});

						if (!categoryProducts || categoryProducts.length === 0) return null;

						return (
							<div key={category.value} style={{ marginBottom: 48 }}>
								<Flex justify="space-between" align="center">
									<Title level={2} style={{ color: "#2A4BA0" }}>
										{category.label}
									</Title>
									<Button
										type="link"
										onClick={() =>
											redirect(Routes.CATEGORIES, [
												{ [QueryParamsKey.CATEGORY]: category.value },
											])
										}
									>
										Ver mais
									</Button>
								</Flex>

								<Flex wrap gap={16}>
									{categoryProducts.slice(0, 4).map((product: Product) => (
										<ProductCard key={product.id} product={product} />
									))}
								</Flex>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
