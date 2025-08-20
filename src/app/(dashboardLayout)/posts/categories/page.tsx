"use client";

import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  List,
  Select,
  Spin,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { StringMap } from "@/types";
import ContentLayout from "@/components/ContentLayout";
import BreadcrumbRoute from "@/components/BreadcrumbRoute";

const { Title } = Typography;
const { Option } = Select;

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  subcategoria: string;
  estado: string;
};

const todasCategorias = [
  "Roupas",
  "Casa",
  "Cosméticos",
  "Calçados",
  "Acessórios",
  "Outros",
];

const subCategorias = ["Subcategoria 1", "Subcategoria 2", "Subcategoria 3"];
const estadosConservacao = [
  "Novo",
  "Usado - Bom estado",
  "Usado - Sinais de uso",
];

const todosProdutos: Produto[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nome: `Produto ${i + 1}`,
  categoria: todasCategorias[i % todasCategorias.length],
  subcategoria: subCategorias[i % subCategorias.length],
  estado: estadosConservacao[i % estadosConservacao.length],
}));

const PAGE_SIZE = 10;

export default function Categories() {
  const [form] = Form.useForm();
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [produtosVisiveis, setProdutosVisiveis] = useState<Produto[]>([]);
  const [filterValues, setFilterValues] = useState<StringMap>({});

  const produtosFiltrados = useMemo(() => {
    return todosProdutos.filter((item) => {
      const search = filterValues.search?.toLowerCase() || "";
      const categoria = filterValues.categoria;
      const subcategoria = filterValues.subcategoria;
      const estado = filterValues.estado;

      return (
        item.nome.toLowerCase().includes(search) &&
        (!categoria || item.categoria === categoria) &&
        (!subcategoria || item.subcategoria === subcategoria) &&
        (!estado || item.estado === estado)
      );
    });
  }, [filterValues]);

  const carregarProdutos = () => {
    setCarregando(true);
    setTimeout(() => {
      const novosProdutos = produtosFiltrados.slice(0, paginaAtual * PAGE_SIZE);
      setProdutosVisiveis(novosProdutos);
      setCarregando(false);
    }, 500);
  };

  const handleCarregarMais = () => {
    setPaginaAtual((prev) => prev + 1);
  };

  useEffect(() => {
    setPaginaAtual(1);
  }, [filterValues]);

  useEffect(() => {
    carregarProdutos();
  }, [paginaAtual, filterValues]);

  const acabouOsProdutos = produtosVisiveis.length >= produtosFiltrados.length;

  return (
    <ContentLayout title="Publicações" extra={<BreadcrumbRoute />}>
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
                {todasCategorias.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="subcategoria" label="Subcategoria">
              <Select placeholder="Subcategoria" allowClear>
                {subCategorias.map((sub) => (
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
          style={{ flex: 1, overflowY: "auto", height: "calc(100vh - 205px)" }}
          styles={{ body: { padding: 24 } }}
        >
          {produtosFiltrados.length > 0 && (
            <>
              <Title level={4} style={{ marginBottom: 16 }}>
                Em destaque
              </Title>
              <List
                grid={{ gutter: 16, column: 5 }}
                dataSource={produtosFiltrados.slice(0, 5)}
                renderItem={(produto) => (
                  <List.Item>
                    <Card title={produto.nome}>
                      <div>Categoria: {produto.categoria}</div>
                      <div>Subcategoria: {produto.subcategoria}</div>
                      <div>Estado: {produto.estado}</div>
                    </Card>
                  </List.Item>
                )}
              />
              <Divider />
            </>
          )}

          <Title level={5} style={{ marginBottom: 16 }}>
            Todos os produtos
          </Title>
          <List
            grid={{ gutter: 16, column: 5 }}
            dataSource={produtosVisiveis}
            loading={carregando}
            renderItem={(produto) => (
              <List.Item>
                <Card title={produto.nome}>
                  <div>Categoria: {produto.categoria}</div>
                  <div>Subcategoria: {produto.subcategoria}</div>
                  <div>Estado: {produto.estado}</div>
                </Card>
              </List.Item>
            )}
          />

          <div style={{ textAlign: "center", marginTop: 16 }}>
            {carregando && <Spin />}
            {!carregando && !acabouOsProdutos && (
              <Button onClick={handleCarregarMais}>Carregar mais</Button>
            )}
            {!carregando && acabouOsProdutos && produtosVisiveis.length > 0 && (
              <div style={{ marginTop: 12, color: "#999" }}>
                Todos os produtos carregados
              </div>
            )}
          </div>
        </Card>
      </Flex>
    </ContentLayout>
  );
}
