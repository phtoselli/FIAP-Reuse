"use client";

import React from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useModalController } from "@/hooks/useModalController";

const { Option } = Select;
const { TextArea } = Input;

export default function CreatePostModal() {
  const [form] = Form.useForm();

  const { isOpen, close } = useModalController("createPost");

  const handleFinish = (values: Record<string, string>) => {
    console.log("Form Values:", values);
    message.success("Publicação criada com sucesso!");
    form.resetFields();
    close();
  };

  return (
    <Modal
      centered
      title="Criar nova publicação"
      open={isOpen}
      onCancel={close}
      onOk={() => form.submit()}
      okText="Publicar"
      cancelText="Cancelar"
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="nome"
          label="Nome do produto"
          rules={[{ required: true, message: "Informe o nome do produto" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="categoria"
          label="Categoria do produto"
          rules={[{ required: true, message: "Selecione a categoria" }]}
        >
          <Select placeholder="Selecione uma categoria">
            <Option value="roupas">Roupas</Option>
            <Option value="casa">Casa</Option>
            <Option value="cosmeticos">Cosméticos</Option>
            <Option value="calcados">Calçados</Option>
            <Option value="acessorios">Acessórios</Option>
            <Option value="outros">Outros</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="subcategoria"
          label="Sub-Categoria"
          rules={[{ required: true, message: "Selecione a subcategoria" }]}
        >
          <Select placeholder="Selecione uma subcategoria">
            <Option value="sub1">Subcategoria 1</Option>
            <Option value="sub2">Subcategoria 2</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="estado"
          label="Estado de conservação"
          rules={[
            { required: true, message: "Informe o estado de conservação" },
          ]}
        >
          <Select placeholder="Selecione o estado">
            <Option value="novo">Novo</Option>
            <Option value="usado_bom">Usado - Bom estado</Option>
            <Option value="usado_uso">Usado - Sinais de uso</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="descricao"
          label="Descrição do produto"
          rules={[{ required: true, message: "Adicione uma descrição" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="fotos"
          label="Fotos do produto"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload listType="picture" beforeUpload={() => false} multiple>
            <Button icon={<UploadOutlined />}>Adicionar fotos</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
