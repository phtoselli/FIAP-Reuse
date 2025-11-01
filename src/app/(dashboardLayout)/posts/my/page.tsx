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
import useTypeService from "@/hooks/useTypeService";
import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { GenericTypesMap } from "@/types";
import { Product } from "@/types/product";
import { Types } from "@/types/type";
import { getUserId } from "@/utils/auth";
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

	const {
		get: getCategories,
		data: categoriesData,
		isLoading: isCategoriesLoading,
	} = useTypeService();

	const {
		get: getConditions,
		data: conditionsData,
		isLoading: isConditionsLoading,
	} = useTypeService();

	const categoryOptions = useMemo(() => {
		if (!categoriesData) return [];
		return categoriesData.map((c) => ({ value: c.id, label: c.title }));
	}, [categoriesData]);

	const conditionOptions = useMemo(() => {
		if (!conditionsData) return [];
		return conditionsData.map((c) => ({ value: c.code, label: c.title }));
	}, [conditionsData]);

	const filteredProducts = useMemo(() => {
		if (!produtos || !userId) return [];

		return produtos.filter((product: Product) => {
			const isOwner = product.usuario?.id?.toString() === userId;

			const matchesSearch =
				!searchParam ||
				searchParam.length === 0 ||
				searchParam.some(
					(term) =>
						product.nome.toLowerCase().includes(term.toLowerCase()) ||
						product.descricao?.toLowerCase().includes(term.toLowerCase())
				);

			const matchesCategory =
				!categoryParam ||
				categoryParam.length === 0 ||
				categoryParam.includes(
					product.categoryId?.toString() || product.categoria?.id?.toString()
				);

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

		getCategories({ type: Types.CATEGORYTYPE });
		getConditions({ type: Types.CONDITIONTYPE });
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
								allowClear
								placeholder="Categoria"
								options={categoryOptions}
								loading={isCategoriesLoading}
							/>
						</Form.Item>

						<Form.Item name="condition" label="Estado de conservação">
							<Select
								allowClear
								mode="multiple"
								placeholder="Estado de conservação"
								options={conditionOptions}
								loading={isConditionsLoading}
							/>
						</Form.Item>
					</Form>
				</Card>

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
					<Spin
						size="large"
						spinning={filteredProducts.length < 1 || isLoading}
						indicator={<LoadingOutlined />}
						tip="Carregando produtos..."
						style={{ width: "100%", height: "100%" }}
					/>

					{filteredProducts.length > 0 &&
						filteredProducts.map((product: Product) => (
							<ProductCard key={`mypost-${product.id}`} product={product} />
						))}
				</Card>
			</Flex>
		</ContentLayout>
	);
}
