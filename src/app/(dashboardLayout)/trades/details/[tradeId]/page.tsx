"use client";

import { useParams } from "next/navigation";
import { Flex, Typography, Button } from "antd";
import { useState } from "react";
import TradeChat from "./tabs/TradeChat";
import TradeInfo from "./tabs/TradeInfo";
import BreadcrumbRoute from "@/components/BreadcrumbRoute";

const { Title } = Typography;

export default function TradeDetailsPage() {
  const { tradeId } = useParams();
  const [selectedKey, setSelectedKey] = useState<"details" | "chat">("details");

  const renderContent = () => {
    switch (selectedKey) {
      case "chat":
        return <TradeChat tradeId={tradeId} />;
      case "details":
      default:
        return <TradeInfo tradeId={tradeId} responderId="user-456" />;
    }
  };

  return (
    <Flex vertical gap={24} style={{ width: "100%" }}>
      {/* Breadcrumb */}
      <BreadcrumbRoute />

      {/* Header */}
      <Title level={2} style={{ color: "#2A4BA0", margin: 0 }}>
        Proposta Recebida
      </Title>

      {/* Barra de navegação entre Detalhe e Chat */}
      <Flex
        gap={16}
        align="center"
        style={{
          marginBottom: 16,
          borderBottom: "2px solid #eee",
          paddingBottom: 8,
        }}
      >
        <Button
          type="text"
          style={{
            fontWeight: selectedKey === "details" ? "bold" : "normal",
            color: selectedKey === "details" ? "#2A4BA0" : "inherit",
          }}
          onClick={() => setSelectedKey("details")}
        >
          Detalhe
        </Button>

        <Button
          type="text"
          style={{
            fontWeight: selectedKey === "chat" ? "bold" : "normal",
            color: selectedKey === "chat" ? "#2A4BA0" : "inherit",
          }}
          onClick={() => setSelectedKey("chat")}
        >
          Chat
        </Button>
      </Flex>

      {/* Conteúdo dinâmico */}
      <div style={{ flex: 1, width: "100%" }}>{renderContent()}</div>
    </Flex>
  );
}
