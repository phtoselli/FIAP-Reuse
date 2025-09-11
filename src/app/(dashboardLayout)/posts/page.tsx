/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import { Product } from "@/types/product";
import { QueryParamsKey } from "@/types/queryParams";
import { Routes } from "@/types/routes";
import { CategoryId } from "@/types/type/category";
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
  message,
} from "antd";
import { getUser } from "@/utils/auth";
import VLibras from "@/components/Vlibras";
import { FALLBACK_URL } from "@/utils";

const { Title, Paragraph } = Typography;

const categories = [
  { label: "Roupas", value: CategoryId.CLOTHING },
  { label: "Casa", value: CategoryId.HOUSE },
  { label: "Calçados", value: CategoryId.FOOTWEAR },
  { label: "Acessórios", value: CategoryId.ACCESSORIES },
  { label: "Cosméticos", value: CategoryId.COSMETICS },
  { label: "Outros", value: CategoryId.OTHERS },
];

export default function Posts() {
  const { redirect } = useSearchParamsHelper();

  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/produtos?active=true&limit=20`);
      if (!res.ok) throw new Error("Erro na requisição");
      const data = await res.json();
      setProducts(data.produtos ?? []);
    } catch (error: any) {
      messageApi.error(error.message || "Erro ao buscar produtos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getUser();
    if (!user) {
      redirect(Routes.LOGIN);
      return;
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {contextHolder}
      <VLibras />

      <Flex
        wrap
        align="center"
        justify="space-between"
        style={{ background: "#2A4BA0", borderRadius: 8, marginBottom: 48 }}
      >
        <div style={{ width: "500px", padding: "40px" }}>
          <Title level={1} style={{ color: token["yellow-6"] }}>
            A primeira plataforma de troca do país
          </Title>
          <Paragraph style={{ color: token.colorWhite }} strong>
            Conectando pessoas para trocar produtos de forma segura, sustentável
            e fácil.
          </Paragraph>
        </div>

        <Flex align="center" justify="center" style={{ flex: 1 }}>
          <Image
            src="/hero.png"
            width={300}
            alt="Banner"
            preview={false}
            fallback={FALLBACK_URL}
          />
        </Flex>
      </Flex>

      <Spin
        size="large"
        spinning={loading}
        indicator={<LoadingOutlined />}
        tip="Carregando produtos..."
      >
        {categories.map((category) => (
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
              {products.slice(0, 5).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Flex>
          </div>
        ))}
      </Spin>
    </div>
  );
}
