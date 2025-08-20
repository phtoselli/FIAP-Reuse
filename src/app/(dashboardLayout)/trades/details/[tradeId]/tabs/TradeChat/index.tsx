"use client";

import { Card, Input, List, Typography, Flex, Button } from "antd";
import { useState } from "react";

const { Title } = Typography;
const { TextArea } = Input;

export default function TradeChat({ tradeId }: { tradeId: string | string[] }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, input.trim()]);
    setInput("");
  };

  return (
    <Card title="Chat da Troca" style={{ height: "100%" }}>
      <List
        size="small"
        dataSource={messages}
        style={{ maxHeight: 300, overflowY: "auto", marginBottom: 16 }}
        renderItem={(msg, index) => <List.Item key={index}>{msg}</List.Item>}
        locale={{ emptyText: "Nenhuma mensagem ainda." }}
      />

      <Flex gap={8}>
        <TextArea
          placeholder="Digite uma mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
        <Button type="primary" onClick={sendMessage}>
          Enviar
        </Button>
      </Flex>
    </Card>
  );
}
