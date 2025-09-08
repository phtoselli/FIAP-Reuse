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
import { useParams, useRouter } from "next/navigation"; // Adicionado useRouter aqui
import { getUser } from "@/utils/auth";

const { Title, Text, Link } = Typography;

export default function TradeInfo() {
  const user = getUser();
  const params = useParams();
  const router = useRouter(); // Usando o hook useRouter
  const tradeId = params.tradeId as string;
  const responderId = user.id;

  const [loading, setLoading] = useState(false);
  const [trade, setTrade] = useState<any>(null);

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

  // Itens oferecidos = requester
  const offeredItems = trade.items?.filter(
    (i: any) => trade.requester?.id === trade.requester?.id // todos os itens do requester
  );

  // Item de interesse = responder
  const interestItems = trade.items?.filter(
    (i: any) => trade.responder?.id === trade.responder?.id // todos do responder
  );

  return (
    <Spin spinning={loading}>
      <Flex gap={48} align="flex-start">
        {/* Coluna esquerda - Proponente + Item de Interesse */}
        <Flex vertical gap={24} style={{ width: "30%" }}>
          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Proponente</Text>
            <Flex align="center" gap={12} style={{ marginTop: 8 }}>
              <Image
                src={trade.requester?.avatarUrl || "https://picsum.photos/50"}
                width={50}
                height={50}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                preview={false}
              />
              <Flex vertical>
                <Link strong>{trade.requester?.name}</Link>
                <Text type="secondary">{trade.requester?.email}</Text>
              </Flex>
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Item de Interesse</Text>
            {interestItems?.map((item: any) => (
              <Flex vertical key={item.id} style={{ marginTop: 16 }}>
                <Image
                  src={item.post?.imageUrl || "https://picsum.photos/200"}
                  width="100%"
                  height={160}
                  style={{
                    borderRadius: 12,
                    objectFit: "cover",
                    marginBottom: 8,
                  }}
                  preview={false}
                />
                <Rate disabled allowHalf defaultValue={item.post?.rating} />
                <Text strong>{item.post?.title}</Text>
                <Text>{item.post?.description}</Text>
                <Text type="secondary">
                  Categoria: {item.post?.subcategory?.name || "Sem categoria"}
                </Text>
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
            {offeredItems?.map((item: any) => (
              <Card
                key={item.id}
                hoverable
                style={{ width: 220, borderRadius: 12 }}
                cover={
                  <Image
                    src={item.post?.imageUrl || "https://picsum.photos/220"}
                    height={180}
                    style={{
                      borderRadius: "12px 12px 0 0",
                      objectFit: "cover",
                    }}
                    preview={false}
                  />
                }
              >
                <Rate disabled allowHalf defaultValue={item.post?.rating} />
                <Text strong>{item.post?.title}</Text>
                <Text>{item.post?.description}</Text>
                <Text type="secondary">
                  Categoria: {item.post?.subcategory?.name || "Sem categoria"}
                </Text>
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
              onClick={() => {
                router.push(`/trades/finalize_exchange?tradeId=${tradeId}`);
              }}
            >
              Aceitar
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Spin>
  );
}
