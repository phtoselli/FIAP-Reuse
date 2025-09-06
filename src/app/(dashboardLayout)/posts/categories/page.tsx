/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useMemo } from "react";
import useTypeService from "@/hooks/useTypeService";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Card, Flex, Form, Input, Select, Spin } from "antd";

import useService from "@/hooks/useService";
import ProductCard from "@/components/ProductCard";
import ContentLayout from "@/components/ContentLayout";
import BreadcrumbRoute from "@/components/BreadcrumbRoute";

import { Types } from "@/types/type";
import { GenericTypesMap } from "@/types";
import { Product } from "@/types/product";
import { QueryParamsKey } from "@/types/queryParams";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import { productService } from "@/service/products";
import { CategoryDescription } from "@/types/type/category";

export default function Categories() {
  const [form] = Form.useForm();

  const { getParam, routerAddParam, routerRemoveParam } =
    useSearchParamsHelper();

  const searchParam = getParam(QueryParamsKey.SEARCH);
  const categoryParam = getParam(QueryParamsKey.CATEGORY);
  const conditionParam = getParam(QueryParamsKey.CONDITION);

  const title = categoryParam
    ? CategoryDescription[categoryParam[0] as keyof typeof CategoryDescription]
    : "Produtos";

  const {
    data: productsData,
    execute: getAllProducts,
    isLoading: isProductsLoading,
  } = useService(productService.get);

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

    return categoriesData.map((category) => ({
      value: category.code,
      label: category.title,
    }));
  }, [categoriesData]);

  const conditionOptions = useMemo(() => {
    if (!conditionsData) return [];

    return conditionsData.map((condition) => ({
      value: condition.code,
      label: condition.title,
    }));
  }, [conditionsData]);

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
        categoryParam.includes(product.categoria?.id);

      // const matchesCondition =
      //   !conditionParam ||
      //   conditionParam.length === 0 ||
      //   conditionParam.includes(product.condicao?.tipo); // 🔥 ajustei também

      return matchesSearch && matchesCategory;
    });
  }, [productsData, searchParam, categoryParam, conditionParam]);

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
    getAllProducts();

    if (searchParam) {
      form.setFieldValue("search", searchParam.join(","));
    }

    if (categoryParam) {
      form.setFieldValue("category", categoryParam);
    }

    if (conditionParam) {
      form.setFieldValue("condition", conditionParam);
    }

    getCategories({ type: Types.CATEGORYTYPE });
    getConditions({ type: Types.CONDITIONTYPE });
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

        {/* Lista de produtos */}
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
