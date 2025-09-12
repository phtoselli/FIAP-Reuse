/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { JSX, useEffect, useState } from "react";
import {
  Descriptions,
  Card,
  Typography,
  message,
  Spin,
  Row,
  Col,
  Divider,
  Tag,
  Avatar,
  Flex,
  Image,
  Button,
} from "antd";
import axios from "axios";
import { getUser } from "@/utils/auth";
import {
  CheckOutlined,
  CloseOutlined,
  SwapOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FALLBACK_URL } from "@/utils";

const { Text } = Typography;

const tradeStatus: Record<string, JSX.Element> = {
  pending: <Tag color="orange">Pendente</Tag>,
};

export default function TradeInfo({ tradeId }: { tradeId: string | string[] }) {
  const user = getUser();
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

  const offeredItems = trade.items?.filter((i: any) => i.isOffered)[0];
  const interestItems = trade.items?.filter((i: any) => !i.isOffered)[0];

  return (
    <Card
      title="Informações de Troca"
      loading={loading}
      style={{ height: "400px" }}
      styles={{ body: { height: "310px" }, actions: { padding: "2px 8px" } }}
      extra={
        <Flex gap={4}>
          <Button
            size="small"
            title="Recusar proposta"
            icon={<CloseOutlined />}
            color="danger"
            variant="filled"
            onClick={() => handleAction("recusar")}
          >
            Recusar
          </Button>
          <Button
            size="small"
            title="Aceitar proposta"
            icon={<CheckOutlined />}
            color="cyan"
            variant="filled"
            onClick={() => handleAction("aceitar")}
          >
            Aceitar
          </Button>
        </Flex>
      }
    >
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Status">
              {tradeStatus[trade.status]}
            </Descriptions.Item>
            <Descriptions.Item label="Ofertante">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={trade.requester.avatarUrl}
                style={{ backgroundColor: "#ff8b2dff", color: "#fff" }}
              />
              <Text strong style={{ marginLeft: 8 }}>
                {trade.requester.name}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label="Destinatário">
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={trade.responder.avatarUrl}
                style={{ backgroundColor: "#2bb1ffff", color: "#fff" }}
              />
              <Text strong style={{ marginLeft: 8 }}>
                {trade.responder.name}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Data de criação">
              {new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(trade.createdAt))}
            </Descriptions.Item>
            <Descriptions.Item label="Última atualização">
              {new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(trade.updatedAt))}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={24}>
          <Row gutter={8} style={{ height: "180px" }}>
            <Col flex={1}>
              <Divider orientation="left">Item ofertado</Divider>
              <Card
                hoverable
                styles={{ body: { padding: "8px" } }}
                cover={
                  <Image
                    alt=""
                    src={offeredItems?.post?.imageUrl}
                    height={100}
                    style={{ objectFit: "cover" }}
                    preview={false}
                    fallback={FALLBACK_URL}
                  />
                }
              >
                <Text strong>
                  {offeredItems?.post?.title || "Produto não encontrado"}
                </Text>
              </Card>
            </Col>
            <Col span={1}>
              <Flex align="center" justify="center" style={{ height: "100%" }}>
                <SwapOutlined />
              </Flex>
            </Col>
            <Col flex={1}>
              <Divider orientation="right">Item de interesse</Divider>
              <Card
                hoverable
                styles={{ body: { padding: "8px" } }}
                cover={
                  <Image
                    alt=""
                    src={interestItems?.post?.imageUrl}
                    height={100}
                    style={{ objectFit: "cover" }}
                    preview={false}
                    fallback={FALLBACK_URL}
                  />
                }
              >
                <Text strong>
                  {interestItems?.post?.title || "Produto não encontrado"}
                </Text>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
