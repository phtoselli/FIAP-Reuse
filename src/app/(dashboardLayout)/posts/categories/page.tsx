/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Card, Flex, Form, Input, Select, Spin } from "antd";
import { useEffect, useMemo } from "react";

import BreadcrumbRoute from "@/components/BreadcrumbRoute";
import ContentLayout from "@/components/ContentLayout";
import ProductCard from "@/components/ProductCard";

import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import { GenericTypesMap } from "@/types";
import { Product } from "@/types/product";
import { QueryParamsKey } from "@/types/queryParams";
import { categoriesOptions } from "@/utils/categories";
import { conditionOptions } from "@/utils/conditions";
import { useProductStore } from "../store";

export default function Categories() {
	const [form] = Form.useForm();

	const { getParam, routerAddParam, routerRemoveParam } =
		useSearchParamsHelper();

	const { produtos, isLoading, getAllProducts } = useProductStore();

	const searchParam = getParam(QueryParamsKey.SEARCH);
	const categoryParam = getParam(QueryParamsKey.CATEGORY);
	const conditionParam = getParam(QueryParamsKey.CONDITION);

	const title = useMemo(() => {
		if (categoryParam?.length) {
			const selectedCategory = categoriesOptions.find(
				(c) => c.value === categoryParam[0]
			);
			return `Produtos (${selectedCategory?.label})` || "Produtos";
		}
		return "Produtos";
	}, [categoryParam, categoriesOptions]);

	const filteredProducts = useMemo(() => {
		if (!produtos) return [];

		return produtos.filter((product: Product) => {
			const matchesSearch =
				!searchParam ||
				searchParam.length === 0 ||
				searchParam.some(
					(term) =>
						product.name.toLowerCase().includes(term.toLowerCase()) ||
						product.description?.toLowerCase().includes(term.toLowerCase())
				);

			const matchesCategory =
				!categoryParam ||
				categoryParam.length === 0 ||
				categoryParam.includes(product.category.id.toString());

			return matchesSearch && matchesCategory;
		});
	}, [produtos, searchParam, categoryParam, conditionParam]);

	const onFormValuesChange = (changedValue: GenericTypesMap) => {
		const key = Object.keys(changedValue)[0];
		const value = changedValue[key];

		if (!!value) {
			routerAddParam(key, value);
		} else {
			routerRemoveParam(key);
		}
	};

	useEffect(() => {
		if (!produtos || produtos.length < 1) {
			getAllProducts();
		}

		if (searchParam) {
			form.setFieldValue("search", searchParam.join(","));
		}

		if (categoryParam) {
			form.setFieldValue("category", categoryParam);
		}

		if (conditionParam) {
			form.setFieldValue("condition", conditionParam);
		}
	}, []);

	return (
		<ContentLayout title={title} extra={<BreadcrumbRoute />}>
			<Flex gap={8}>
				<Card
					title="Filtros"
					style={{ width: "250px", flexShrink: 0 }}
					styles={{ body: { paddingBottom: 0 } }}
				>
					<Form
						form={form}
						layout="vertical"
						onValuesChange={onFormValuesChange}
					>
						<Form.Item name="search" label="Buscar">
							<Input
								allowClear
								placeholder="Buscar produto"
								prefix={<SearchOutlined />}
							/>
						</Form.Item>

						<Form.Item name="category" label="Categoria">
							<Select
								placeholder="Selecione uma categoria"
								options={categoriesOptions}
							/>
						</Form.Item>

						<Form.Item name="condition" label="Estado de conservação">
							<Select
								allowClear
								mode="multiple"
								placeholder="Estado de conservação"
								options={conditionOptions}
							/>
						</Form.Item>
					</Form>
				</Card>

				<Spin
					size="large"
					spinning={isLoading}
					indicator={<LoadingOutlined />}
					tip="Carregando produtos..."
					style={{ width: "100%", height: "100%" }}
				>
					<Card
						title="Produtos"
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							width: "calc(100vw - 308px)",
							height: "calc(100vh - 170px)",
						}}
						styles={{
							body: {
								flex: 1,
								minHeight: 0,
								padding: "8px",
								overflowY: "auto",
								display: "flex",
								flexWrap: "wrap",
							},
						}}
					>
						{filteredProducts?.map((product: Product) => (
							<ProductCard key={`categories${product.id}`} product={product} />
						))}
					</Card>
				</Spin>
			</Flex>
		</ContentLayout>
	);
}
