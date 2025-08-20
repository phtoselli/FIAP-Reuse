"use client";

import {
  Card,
  Descriptions,
  Divider,
  Flex,
  Image,
  Tag,
  Typography,
  Button,
  Tooltip,
} from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import getStatusColor from "@/lib/utils/getStatusColor";
import { TradeStatus } from "@/types/status";

const { Title } = Typography;

export default function TradeInfo({ tradeId }: { tradeId: string | string[] }) {
  const trade = {
    id: tradeId,
    status: "pendente",
    data: "2025-08-01",
    requester: {
      name: "João",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      items: [
        {
          id: 1,
          title: "Camisa",
          image: "https://picsum.photos/200?random=1",
        },
      ],
    },
    responder: {
      name: "Maria",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      items: [
        {
          id: 2,
          title: "Tênis",
          image: "https://picsum.photos/200?random=2",
        },
      ],
    },
  };

  return (
    <>
      <Flex align="center" justify="space-between">
        <Title level={3}>Detalhes da Troca</Title>
        <Tag color={getStatusColor(trade.status as TradeStatus)}>
          {trade.status.toUpperCase()}
        </Tag>
      </Flex>

      <Divider />

      <Descriptions
        bordered
        column={1}
        labelStyle={{ fontWeight: "bold", width: 180 }}
      >
        <Descriptions.Item label="Código da Troca">
          #{trade.id}
        </Descriptions.Item>
        <Descriptions.Item label="Data">
          {new Date(trade.data).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={getStatusColor(trade.status as TradeStatus)}>
            {trade.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <Flex align="center" justify="space-between" style={{ marginBottom: 32 }}>
        <Flex vertical align="center" gap={16}>
          <Image
            src={trade.requester.avatar}
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Title level={5}>{trade.requester.name}</Title>
        </Flex>

        <ArrowRightOutlined style={{ fontSize: 32 }} />

        <Flex vertical align="center" gap={16}>
          <Image
            src={trade.responder.avatar}
            width={100}
            height={100}
            style={{ borderRadius: "50%" }}
          />
          <Title level={5}>{trade.responder.name}</Title>
        </Flex>
      </Flex>

      <Flex gap={32}>
        <Card
          title={`Itens de ${trade.requester.name}`}
          style={{ flex: 1 }}
          bordered
        >
          {trade.requester.items.map((item) => (
            <Flex
              key={item.id}
              align="center"
              gap={16}
              style={{ marginBottom: 16 }}
            >
              <Image
                src={item.image}
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <div>{item.title}</div>
            </Flex>
          ))}
        </Card>

        <Card
          title={`Itens de ${trade.responder.name}`}
          style={{ flex: 1 }}
          bordered
        >
          {trade.responder.items.map((item) => (
            <Flex
              key={item.id}
              align="center"
              gap={16}
              style={{ marginBottom: 16 }}
            >
              <Image
                src={item.image}
                width={80}
                height={80}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <div>{item.title}</div>
            </Flex>
          ))}
        </Card>
      </Flex>

      <Divider />

      <Flex gap={16} style={{ marginTop: 24 }}>
        <Tooltip title="Aceitar esta troca">
          <Button type="primary" disabled={trade.status !== "pendente"}>
            Aceitar
          </Button>
        </Tooltip>
        <Tooltip title="Recusar esta troca">
          <Button danger disabled={trade.status !== "pendente"}>
            Recusar
          </Button>
        </Tooltip>
      </Flex>
    </>
  );
}
