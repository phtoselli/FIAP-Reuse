/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import useService from "@/hooks/useService";
import { productService } from "@/service/products";
import { Product } from "@/types/product";
import { QueryParamsKey } from "@/types/queryParams";
import { Routes } from "@/types/routes";
import { CategoryCode } from "@/types/type/category";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Image,
  Typography,
  theme,
  Spin,
} from "antd";
import { getUser } from "@/utils/auth";

const { Title, Paragraph } = Typography;

const categories = [
  { label: "Roupas", value: "ROUPAS" },
  { label: "Casa", value: "CASA" },
  { label: "Calçados", value: "CALÇADOS" },
  { label: "Acessórios", value: "ACESSÓRIOS" },
  { label: "Cosméticos", value: "COSMÉTICOS" },
  { label: "Outros", value: "OUTROS" },
];

export default function Posts() {
  const { token } = theme.useToken();
  const { redirect } = useSearchParamsHelper();

  const {
    data: productsData,
    execute: getAllProducts,
    isLoading: isProductsLoading,
  } = useService(productService.get);

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleCategoryClick = (category: CategoryCode) => {
    redirect(Routes.CATEGORIES, [{ [QueryParamsKey.CATEGORY]: category }]);
  };

  useEffect(() => {
    if (!getUser()) {
      redirect(Routes.LOGIN);
    }

    getAllProducts({ limit: 20, offset: 0, active: true });
  }, []);

  const categoriesToShow =
    activeFilters.length > 0
      ? categories.filter((cat) => activeFilters.includes(cat.value))
      : categories;

  return (
    <div>
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
        <div style={{ width: "500px", padding: "40px" }}>
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

        <Flex align="center" justify="center" style={{ flex: 1 }}>
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
        <Divider />
        <Flex gap={8}>
          <Button onClick={() => setActiveFilters([])}>Limpar</Button>
        </Flex>
      </div>

      <Divider />

      <Spin
        size="large"
        spinning={isProductsLoading}
        indicator={<LoadingOutlined />}
        tip="Carregando produtos..."
        style={{ width: "100%", height: "100%" }}
      >
        {categoriesToShow.map((category) => {
          const categoryProducts = productsData?.filter(
            (product: Product) => product.categoria?.id === category.value
          );

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
                  <ProductCard key={`posts${product.id}`} product={product} />
                ))}
              </Flex>
            </div>
          );
        })}
      </Spin>
    </div>
  );
}
