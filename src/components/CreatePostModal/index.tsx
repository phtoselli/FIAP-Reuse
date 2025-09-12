/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Flex,
  message,
  Modal,
  Row,
  Col,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { getUser } from "@/utils/auth";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import Text from "antd/es/typography/Text";
import useTypeService from "@/hooks/useTypeService";
import { Types } from "@/types/type";

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

export default function CreatePostModal() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [renderUploadField, setRenderUploadField] = useState(false);

  const user = getUser();

  const { isOpen, close } = useURLControlledModal(
    URLControlledModalKeys.CREATE_POST_MODAL
  );

  const {
    get: getCategories,
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useTypeService();

  const {
    get: getConditions,
    data: conditionsData,
    isLoading: isConditionsLoading,
  } = useTypeService();

  const categoryOptions = useMemo(
    () => categoriesData?.map((c) => ({ value: c.id, label: c.title })) ?? [],
    [categoriesData]
  );

  const conditionOptions = useMemo(
    () => conditionsData?.map((c) => ({ value: c.id, label: c.title })) ?? [],
    [conditionsData]
  );

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
      formData.append("imagem", values.originFileObj);

      await axios.post("/api/produtos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success("Produto criado com sucesso!");
      form.resetFields();
      close();
    } catch (err: any) {
      console.error(err.response?.data || err);
      message.error("Erro ao criar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    close();
  };

  const onFormChange = (changedValues: { [key: string]: string }) => {
    if ("imagem" in changedValues) {
      setRenderUploadField(!renderUploadField);
    }
  };

  useEffect(() => {
    getCategories({ type: Types.CATEGORYTYPE });
    getConditions({ type: Types.CONDITIONTYPE });
  }, []);

  return (
    <Modal
      centered
      open={isOpen}
      destroyOnHidden
      title="Criar Nova Publicação"
      okText="Criar publicação"
      cancelText="Cancelar"
      onCancel={handleCancel}
      onOk={() => form.submit()}
      okButtonProps={{ loading: loading }}
      styles={{ body: { marginTop: "16px" } }}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
        onValuesChange={(changedValues) => onFormChange(changedValues)}
      >
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Form.Item
              label="Imagem do Produto"
              name="imagem"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              rules={[{ required: true, message: "Envie ao menos 1 imagem" }]}
            >
              <Upload
                maxCount={1}
                multiple={false}
                listType="picture-card"
                beforeUpload={() => false}
                style={{ width: "100%", height: "240px" }}
                itemRender={(originNode) => (
                  <div style={{ width: "375px", height: "240px" }}>
                    {originNode}
                  </div>
                )}
              >
                {renderUploadField ? null : (
                  <Flex
                    align="center"
                    justify="center"
                    vertical
                    gap={8}
                    style={{ width: "375px", height: "240px" }}
                  >
                    <PlusOutlined />
                    <Text>Adicionar imagem</Text>
                  </Flex>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Row gutter={[8, 8]}>
              <Col span={24}>
                <Form.Item
                  label="Produto"
                  name="titulo"
                  rules={[{ required: true, message: "" }]}
                >
                  <Input placeholder="Nome do Produto (ex: Tênis All Star)" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Categoria"
                  name="categoriaId"
                  rules={[{ required: true, message: "" }]}
                >
                  <Select
                    placeholder="Selecione"
                    options={categoryOptions}
                    loading={isCategoriesLoading}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Estado de Conservação" name="condicaoId">
                  <Select
                    placeholder="Selecione"
                    options={conditionOptions}
                    loading={isConditionsLoading}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Descrição de Produto" name="descricao">
                  <Input.TextArea
                    rows={4}
                    placeholder="Ex: Tênis All Star número 35, em bom estado..."
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
