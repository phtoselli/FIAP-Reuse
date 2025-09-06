"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Adicionar para navegação
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Card,
  Typography,
  Flex,
} from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

import ContentLayout from "@/components/ContentLayout"; // Importar o ContentLayout

const { Title } = Typography;
const { Option } = Select;

export default function NewPost() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const router = useRouter(); // Para navegação de volta

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      // simulação: pega a URL fake da imagem
      const url = URL.createObjectURL(info.file.originFileObj);
      setImageUrl(url);
      message.success("Imagem enviada com sucesso!");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const payload = {
        titulo: values.titulo,
        descricao: values.descricao,
        imagemUrl: imageUrl || "", // aqui poderia ser um upload real para S3, Cloudinary etc.
        categoriaId: values.categoriaId,
        subcategoriaId: values.subcategoriaId,
        condicaoId: values.condicaoId,
        usuarioId: "user-123", // 🔥 pegar do contexto de autenticação
        avaliacao: 0,
      };

      await axios.post("/api/produtos", payload);

      message.success("Produto criado com sucesso!");
      form.resetFields();
      setImageUrl(null);

      // Redirecionar de volta para a lista de produtos após sucesso
      setTimeout(() => {
        router.push("/my-posts"); // Ajuste a rota conforme necessário
      }, 1500);
    } catch (err) {
      console.error(err);
      message.error("Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageUrl(null);
    router.push("/posts/my"); // Navegar de volta para a lista
  };

  return (
    <ContentLayout
      title="Criar Nova Publicação"
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/posts/my")} // Botão para voltar
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

          <Flex gap={16}>
            <Form.Item
              label="Categoria"
              name="categoriaId"
              rules={[{ required: true, message: "Selecione a categoria" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Selecione">
                <Option value="ROUPAS">Roupas</Option>
                <Option value="CASA">Casa</Option>
                <Option value="CALÇADOS">Calçados</Option>
                <Option value="ACESSÓRIOS">Calçados</Option>
                <Option value="COSMÉTICOS">Calçados</Option>
                <Option value="OUTROS">Calçados</Option>
              </Select>
            </Form.Item>

            {/* <Form.Item
              label="Subcategoria"
              name="subcategoriaId"
              rules={[{ required: true, message: "Selecione a subcategoria" }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="Selecione">
                <Option value="sub-111">Camisetas</Option>
                <Option value="sub-222">Sofás</Option>
                <Option value="sub-333">Tênis</Option>
              </Select>
            </Form.Item> */}
          </Flex>

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
              beforeUpload={() => false} // não envia automaticamente
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
