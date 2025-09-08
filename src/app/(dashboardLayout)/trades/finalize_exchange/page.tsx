"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Flex,
  Typography,
  Button,
  Radio,
  Divider,
  message,
  Spin,
} from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbRoute from "@/components/BreadcrumbRoute";
import {
  HomeOutlined,
  EnvironmentOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

export default function ShippingMethodPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tradeId = searchParams.get("tradeId");

  const [selectedAddress, setSelectedAddress] = useState<string>("home");
  const [selectedMethod, setSelectedMethod] = useState<string>("correios");
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>(null);

  // Buscar informações da trade
  useEffect(() => {
    if (!tradeId) {
      message.error("ID da negociação não encontrado");
      router.push("/trades");
      return;
    }

    const fetchTrade = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/propostas/${tradeId}`);
        setTrade(data);
      } catch (err: any) {
        message.error(
          err.response?.data?.error || "Erro ao carregar negociação"
        );
        router.push("/trades");
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [tradeId, router]);

  const addresses = [
    {
      key: "home",
      label: "Minha Casa",
      description: "João da Silva, Avenida dos Açores, 789",
      icon: <HomeOutlined />,
    },
    {
      key: "work",
      label: "Meu Trabalho",
      description: "João da Silva, Avenida dos Açores, 799",
      icon: <EnvironmentOutlined />,
    },
  ];

  const methods = [
    {
      key: "correios",
      label: "Grátis Correios",
      description: "Entrega em 7 dias",
    },
    { key: "loggi", label: "R$7,90 Loggi", description: "Entrega em 1-2 dias" },
    {
      key: "jadlog",
      label: "R$17,90 Jadlog",
      description: "Entrega em 2 dias",
    },
  ];

  const handleFinish = async () => {
    if (!tradeId) {
      message.error("ID da negociação não encontrado");
      return;
    }

    try {
      setLoading(true);

      const finalizationData = {
        responderId: trade?.responder?.id, // ou pegue do usuário logado
        shippingAddress: selectedAddress,
        shippingMethod: selectedMethod,
      };

      // Aqui você já aceita a proposta + finaliza
      const { data } = await axios.post(
        `/api/propostas/${tradeId}/aceitar`,
        finalizationData
      );

      message.success("Negociação finalizada com sucesso!");
      router.push("/trades");
    } catch (err: any) {
      message.error(
        err.response?.data?.message || "Erro ao finalizar negociação"
      );
      console.error("Erro ao finalizar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto carrega os dados da trade
  if (loading && !trade) {
    return (
      <Flex justify="center" align="center" style={{ height: 400 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <Spin spinning={loading}>
      <Flex vertical gap={24} style={{ width: "100%" }}>
        {/* Breadcrumb */}
        <BreadcrumbRoute />

        {/* Título */}
        <Title level={2} style={{ color: "#2A4BA0", margin: 0 }}>
          Forma de Envio
        </Title>
        <Text type="secondary">
          Selecione a melhor forma de envio para seu produto
        </Text>

        {/* Informações da negociação */}
        {trade && (
          <Card style={{ borderRadius: 12, backgroundColor: "#f8f9ff" }}>
            <Text type="secondary">Finalizando negociação:</Text>
            <Title level={4} style={{ margin: "8px 0", color: "#2A4BA0" }}>
              {trade.items?.[0]?.post?.title || "Produto"}
            </Title>
            <Text>
              Com: <Text strong>{trade.requester?.name}</Text>
            </Text>
          </Card>
        )}

        {/* Layout horizontal com imagem à direita */}
        <Flex gap={48} align="flex-start" style={{ marginTop: 16 }}>
          {/* Coluna esquerda - Endereços e Métodos */}
          <Flex vertical gap={32} style={{ flex: 1 }}>
            {/* Endereços */}
            <Flex vertical gap={24}>
              <Title level={4}>Endereço de entrega</Title>
              <Radio.Group
                onChange={(e) => setSelectedAddress(e.target.value)}
                value={selectedAddress}
                style={{ width: "100%" }}
              >
                {addresses.map((addr) => (
                  <Card
                    key={addr.key}
                    style={{ borderRadius: 12, marginBottom: 10 }}
                  >
                    <Flex align="center" justify="space-between">
                      <Flex gap={12}>
                        <Radio value={addr.key} />
                        <Flex vertical>
                          <Text strong>{addr.label}</Text>
                          <Text type="secondary">{addr.description}</Text>
                        </Flex>
                      </Flex>
                      <Button type="link" size="small" icon={<EditOutlined />}>
                        Editar
                      </Button>
                    </Flex>
                  </Card>
                ))}
              </Radio.Group>

              <Button
                block
                shape="round"
                style={{ height: 40, borderStyle: "dashed" }}
              >
                + Adicionar novo endereço
              </Button>
            </Flex>

            {/* Métodos de envio */}
            <Flex vertical gap={24}>
              <Title level={4}>Método de envio</Title>
              <Radio.Group
                onChange={(e) => setSelectedMethod(e.target.value)}
                value={selectedMethod}
                style={{ width: "100%" }}
              >
                {methods.map((method) => (
                  <Card
                    key={method.key}
                    style={{ borderRadius: 12, marginBottom: 10 }}
                  >
                    <Flex align="center" gap={12}>
                      <Radio value={method.key} />
                      <Flex vertical>
                        <Text strong>{method.label}</Text>
                        <Text type="secondary">{method.description}</Text>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Radio.Group>
            </Flex>

            <Divider />
          </Flex>

          {/* Coluna direita - Imagem */}
          <Flex
            justify="center"
            align="center"
            style={{
              flex: "0 0 320px",
              borderRadius: 12,
              background: "#f9f9f9",
              padding: 24,
              height: 320,
            }}
          >
            <img
              src="/delivery-truck.png"
              alt="Delivery"
              style={{ maxHeight: "100%", objectFit: "contain" }}
            />
          </Flex>
        </Flex>

        {/* Botões */}
        <Flex gap={16} justify="flex-end">
          <Button
            shape="round"
            style={{ width: 200 }}
            onClick={() => router.back()}
          >
            Voltar
          </Button>
          <Button
            type="primary"
            shape="round"
            style={{ width: 220, backgroundColor: "#2A4BA0" }}
            onClick={handleFinish}
            disabled={!tradeId}
          >
            Finalizar negociação
          </Button>
        </Flex>
      </Flex>
    </Spin>
  );
}
