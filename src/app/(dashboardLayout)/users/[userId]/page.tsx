/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button, Form, Image, Input, message, Upload } from "antd";
import { notFound } from "next/navigation";
import ContentLayout from "@/components/ContentLayout";
import { useEffect, useState } from "react";
import { getUser, setUser } from "@/utils/auth";
import { User } from "@prisma/client";

type Props = {
  params: {
    userId: string;
  };
};

export default function UserPage({ params }: Props) {
  const { userId } = params;

  const [form] = Form.useForm();
  const [formChanged, setFormChanged] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  console.log(userData);

  useEffect(() => {
    const storedUser = getUser();

    if (!storedUser || storedUser.id?.toString() !== userId.toString()) {
      notFound();
    } else {
      setUserData(storedUser);
      form.setFieldsValue(storedUser);
    }
  }, [userId, form]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      setUser({ ...userData, ...values });
      setUserData({ ...userData, ...values });

      message.success("Alterações salvas com sucesso!");
      setFormChanged(false);
    } catch {
      message.error("Verifique os campos do formulário.");
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <ContentLayout title="Meu perfil">
      <div style={{ display: "flex", gap: "16px", width: "100%" }}>
        <div>
          <Upload
            style={{ width: "300px", height: "300px" }}
            listType="picture-card"
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Você só pode enviar imagens!");
              }
              return isImage || Upload.LIST_IGNORE;
            }}
            customRequest={({ file, onSuccess }) => {
              const reader = new FileReader();
              reader.onload = () => {
                setUserData((prev: any) => ({
                  ...prev,
                  avatarUrl: reader.result as string,
                }));
                onSuccess?.("ok");
              };
              reader.readAsDataURL(file as Blob);
            }}
          >
            <Image
              src={userData.avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              width={300}
              height={300}
              preview={false}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
              }}
            />
          </Upload>
        </div>

        <div style={{ flex: "1" }}>
          <Form
            layout="vertical"
            form={form}
            onValuesChange={() => setFormChanged(true)}
          >
            <Form.Item label="Nome" name="nome" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "O e-mail é obrigatório" },
                { type: "email", message: "Digite um e-mail válido" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Bio" name="bio">
              <Input.TextArea rows={4} />
            </Form.Item>

            <Button type="primary" onClick={handleSave} disabled={!formChanged}>
              Salvar
            </Button>
          </Form>
        </div>
      </div>
    </ContentLayout>
  );
}
