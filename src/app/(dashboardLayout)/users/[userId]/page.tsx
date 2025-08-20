"use client";

import { Button, Divider, Form, Input, Typography, message } from "antd";
import { notFound, useRouter } from "next/navigation";
import ContentLayout from "@/components/ContentLayout";
import { useEffect, useRef, useState } from "react";

type Props = {
  params: {
    userId: string;
  };
};

export default function UserPage({ params }: Props) {
  const { userId } = params;

  const users = ["123", "maria", "ana"];
  const userExists = users.includes(userId.toLowerCase());

  if (!userExists) {
    notFound();
  }

  const initialUserData = {
    name: "João Silva",
    email: "joao@email.com",
    bio: "Apaixonado por trocas sustentáveis.",
  };

  const [form] = Form.useForm();
  const [formChanged, setFormChanged] = useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      message.success("Alterações salvas com sucesso!");
      setFormChanged(false);
    } catch {
      message.error("Verifique os campos do formulário.");
    }
  };

  return (
    <ContentLayout title="Meu perfil">
      <Form
        layout="vertical"
        form={form}
        initialValues={initialUserData}
        onValuesChange={() => setFormChanged(true)}
      >
        <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Bio" name="bio">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Button type="primary" onClick={handleSave} disabled={!formChanged}>
          Salvar
        </Button>
      </Form>
    </ContentLayout>
  );
}
