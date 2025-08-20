"use client";

import ContentLayout from "@/components/ContentLayout";
import {
  useURLControlledModal,
  URLControlledModalKeys,
} from "@/hooks/useURLControlledModal";
import { StringMap } from "@/types";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Carousel,
  Flex,
  Image,
  Typography,
  Card,
  Input,
  Select,
  Form,
} from "antd";
import { useMemo, useState } from "react";

const { Title } = Typography;
const { Meta } = Card;
const { Option } = Select;

const categories = [
  { name: "Roupas", img: "/images/roupas.jpg" },
  { name: "Casa", img: "/images/casa.jpg" },
  { name: "Cosméticos", img: "/images/cosmeticos.jpg" },
  { name: "Calçados", img: "/images/calcados.jpg" },
  { name: "Acessórios", img: "/images/acessorios.jpg" },
  { name: "Outros", img: "/images/outros.jpg" },
];

const subCategories = ["Subcategoria 1", "Subcategoria 2", "Subcategoria 3"];

const estadosConservacao = [
  "Novo",
  "Usado - Bom estado",
  "Usado - Sinais de uso",
];

const sampleItems = Array.from({ length: 20 }, (_, i) => ({
  title: `Produto ${i + 1}`,
  description: "Descrição do produto",
  image: `https://picsum.photos/200/200?random=${i}`,
  categoria: categories[i % categories.length].name,
  subcategoria: subCategories[i % subCategories.length],
  estado: estadosConservacao[i % estadosConservacao.length],
}));

export default function MyPosts() {
  const { open: openCreatePostModal } = useURLControlledModal(
    URLControlledModalKeys.CREATE_POST_MODAL
  );

  const [form] = Form.useForm();
  const [filterValues, setFilterValues] = useState<StringMap>({});

  const filteredItems = useMemo(() => {
    return sampleItems.filter((item) => {
      const search = filterValues.search?.toLowerCase() || "";
      const categoria = filterValues.categoria;
      const subcategoria = filterValues.subcategoria;
      const estado = filterValues.estado;

      return (
        item.title.toLowerCase().includes(search) &&
        (!categoria || item.categoria === categoria) &&
        (!subcategoria || item.subcategoria === subcategoria) &&
        (!estado || item.estado === estado)
      );
    });
  }, [filterValues]);

  return (
    <ContentLayout
      title="Minhas Publicações"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openCreatePostModal()}
        >
          Criar publicação
        </Button>
      }
    >
      <Flex gap={8}>
        <Card
          title="Filtros"
          style={{ width: 280, flexShrink: 0 }}
          styles={{ body: { paddingBottom: 0 } }}
        >
          <Form
            form={form}
            layout="vertical"
            onValuesChange={(_, allValues) => setFilterValues(allValues)}
          >
            <Form.Item name="search" label="Buscar">
              <Input placeholder="Buscar produto" prefix={<SearchOutlined />} />
            </Form.Item>

            <Form.Item name="categoria" label="Categoria">
              <Select placeholder="Categoria" allowClear>
                {categories.map((cat) => (
                  <Option key={cat.name} value={cat.name}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="subcategoria" label="Subcategoria">
              <Select placeholder="Subcategoria" allowClear>
                {subCategories.map((sub) => (
                  <Option key={sub} value={sub}>
                    {sub}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="estado" label="Estado de conservação">
              <Select placeholder="Estado de conservação" allowClear>
                {estadosConservacao.map((estado) => (
                  <Option key={estado} value={estado}>
                    {estado}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Card>

        <Card
          style={{ flex: 1, overflowY: "auto", height: "calc(100vh - 180px)" }}
          styles={{ body: { padding: 24 } }}
        >
          {categories.map((cat) => {
            const itemsPorCategoria = filteredItems.filter(
              (item) => item.categoria === cat.name
            );

            if (itemsPorCategoria.length === 0) return null;

            return (
              <div key={cat.name} style={{ marginBottom: 64 }}>
                <Title level={4} style={{ marginBottom: 16 }}>
                  {cat.name}
                </Title>

                <Carousel dots={false} slidesToShow={5} draggable>
                  {itemsPorCategoria.map((item, index) => (
                    <div key={index} style={{ padding: "0 8px" }}>
                      <Card
                        hoverable
                        cover={
                          <Image
                            alt={item.title}
                            src={item.image}
                            preview={false}
                          />
                        }
                        style={{ width: 200, margin: "auto" }}
                      >
                        <Meta
                          title={item.title}
                          description={item.description}
                        />
                      </Card>
                    </div>
                  ))}
                </Carousel>
              </div>
            );
          })}
        </Card>
      </Flex>
    </ContentLayout>
  );
}
