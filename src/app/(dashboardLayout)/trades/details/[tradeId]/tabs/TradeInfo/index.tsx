"use client";

import { useEffect, useState } from "react";
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
import { useParams, useSearchParams } from "next/navigation";
import { getUser } from "@/utils/auth";

const { Title, Text, Link } = Typography;

export default function TradeInfo() {
  const user = getUser();
  const params = useParams();
  const searchParams = useSearchParams();
  const tradeId = params.tradeId as string;
  const responderId = user.id;

  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>(null);

  // Buscar detalhes da proposta pelo novo endpoint GET /api/propostas/:id
  const fetchTrade = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/propostas/${tradeId}`);
      setTrade(data);
    } catch (err: any) {
      message.error(err.response?.data?.error || "Erro ao carregar proposta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrade();
  }, [tradeId]);

  // Aceitar ou recusar proposta
  const handleAction = async (action: "aceitar" | "recusar") => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/propostas/${tradeId}/${action}`, {
        responderId,
      });
      message.success(data.message);
      setTrade((prev: any) => ({ ...prev, status: data.proposta.status }));
    } catch (err: any) {
      message.error(err.response?.data?.message || "Erro ao processar ação");
    } finally {
      setLoading(false);
    }
  };

  if (!trade) return <Spin spinning={true} />;

  return (
    <Spin spinning={loading}>
      <Flex gap={48} align="flex-start">
        {/* Coluna esquerda - Proponente + Item Interesse */}
        <Flex vertical gap={24} style={{ width: "30%" }}>
          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Proponente</Text>
            <Flex align="center" gap={12} style={{ marginTop: 8 }}>
              <Image
                src={trade.requester?.avatar}
                width={50}
                height={50}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <Flex vertical>
                <Link strong>{trade.requester?.name}</Link>
                <Text type="secondary">{trade.requester?.username}</Text>
              </Flex>
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Item de Interesse</Text>
            {trade.requester?.items?.map((item: any) => (
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
            {trade.responder?.items?.map((item: any) => (
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
              disabled={trade.status !== "pending"}
              onClick={() => handleAction("recusar")}
            >
              Recusar
            </Button>
            <Button
              type="primary"
              shape="round"
              style={{ width: 140 }}
              disabled={trade.status !== "pending"}
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
