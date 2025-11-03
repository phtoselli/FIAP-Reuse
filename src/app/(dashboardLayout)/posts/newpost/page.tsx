/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, message, Select, Upload } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ContentLayout from "@/components/ContentLayout";
import { getUserId } from "@/utils/auth";
import { categoriesOptions } from "@/utils/categories";
import { conditionOptions } from "@/utils/conditions";
import { useProductStore } from "../store";

export default function NewPost() {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);

	const router = useRouter();
	const userId = getUserId();

	const { getAllProducts } = useProductStore();

	const handleSubmit = async (values: any) => {
		try {
			setLoading(true);

			const formData = new FormData();
			formData.append("title", values.title);
			formData.append("description", values.description || "");
			formData.append("categoryId", values.categoryId);
			formData.append("conditionId", values.conditionId || "");
			formData.append("userId", userId);
			formData.append("rating", "0");
			formData.append("image", values.image[0].originFileObj);

			await axios.post("/api/produtos", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			message.success("Produto criado com sucesso!");
			form.resetFields();

			await getAllProducts();
			router.replace("/posts/my");
		} catch (err: any) {
			console.error(err.response?.data || err);
			message.error("Erro ao criar produto. Tente novamente.");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
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
						name="title"
						rules={[{ required: true, message: "Informe o nome do produto" }]}
					>
						<Input placeholder="Nome do Produto (ex: Tênis All Star)" />
					</Form.Item>

					<Form.Item
						label="Categoria"
						name="categoryId"
						rules={[{ required: true, message: "Selecione a categoria" }]}
					>
						<Select
							placeholder="Selecione uma categoria"
							options={categoriesOptions}
						/>
					</Form.Item>

					<Form.Item
						label="Estado de Conservação"
						name="conditionId"
						rules={[
							{ required: true, message: "Selecione um estado de conservação" },
						]}
					>
						<Select
							placeholder="Selecione um estado de conservação"
							options={conditionOptions}
						/>
					</Form.Item>

					<Form.Item label="Descrição de Produto" name="description">
						<Input.TextArea
							rows={4}
							placeholder="Ex: Tênis All Star número 35, em bom estado..."
						/>
					</Form.Item>

					<Form.Item
						label="Imagem"
						name="image"
						valuePropName="fileList"
						getValueFromEvent={(e) => e.fileList}
						rules={[{ required: true, message: "Envie uma imagem" }]}
					>
						<Upload
							listType="picture-card"
							maxCount={1}
							accept="image/*"
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
