/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Select,
  Form,
  Button,
  Typography,
  Image,
  Spin,
  Divider,
  message,
} from "antd";
import { Product } from "@/types/product";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { getUser } from "@/utils/auth";
import { CategoryId, CategoryCode } from "@/types/type/category";

const { Text, Title, Paragraph } = Typography;

export default function TradeRequestModal() {
  const [loading, setLoading] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[] | null>(null);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const { isOpen, close, paramValue } = useURLControlledModal(
    URLControlledModalKeys.TRADE_REQUEST_MODAL
  );

  const getCategoryName = (id?: string) => {
    if (!id) return "Sem categoria";
    const entry = Object.entries(CategoryId).find(([_, value]) => value === id);
    if (!entry) return "Sem categoria";
    return CategoryCode[entry[0] as keyof typeof CategoryCode];
  };

  const selectedProductsOptions = userProducts?.map((p) => ({
    label: p.nome,
    value: p.id,
    key: p.id,
  }));

  const handleOk = async () => {
    if (!selectedProduct || !targetProduct) return;

    setLoading(true);

    try {
      const user = getUser();
      if (!user) throw new Error("Usuário não está logado");

      const res = await fetch("/api/propostas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: user.id,
          responderId: targetProduct.usuario.id,
          message: `Gostaria de trocar meu produto pelo ${targetProduct.nome}`,
          items: [
            { postId: selectedProduct, isOffered: true },
            { postId: targetProduct.id, isOffered: false },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar proposta");

      message.success("Proposta enviada com sucesso!");
      setSelectedProduct(null);
      close();
    } catch (error: any) {
      message.error(error.message || "Erro ao enviar proposta");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setSelectedProduct(null);
    setTargetProduct(null);
    setUserProducts(null);
    close();
  };

  useEffect(() => {
    if (!isOpen || !paramValue) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/produtos/${paramValue}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data: Product = await res.json();
        if (!isMounted) return;
        setTargetProduct(data);

        const user = getUser();
        if (!user) throw new Error("Usuário não está logado");

        const userRes = await fetch(`/api/produtos`);
        if (!userRes.ok)
          throw new Error("Não foi possível carregar seus produtos");
        const userData = await userRes.json();
        if (!isMounted) return;

        const myProducts = (userData.produtos || []).filter(
          (p: Product) => p.usuario.id === user.id
        );

        setUserProducts(myProducts);
      } catch (error: any) {
        message.error(error.message || "Erro ao carregar dados");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, paramValue]);

  return (
    <Modal
      centered
      title="Proposta de troca"
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {loading || !targetProduct ? (
        <Spin tip="Carregando produto..." />
      ) : (
        <>
          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <Image
              src={
                targetProduct.imagem
                  ? `data:image/png;base64,${targetProduct.imagem}`
                  : "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={targetProduct.nome}
              width={120}
              height={120}
              style={{ objectFit: "cover", borderRadius: 8 }}
              preview={false}
            />
            <div>
              <Title level={4}>{targetProduct.nome}</Title>
              <Text type="secondary">
                Categoria: {targetProduct.categoria.id || "Sem Categoria"}
              </Text>
              <Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: "mais" }}
              >
                {targetProduct.descricao || "Sem descrição"}
              </Paragraph>
            </div>
          </div>

          <Divider />

          <Form layout="vertical">
            <Form.Item label="Selecione o produto que deseja oferecer" required>
              <Select
                style={{ width: "100%" }}
                placeholder="Escolha seu produto"
                value={selectedProduct}
                options={selectedProductsOptions}
                onChange={setSelectedProduct}
                optionLabelProp="label"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block
                disabled={!selectedProduct}
                onClick={handleOk}
              >
                Confirmar Proposta
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
}
