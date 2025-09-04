/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo } from "react";
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Select, Spin } from "antd";

import useService from "@/hooks/useService";
import useTypeService from "@/hooks/useTypeService";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";

import ProductCard from "@/components/ProductCard";
import ContentLayout from "@/components/ContentLayout";

import { Types } from "@/types/type";
import { Product } from "@/types/product";
import { QueryParamsKey } from "@/types/queryParams";
import { GenericTypesMap } from "@/types";

import { productService } from "@/service/products";

export default function MYPosts() {
  const [form] = Form.useForm();

  const { getParam, routerAddParam, routerRemoveParam } =
    useSearchParamsHelper();

  const { open: openModal } = useURLControlledModal(
    URLControlledModalKeys.CREATE_POST_MODAL
  );

  const searchParam = getParam(QueryParamsKey.SEARCH);
  const categoryParam = getParam(QueryParamsKey.CATEGORY);
  const conditionParam = getParam(QueryParamsKey.CONDITION);

  // Produtos
  const {
    data: productsData,
    execute: getAllProducts,
    isLoading: isProductsLoading,
  } = useService(productService.get);

  // Categorias
  const {
    get: getCategories,
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useTypeService();

  // Condições
  const {
    get: getConditions,
    data: conditionsData,
    isLoading: isConditionsLoading,
  } = useTypeService();

  // Options para selects
  const categoryOptions = useMemo(
    () => categoriesData?.map((c) => ({ value: c.code, label: c.title })) ?? [],
    [categoriesData]
  );

  const conditionOptions = useMemo(
    () => conditionsData?.map((c) => ({ value: c.code, label: c.title })) ?? [],
    [conditionsData]
  );

  // Filtragem
  const filteredProducts = useMemo(() => {
    if (!productsData) return [];

    return productsData.filter((product: Product) => {
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
        categoryParam.includes(product.categoryCode);

      const matchesCondition =
        !conditionParam ||
        conditionParam.length === 0 ||
        conditionParam.includes(product.conditionCode);

      return matchesSearch && matchesCategory && matchesCondition;
    });
  }, [productsData, searchParam, categoryParam, conditionParam]);

  // Atualiza params da URL quando filtros mudam
  const onFormValuesChange = (changedValue: GenericTypesMap) => {
    const key = Object.keys(changedValue)[0];
    const value = changedValue[key];

    if (!!value) {
      routerAddParam(key, value);
    } else {
      routerRemoveParam(key);
    }
  };

  // Busca inicial
  useEffect(() => {
    getAllProducts(); // chama /api/products

    if (searchParam) form.setFieldValue("search", searchParam.join(","));
    if (categoryParam) form.setFieldValue("category", categoryParam);
    if (conditionParam) form.setFieldValue("condition", conditionParam);

    getCategories({ type: Types.CATEGORYTYPE }); // chama /api/categories
    getConditions({ type: Types.CONDITIONTYPE }); // chama /api/conditions
  }, []);

  return (
    <ContentLayout
      title="Meus produtos"
      extra={
        <Button
          color="primary"
          variant="filled"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
        >
          Novo produto
        </Button>
      }
    >
      <Flex gap={8}>
        {/* 🔹 Filtros */}
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

        {/* 🔹 Lista de Produtos */}
        <Spin
          size="large"
          spinning={isProductsLoading}
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
