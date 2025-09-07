/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { Product } from "@/types/product";
import { getUser } from "@/utils/auth";
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
import { useState, useEffect } from "react";

const { Text, Title, Paragraph } = Typography;

export default function TradeRequestModal() {
  const [loading, setLoading] = useState(false);
  const [userProducts, setUserProducts] = useState<Product[] | null>(null);
  const [targetProduct, setTargetProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[] | null>(
    null
  );

  const { isOpen, close, paramValue } = useURLControlledModal(
    URLControlledModalKeys.TRADE_REQUEST_MODAL
  );

  const selectedProductsOptions = userProducts?.map((p) => ({
    label: p.nome,
    value: p.id,
    key: p.id,
  }));

  const handleOk = async () => {
    if (selectedProducts?.length === 0 || !targetProduct) return;

    setLoading(true);

    try {
      const user = getUser();
      if (!user) throw new Error("Usuário não está logado");

      const items = selectedProducts?.map((productId) => ({
        postId: productId.toString(),
      }));

      const res = await fetch("/api/propostas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterId: user.id,
          responderId: targetProduct.usuario.id,
          message: `Gostaria de trocar meu(s) produto(s) pelo ${targetProduct.nome}`,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar proposta");
      }

      message.success("Proposta enviada com sucesso!");
      setSelectedProducts([]);
      close();
    } catch (error: any) {
      message.error(error.message || "Erro ao enviar proposta");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    setSelectedProducts(null);
    close();
  };

  useEffect(() => {
    if (!isOpen || !paramValue) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch(`/api/produtos/${paramValue}`);
        if (!res.ok) throw new Error("Produto não encontrado");
        const data: Product = await res.json();
        setTargetProduct(data);

        const user = getUser();
        if (!user) throw new Error("Usuário não está logado");

        const userRes = await fetch(`/api/produtos?userId=${user.id}`);
        if (!userRes.ok)
          throw new Error("Não foi possível carregar seus produtos");
        const userData = await userRes.json();
        setUserProducts(userData.produtos || []);
      } catch (error: any) {
        message.error(error.message || "Erro ao carregar dados");
        close();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, paramValue, close]);

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
              src={targetProduct.imagem}
              alt={targetProduct.nome}
              width={120}
              height={120}
              style={{ objectFit: "cover", borderRadius: 8 }}
              preview={false}
            />
            <div>
              <Title level={4}>{targetProduct.nome}</Title>
              <Text type="secondary">{targetProduct.categoria?.nome}</Text>
              <Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: "mais" }}
              >
                {targetProduct.descricao}
              </Paragraph>
            </div>
          </div>

          <Divider />

          <Form layout="vertical">
            <Form.Item
              label="Selecione os produtos que deseja oferecer"
              required
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Escolha seus produtos"
                value={selectedProducts}
                options={selectedProductsOptions}
                onChange={setSelectedProducts}
                optionLabelProp="label"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                block
                disabled={selectedProducts?.length === 0}
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
