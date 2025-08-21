"use client";

import { Routes } from "@/types/routes";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  Button,
  Carousel,
  Divider,
  Flex,
  Image,
  Typography,
  Card,
  Avatar,
  theme,
  Rate,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { JSXElementConstructor, ReactElement, ReactNode } from "react";

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const categories = [
  { name: "Roupas", img: "/images/roupas.jpg" },
  { name: "Casa", img: "/images/casa.jpg" },
  { name: "Cosméticos", img: "/images/cosmeticos.jpg" },
  { name: "Calçados", img: "/images/calcados.jpg" },
  { name: "Acessórios", img: "/images/acessorios.jpg" },
  { name: "Outros", img: "/images/outros.jpg" },
];

const sampleItems = Array.from({ length: 8 }, (_, i) => ({
  title: `Produto ${i + 1}`,
  description: "Descrição do produto",
  image: `https://picsum.photos/200/200?random=${i}`,
  rate: Math.floor(Math.random() * 6),
  rateNumber: Math.floor(Math.random() * 999),
}));

export default function Posts() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = theme.useToken();

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);

    router.push(`${Routes.CATEGORIES}?${params.toString()}`);
  };

  return (
    <div>
      <Flex
        wrap
        align="center"
        justify="space-between"
        style={{
          background: token.colorPrimary,
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

      <Title level={4}>Categorias</Title>
      <Flex
        align="center"
        justify="space-between"
        style={{ marginBottom: "24px" }}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            style={{ textAlign: "center", cursor: "pointer" }}
            onClick={() => handleCategoryClick(cat.name)}
          >
            <Avatar
              size={80}
              src={cat.img}
              style={{ border: "2px solid #d9d9d9" }}
            />
            <Paragraph>{cat.name}</Paragraph>
          </div>
        ))}
      </Flex>

      <Divider />

      {categories.map((cat) => (
        <div key={cat.name} style={{ marginBottom: 64 }}>
          <Flex
            justify="space-between"
            align="center"
            style={{ marginBottom: 16 }}
          >
            <Title level={4}>{cat.name}</Title>
            <Button type="link" onClick={() => handleCategoryClick(cat.name)}>
              Ver mais
            </Button>
          </Flex>

          <Carousel
            arrows
            draggable
            dots={false}
            slidesToShow={5.5}
            style={{
              padding: "0px",
            }}
          >
            {sampleItems.map((item, index) => (
              <div key={index} style={{ padding: "30px", margin: "8px" }}>
                <Card
                  hoverable
                  cover={
                    <Image
                      alt={item.title}
                      src={item.image}
                      height={130}
                      preview={false}
                      style={{ borderRadius: "8px", border: "2px solid white" }}
                    />
                  }
                  style={{
                    width: 200,
                    margin: "16px",
                    border: "2px solid white",
                  }}
                  styles={{ body: { padding: "8px 4px 16px 4px" } }}
                >
                  <Meta
                    title={item.title}
                    description={
                      <Flex align="center" justify="space-between">
                        <Rate disabled value={item.rate} />
                        <Text
                          type="secondary"
                          style={{ fontSize: token.fontSizeSM }}
                        >
                          ({item.rateNumber} avaliações)
                        </Text>
                      </Flex>
                    }
                  />
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      ))}
    </div>
  );
}
