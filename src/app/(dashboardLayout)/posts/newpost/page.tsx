/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Select, Upload, Button, message, Card, Flex } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

import ContentLayout from "@/components/ContentLayout";
import { getUser } from "@/utils/auth";

export enum CategoryCode {
  CLOTHING = "ROUPAS",
  HOUSE = "CASA",
  FOOTWEAR = "CALÇADOS",
  ACCESSORIES = "ACESSÓRIOS",
  COSMETICS = "COSMÉTICOS",
  OTHERS = "OUTROS",
}

export enum CategoryDescription {
  CLOTHING = "ROUPAS",
  HOUSE = "CASA",
  FOOTWEAR = "CALÇADOS",
  ACCESSORIES = "ACESSÓRIOS",
  COSMETICS = "COSMÉTICOS",
  OTHERS = "OUTROS",
}

const { Option } = Select;
const user = getUser();

export default function NewPost() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const router = useRouter();

  const handleUpload = (info: any) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const url = URL.createObjectURL(info.file.originFileObj);
      setImageUrl(url);
      message.success("Imagem selecionada!");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        titulo: values.titulo,
        descricao: values.descricao || "",
        imagemUrl: imageUrl || "",
        categoriaId: values.categoriaId,
        subcategoriaId: " ",
        condicaoId: values.condicaoId || null,
        usuarioId: user.id, // futuramente do contexto de auth
        avaliacao: 0,
      };

      await axios.post("/api/produtos", payload, {
        headers: { "Content-Type": "application/json" },
      });

      message.success("Produto criado com sucesso!");
      form.resetFields();
      setImageUrl(null);

      setTimeout(() => {
        router.push("/posts/my");
      }, 1500);
    } catch (err: any) {
      console.error(err.response?.data || err);
      message.error("Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl(null);
    router.push("/posts/my");
  };

  return (
    <ContentLayout
      title="Criar Nova Publicação"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/posts/my")}
        >
          Voltar
        </Button>
      }
    >
      <Card
        style={{
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Produto"
            name="titulo"
            rules={[{ required: true, message: "Informe o nome do produto" }]}
          >
            <Input placeholder="Nome do Produto (ex: Tênis All Star)" />
          </Form.Item>

          <Form.Item
            label="Categoria"
            name="categoriaId"
            rules={[{ required: true, message: "Selecione a categoria" }]}
          >
            <Select placeholder="Selecione">
              {Object.entries(CategoryCode).map(([key, value]) => (
                <Option key={key} value={value}>
                  {CategoryDescription[key as keyof typeof CategoryDescription]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Estado de Conservação" name="condicaoId">
            <Select placeholder="Selecione">
              <Option value="cond-1">Novo</Option>
              <Option value="cond-2">Seminovo</Option>
              <Option value="cond-3">Usado</Option>
              <Option value="cond-4">Para reparar</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Descrição de Produto" name="descricao">
            <Input.TextArea
              rows={4}
              placeholder="Ex: Tênis All Star número 35, em bom estado de conservação..."
            />
          </Form.Item>

          <Form.Item label="Imagens">
            <Upload
              listType="picture-card"
              maxCount={3}
              onChange={handleUpload}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Adicionar</div>
              </div>
            </Upload>
          </Form.Item>

          <Flex justify="flex-end" gap={16}>
            <Button htmlType="button" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Salvar
            </Button>
          </Flex>
        </Form>
      </Card>
    </ContentLayout>
  );
}
