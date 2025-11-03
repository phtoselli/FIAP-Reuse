/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
	LoadingOutlined,
	PlusOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Select, Spin } from "antd";
import { useEffect, useMemo } from "react";

import ContentLayout from "@/components/ContentLayout";
import ProductCard from "@/components/ProductCard";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { GenericTypesMap } from "@/types";
import { Product } from "@/types/product";
import { getUserId } from "@/utils/auth";
import { categoriesOptions } from "@/utils/categories";
import { conditionOptions } from "@/utils/conditions";
import { useProductStore } from "../store";

export default function MyPosts() {
	const [form] = Form.useForm();
	const { getParam, routerAddParam, routerRemoveParam } =
		useSearchParamsHelper();

	const searchParam = getParam("search");
	const categoryParam = getParam("category");
	const conditionParam = getParam("condition");

	const userId = getUserId()?.toString();

	const { produtos, isLoading, getAllProducts } = useProductStore();

	const { open: openCreateNewPostModal } = useURLControlledModal(
		URLControlledModalKeys.CREATE_POST_MODAL
	);

	const filteredProducts = useMemo(() => {
		if (!produtos || !userId) return [];

		return produtos.filter((product: Product) => {
			const isOwner = product.user?.id?.toString() === userId;

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
				categoryParam.includes(product.category?.id?.toString());

			const matchesCondition = !conditionParam || conditionParam.length === 0;

			return isOwner && matchesSearch && matchesCategory && matchesCondition;
		});
	}, [produtos, userId, searchParam, categoryParam, conditionParam]);

	const onFormValuesChange = (changedValue: GenericTypesMap) => {
		const key = Object.keys(changedValue)[0];
		const value = changedValue[key];
		if (value) routerAddParam(key, value);
		else routerRemoveParam(key);
	};

	useEffect(() => {
		if (!produtos || produtos.length < 1) {
			getAllProducts();
		}

		if (searchParam) form.setFieldValue("search", searchParam.join(","));
		if (categoryParam) form.setFieldValue("category", categoryParam);
		if (conditionParam) form.setFieldValue("condition", conditionParam);
	}, []);

	return (
		<ContentLayout
			title="Minhas publicações"
			extra={
				<Button
					color="primary"
					variant="filled"
					icon={<PlusOutlined />}
					onClick={() => openCreateNewPostModal()}
				>
					Novo produto
				</Button>
			}
		>
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
						{filteredProducts.length > 0 &&
							filteredProducts.map((product: Product) => (
								<ProductCard key={`mypost-${product.id}`} product={product} />
							))}
					</Card>
				</Spin>
			</Flex>
		</ContentLayout>
	);
}
