/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Flex,
  message,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { getUser } from "@/utils/auth";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";

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

export default function CreatePostModal() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { isOpen: isOpenCreatePostModal, close: closeCreatePostModal } =
    useURLControlledModal(URLControlledModalKeys.CREATE_POST_MODAL);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("titulo", values.titulo);
      formData.append("descricao", values.descricao || "");
      formData.append("categoriaId", values.categoriaId);
      formData.append("subcategoriaId", " ");
      formData.append("condicaoId", values.condicaoId || "");
      formData.append("usuarioId", user.id);
      formData.append("avaliacao", "0");

      if (values.imagens && values.imagens.length > 0) {
        values.imagens.forEach((file: any) => {
          formData.append("imagens", file.originFileObj);
        });
      }

      await axios.post("/api/produtos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Produto criado com sucesso!");
      form.resetFields();
      closeCreatePostModal();
    } catch (err: any) {
      console.error(err.response?.data || err);
      message.error("Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    closeCreatePostModal();
  };

  return (
    <Modal
      destroyOnHidden
      open={isOpenCreatePostModal}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okText="Criar publicação"
      cancelText="Cancelar"
      okButtonProps={{ loading: loading }}
      title="Criar Nova Publicação"
      width={700}
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
            placeholder="Ex: Tênis All Star número 35, em bom estado..."
          />
        </Form.Item>

        <Form.Item
          label="Imagens"
          name="imagens"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
          rules={[{ required: true, message: "Envie ao menos 1 imagem" }]}
        >
          <Upload
            listType="picture-card"
            maxCount={3}
            beforeUpload={() => false}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Adicionar</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
