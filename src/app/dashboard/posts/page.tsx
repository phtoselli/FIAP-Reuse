"use client";

import {
  Button,
  Carousel,
  Divider,
  Flex,
  Image,
  Typography,
  Card,
  Avatar,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const { Title, Paragraph } = Typography;
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
}));

export default function Posts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);

    router.push(`/categories?${params.toString()}`);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Flex
        align="center"
        justify="space-between"
        style={{
          background: "#f5f5f5",
          padding: "48px 24px",
          borderRadius: 8,
          marginBottom: 48,
        }}
      >
        <div style={{ flex: 1 }}>
          <Title>A primeira plataforma de troca do país</Title>
          <Paragraph type="secondary">
            Conectando pessoas para trocar produtos de forma segura, sustentável
            e fácil.
          </Paragraph>
        </div>
        <Image
          src="/images/hero-banner.jpg"
          width={400}
          height={300}
          alt="Banner"
          preview={false}
          style={{ borderRadius: 8 }}
        />
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

          <Carousel dots={false} slidesToShow={4} draggable>
            {sampleItems.map((item, index) => (
              <div key={index} style={{ padding: "0 8px" }}>
                <Card
                  hoverable
                  cover={<Image alt={item.title} src={item.image} />}
                  style={{ width: 200, margin: "auto" }}
                >
                  <Meta title={item.title} description={item.description} />
                </Card>
              </div>
            ))}
          </Carousel>
        </div>
      ))}
    </div>
  );
}
