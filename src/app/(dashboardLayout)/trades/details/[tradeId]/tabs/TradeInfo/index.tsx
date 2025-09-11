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
import { FALLBACK_URL } from "@/utils";

const { Title, Text, Link } = Typography;

export default function TradeInfo() {
  const user = getUser();
  const params = useParams();
  const router = useRouter();
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

  const offeredItems = trade.items?.filter(
    (i: any) => trade.requester?.id === trade.requester?.id
  );

  const interestItems = trade.items?.filter(
    (i: any) => trade.responder?.id === trade.responder?.id
  );

  return (
    <Spin spinning={loading}>
      <Flex gap={48} align="flex-start">
        <Flex vertical gap={24} style={{ width: "30%" }}>
          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Proponente</Text>
            <Flex align="center" gap={12} style={{ marginTop: 8 }}>
              <Image
                alt="img"
                src={trade.requester?.avatarUrl || "https://picsum.photos/50"}
                width={50}
                height={50}
                style={{ borderRadius: "50%", objectFit: "cover" }}
                preview={false}
                fallback={FALLBACK_URL}
              />
              <Flex vertical>
                <Link strong>{trade.requester?.name}</Link>
                <Text type="secondary">{trade.requester?.email}</Text>
              </Flex>
            </Flex>
          </Card>

          <Card style={{ borderRadius: 12 }}>
            <Text type="secondary">Item de Interesse</Text>
            {interestItems
              ?.filter((item: any) => !item.isOffered)
              ?.map((item: any) => (
                <Flex vertical key={item.id} style={{ marginTop: 16 }}>
                  <Image
                    alt="img"
                    src={
                      item.post?.imageUrl
                        ? `data:image/png;base64,${item.post?.imageUrl}`
                        : "https://picsum.photos/200"
                    }
                    width="100%"
                    height={160}
                    style={{
                      borderRadius: 12,
                      objectFit: "cover",
                      marginBottom: 8,
                    }}
                    preview={false}
                    fallback={FALLBACK_URL}
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

        <Flex vertical gap={16} style={{ flex: 1 }}>
          <Title level={4}>Qual produto está sendo ofertado em troca?</Title>
          <Text type="secondary" style={{ marginBottom: 16 }}>
            Lista de produtos que estão sendo ofertados em troca do seu item
          </Text>

          <Flex wrap gap={24}>
            {offeredItems
              ?.filter((item: any) => item.isOffered)
              .map((item: any) => (
                <Flex vertical key={item.id} style={{ marginTop: 16 }}>
                  <Image
                    alt="img"
                    src={
                      item.post?.imageUrl
                        ? `data:image/png;base64,${item.post?.imageUrl}`
                        : "https://picsum.photos/200"
                    }
                    width="100%"
                    height={160}
                    style={{
                      borderRadius: 12,
                      objectFit: "cover",
                      marginBottom: 8,
                    }}
                    preview={false}
                    fallback={FALLBACK_URL}
                  />
                  <Rate disabled allowHalf defaultValue={item.post?.rating} />
                  <Text strong>{item.post?.title}</Text>
                  <Text>{item.post?.description}</Text>
                  <Text type="secondary">
                    Categoria: {item.post?.subcategory?.name || "Sem categoria"}
                  </Text>
                </Flex>
              ))}
          </Flex>

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
