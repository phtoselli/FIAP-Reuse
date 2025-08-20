"use client";

import { useParams } from "next/navigation";
import { Flex, Menu, Typography, Divider } from "antd";
import { MessageOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import TradeChat from "./tabs/TradeChat";
import TradeInfo from "./tabs/TradeInfo";
import BreadcrumbRoute from "@/components/BreadcrumbRoute";

const { Title } = Typography;

export default function TradeDetailsPage() {
  const { tradeId } = useParams();
  const [selectedKey, setSelectedKey] = useState("details");

  const renderContent = () => {
    switch (selectedKey) {
      case "chat":
        return <TradeChat tradeId={tradeId} />;
      case "details":
      default:
        return <TradeInfo tradeId={tradeId} />;
    }
  };

  return (
    <Flex style={{ height: "100%", minHeight: "80vh" }}>
      <BreadcrumbRoute />

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={({ key }) => setSelectedKey(key)}
        style={{ width: 250, paddingTop: 24 }}
        items={[
          {
            key: "details",
            icon: <InfoCircleOutlined />,
            label: "Detalhes da troca",
          },
          {
            key: "chat",
            icon: <MessageOutlined />,
            label: "Chat",
          },
        ]}
      />

      <Divider type="vertical" style={{ height: "auto", margin: "0 24px" }} />

      <div style={{ flex: 1, padding: 24 }}>
        <Title level={4}>Troca #{tradeId}</Title>
        {renderContent()}
      </div>
    </Flex>
  );
}
