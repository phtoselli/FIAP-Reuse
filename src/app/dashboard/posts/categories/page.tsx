"use client";

import { useEffect, useState } from "react";

import {
  Divider,
  Flex,
  Select,
  Button,
  List,
  Card,
  Spin,
  Breadcrumb,
} from "antd";
import Title from "antd/es/typography/Title";

type Produto = {
  id: number;
  nome: string;
  categoria: string;
};

const todasCategorias = [
  "Roupas",
  "Casa",
  "Cosméticos",
  "Calçados",
  "Acessórios",
  "Outros",
];

const todosProdutos: Produto[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nome: `Produto ${i + 1}`,
  categoria: todasCategorias[i % todasCategorias.length],
}));

const PAGE_SIZE = 10;

export default function Categories() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | undefined
  >(undefined);
  const [produtosVisiveis, setProdutosVisiveis] = useState<Produto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(false);

  const produtosFiltrados = categoriaSelecionada
    ? todosProdutos.filter((p) => p.categoria === categoriaSelecionada)
    : todosProdutos;

  const carregarProdutos = () => {
    setCarregando(true);
    setTimeout(() => {
      const novosProdutos = produtosFiltrados.slice(0, paginaAtual * PAGE_SIZE);
      setProdutosVisiveis(novosProdutos);
      setCarregando(false);
    }, 500); // Simula um delay
  };

  const handleCarregarMais = () => {
    setPaginaAtual((prev) => prev + 1);
  };

  useEffect(() => {
    setPaginaAtual(1); // Reset ao trocar categoria
  }, [categoriaSelecionada]);

  useEffect(() => {
    carregarProdutos();
  }, [paginaAtual, categoriaSelecionada]);

  const acabouOsProdutos = produtosVisiveis.length >= produtosFiltrados.length;

  return (
    <div>
      <Flex align="center" justify="space-between">
        <Breadcrumb
          items={[{ title: "Publicações" }, { title: "Categorias" }]}
        />
        <Select
          placeholder="Filtrar por categoria"
          style={{ width: 200 }}
          allowClear
          value={categoriaSelecionada}
          onChange={(value) => setCategoriaSelecionada(value)}
        >
          {todasCategorias.map((cat) => (
            <Select.Option key={cat} value={cat}>
              {cat}
            </Select.Option>
          ))}
        </Select>
      </Flex>

      <Divider />

      {produtosFiltrados.length > 0 && (
        <>
          <Title style={{ marginBottom: 16 }}>Em destaque</Title>
          <List
            grid={{ gutter: 16, column: 5 }}
            dataSource={produtosFiltrados.slice(0, 5)}
            renderItem={(produto) => (
              <List.Item>
                <Card title={produto.nome}>Categoria: {produto.categoria}</Card>
              </List.Item>
            )}
          />

          <Divider />
        </>
      )}

      <h2 style={{ marginBottom: 16 }}>Todos os produtos</h2>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={produtosVisiveis}
        loading={carregando}
        renderItem={(produto) => (
          <List.Item>
            <Card title={produto.nome}>Categoria: {produto.categoria}</Card>
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
    </div>
  );
}
