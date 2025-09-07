"use client";

import { useState } from "react";
import {
  Card,
  Flex,
  Image,
  Typography,
  Button,
  message,
  Spin,
  Rate,
} from "antd";
import axios from "axios";

const { Title, Text, Link } = Typography;

interface TradeInfoProps {
  tradeId: string | string[];
  responderId: string;
}

export default function TradeInfo({ tradeId, responderId }: TradeInfoProps) {
  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>({
    id: tradeId,
    status: "pendente",
    requester: {
      name: "Maria de Alcântara",
      username: "@mariaalc",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      items: [
        {
          id: 101,
          title: "Sofá de 3 lugares",
          image: "https://picsum.photos/200?random=10",
          rating: 4.5,
        },
      ],
    },
    responder: {
      name: "Você",
      items: [
        {
          id: 201,
          title: "Gradient Graphic T-shirt",
          image: "https://picsum.photos/300?random=1",
          rating: 4.5,
        },
        {
          id: 202,
          title: "Gradient Graphic T-shirt",
          image: "https://picsum.photos/300?random=2",
          rating: 4.5,
        },
      ],
    },
  });

  // Função para aceitar ou recusar proposta
  const handleAction = async (action: "aceitar" | "recusar") => {
    try {
      setLoading(true);
      const res = await axios.post(`/api/propostas/${trade.id}/${action}`, {
        responderId,
      });

      message.success(res.data.message);
      setTrade((prev: any) => ({
        ...prev,
        status: res.data.proposta.status,
      }));
    } catch (err: any) {
      message.error(err.response?.data?.message || "Erro ao processar ação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Flex gap={48} align="flex-start">
        {/* Coluna esquerda - Proponente + Item Interesse */}
        <Flex vertical gap={24} style={{ width: "30%" }}>
          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Proponente</Text>
            <Flex align="center" gap={12} style={{ marginTop: 8 }}>
              <Image
                src={trade.requester.avatar}
                width={50}
                height={50}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <Flex vertical>
                <Link strong>{trade.requester.name}</Link>
                <Text type="secondary">{trade.requester.username}</Text>
              </Flex>
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Item de Interesse</Text>
            {trade.requester.items.map((item: any) => (
              <Flex vertical key={item.id} style={{ marginTop: 16 }}>
                <Image
                  src={item.image}
                  width="100%"
                  height={160}
                  style={{
                    borderRadius: 12,
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                />
                <Rate disabled allowHalf defaultValue={item.rating} />
                <Text strong>{item.title}</Text>
              </Flex>
            ))}
          </Card>
        </Flex>

        {/* Coluna direita - Itens oferecidos */}
        <Flex vertical gap={16} style={{ flex: 1 }}>
          <Title level={4}>Qual produto está sendo ofertado em troca?</Title>
          <Text type="secondary" style={{ marginBottom: 16 }}>
            Lista de produtos que estão sendo ofertados em troca do seu item
          </Text>

          <Flex wrap gap={24}>
            {trade.responder.items.map((item: any) => (
              <Card
                key={item.id}
                hoverable
                style={{ width: 200, borderRadius: 12 }}
                cover={
                  <Image
                    src={item.image}
                    height={180}
                    style={{
                      borderRadius: "12px 12px 0 0",
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Rate disabled allowHalf defaultValue={item.rating} />
                <Text strong>{item.title}</Text>
              </Card>
            ))}
          </Flex>

          {/* Botões */}
          <Flex gap={16} justify="flex-end" style={{ marginTop: 24 }}>
            <Button
              danger
              shape="round"
              style={{ width: 140 }}
              disabled={trade.status !== "pendente"}
              onClick={() => handleAction("recusar")}
            >
              Recusar
            </Button>
            <Button
              type="primary"
              shape="round"
              style={{ width: 140 }}
              disabled={trade.status !== "pendente"}
              onClick={() => handleAction("aceitar")}
            >
              Aceitar
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Spin>
  );
}
