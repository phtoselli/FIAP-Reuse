/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Card, Input, Button, Space, Form, List, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

import Text from "antd/es/typography/Text";
import axios from "axios";

interface FormData {
  message?: string;
}

export default function TradeChat({ tradeId }: { tradeId: string }) {
  const [form] = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = (formValues: FormData) => {
    console.log(formValues.message);
    form.resetFields();
  };

  const fetchTrade = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/propostas/${tradeId}`);
      setMessages([data.message]);
    } catch (err: any) {
      message.error(err.response?.data?.error || "Erro ao carregar proposta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrade();
  }, []);

  return (
    <Card
      title="Chat da Troca"
      style={{ height: "400px" }}
      styles={{ body: { height: "310px" }, actions: { padding: "2px 8px" } }}
      actions={[
        <Form form={form} key="messageform" onFinish={sendMessage}>
          <Space.Compact style={{ width: "100%" }}>
            <Form.Item
              name="message"
              style={{ width: "100%", padding: 0, margin: 0 }}
            >
              <Input placeholder="Digite sua mensagem aqui..." />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              title="Enviar mensagem"
              icon={<SendOutlined />}
              style={{ width: "50px", padding: 0, margin: 0 }}
            />
          </Space.Compact>
        </Form>,
      ]}
    >
      <List
        loading={loading}
        dataSource={messages}
        renderItem={(msg, index) => (
          <List.Item key={index}>
            <Card
              size="small"
              style={{ width: "100%", background: "#f5f5f5", borderRadius: 8 }}
              styles={{ body: { padding: "8px" } }}
            >
              <Text strong>Usuário:</Text> <Text>{msg}</Text>
            </Card>
          </List.Item>
        )}
        style={{ flex: 1, overflowY: "auto", marginBottom: 16 }}
      />
    </Card>
  );
}
