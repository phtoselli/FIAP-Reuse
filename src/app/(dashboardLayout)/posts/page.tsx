/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ProductCard from "@/components/ProductCard";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import useService from "@/hooks/useService";
import useTypeService from "@/hooks/useTypeService";
import { productService } from "@/service/products";
import { Product } from "@/types/product";
import { QueryParamsKey } from "@/types/queryParams";
import { Routes } from "@/types/routes";
import { Type, Types } from "@/types/type";
import { CategoryCode } from "@/types/type/category";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Carousel,
  Divider,
  Flex,
  Image,
  Typography,
  theme,
  Spin,
} from "antd";
import { useEffect } from "react";

const { Title, Paragraph } = Typography;

export default function Posts() {
  const { token } = theme.useToken();

  const { redirect } = useSearchParamsHelper();

  const {
    data: productsData,
    execute: getAllProducts,
    isLoading: isProductsLoading,
  } = useService(productService.get);

  const handleCategoryClick = (category: CategoryCode) => {
    redirect(Routes.CATEGORIES, [{ [QueryParamsKey.CATEGORY]: category }]);
  };

  useEffect(() => {
    getAllProducts({ limit: 20, offset: 0, active: true });
  }, []);

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

      <Divider />

      <Spin
        size="large"
        spinning={isProductsLoading}
        indicator={<LoadingOutlined />}
        tip="Carregando produtos..."
        style={{ width: "100%", height: "100%" }}
      >
        <div style={{ minHeight: 200 }}>
          <Title level={1} style={{ color: "#2A4BA0" }}>
            Roupas
          </Title>
          <Carousel
            arrows
            draggable
            dots={false}
            slidesToShow={5}
            style={{ padding: "0px" }}
          >
            {productsData
              ?.filter((product: Product) => product.categoria?.id === "ROUPAS")
              .map((product: Product) => (
                <ProductCard key={`posts${product.id}`} product={product} />
              ))}
          </Carousel>
        </div>

        <div style={{ minHeight: 200 }}>
          <Title level={1} style={{ color: "#2A4BA0" }}>
            Casa
          </Title>
          <Carousel
            arrows
            draggable
            dots={false}
            slidesToShow={5}
            style={{ padding: "0px" }}
          >
            {productsData
              ?.filter((product: Product) => product.categoria?.id === " CASA")
              .map((product: Product) => (
                <ProductCard key={`posts${product.id}`} product={product} />
              ))}
          </Carousel>
        </div>

        <div style={{ minHeight: 200 }}>
          <Title level={1} style={{ color: "#2A4BA0" }}>
            Cosméticos
          </Title>
          <Carousel
            arrows
            draggable
            dots={false}
            slidesToShow={5}
            style={{ padding: "0px" }}
          >
            {productsData
              ?.filter(
                (product: Product) => product.categoria?.id === "COSMÉTICOS"
              )
              .map((product: Product) => (
                <ProductCard key={`posts${product.id}`} product={product} />
              ))}
          </Carousel>
        </div>

        <div style={{ minHeight: 200 }}>
          <Title level={1} style={{ color: "#2A4BA0" }}>
            Calçados
          </Title>
          <Carousel
            arrows
            draggable
            dots={false}
            slidesToShow={5}
            style={{ padding: "0px" }}
          >
            {productsData
              ?.filter(
                (product: Product) => product.categoria?.id === " CALÇADOS"
              )
              .map((product: Product) => (
                <ProductCard key={`posts${product.id}`} product={product} />
              ))}
          </Carousel>
        </div>

        <div style={{ minHeight: 200 }}>
          <Title level={1} style={{ color: "#2A4BA0" }}>
            Acessórios
          </Title>
          <Carousel
            arrows
            draggable
            dots={false}
            slidesToShow={5}
            style={{ padding: "0px" }}
          >
            {productsData
              ?.filter(
                (product: Product) => product.categoria?.id === " ACESSÓRIOS"
              )
              .map((product: Product) => (
                <ProductCard key={`posts${product.id}`} product={product} />
              ))}
          </Carousel>
        </div>

        <div style={{ minHeight: 200 }}>
          <Title level={1} style={{ color: "#2A4BA0" }}>
            Outros
          </Title>
          <Carousel
            arrows
            draggable
            dots={false}
            slidesToShow={5}
            style={{ padding: "0px" }}
          >
            {productsData
              ?.filter((product: Product) => product.categoria?.id === "OUTROS")
              .map((product: Product) => (
                <ProductCard key={`posts${product.id}`} product={product} />
              ))}
          </Carousel>
        </div>
      </Spin>
    </div>
  );
}
