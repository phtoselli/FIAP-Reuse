/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useProductStore } from "@/app/(dashboardLayout)/posts/store";
import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { Product } from "@/types/product";
import { getUser } from "@/utils/auth";
import { categoriesOptions } from "@/utils/categories";
import { conditionOptions } from "@/utils/conditions";
import { UploadOutlined } from "@ant-design/icons";
import {
	Button,
	Divider,
	Form,
	Input,
	message,
	Modal,
	Select,
	Spin,
	Upload,
} from "antd";
import { useEffect, useState } from "react";

export default function EditPostModal() {
	const [form] = Form.useForm();

	const [loading, setLoading] = useState(false);
	const [product, setProduct] = useState<Product | null>(null);
	const [fileBase64, setFileBase64] = useState<string | null>(null);

	const { getAllProducts } = useProductStore();

	const { isOpen, close, paramValue } = useURLControlledModal(
		URLControlledModalKeys.EDIT_POST_MODAL
	);

	const getBase64 = (file: File): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});

	const onCancel = () => {
		form.resetFields();
		setProduct(null);
		close();
	};

	const handleSave = async (values: any) => {
		if (!product) return;
		setLoading(true);

		try {
			const user = getUser();
			if (!user) throw new Error("Usuário não está logado");

			const res = await fetch(`/api/produtos/${product.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: values.name || "Nome do produto",
					description: values.description || "Descrição do produto",
					categoryId: values.categoryId || "1",
					conditionId: values.conditionId || "1",
					image: fileBase64 || product.image || "",
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Erro ao atualizar produto");

			message.success("Produto atualizado com sucesso!");
			setLoading(false);

			await getAllProducts();

			onCancel();
		} catch (error: any) {
			message.error(error.message || "Erro ao atualizar produto");
		}
	};

	useEffect(() => {
		if (!isOpen || !paramValue) return;
		let isMounted = true;

		const fetchProduct = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/produtos/${paramValue}`);
				if (!res.ok) throw new Error("Produto não encontrado");
				const data: Product = await res.json();
				if (!isMounted) return;
				setProduct(data);

				form.setFieldsValue({
					name: data.name,
					description: data.description,
					categoryId: data.category?.id || "1",
					conditionId: data.condition?.id || "1",
				});
			} catch (error: any) {
				message.error(error.message || "Erro ao carregar produto");
				close();
			} finally {
				if (isMounted) setLoading(false);
			}
		};

		fetchProduct();

		return () => {
			isMounted = false;
		};
	}, [isOpen, paramValue]);

	return (
		<Modal
			centered
			title="Editar produto"
			open={isOpen}
			onCancel={onCancel}
			footer={null}
			width={600}
		>
			<Spin spinning={loading} tip="Carregando dados do produto...">
				<Form form={form} layout="vertical" onFinish={handleSave}>
					<Form.Item
						label="Nome"
						name="name"
						rules={[{ required: true, message: "O nome é obrigatório" }]}
					>
						<Input placeholder="Nome do produto" />
					</Form.Item>

					<Form.Item
						label="Descrição"
						name="description"
						rules={[{ required: true, message: "A descrição é obrigatória" }]}
					>
						<Input.TextArea rows={4} placeholder="Descrição do produto" />
					</Form.Item>

					<Form.Item
						label="Categoria"
						name="categoryId"
						rules={[{ required: true, message: "A categoria é obrigatória" }]}
					>
						<Select
							placeholder="Selecione uma categoria"
							options={categoriesOptions}
						/>
					</Form.Item>

					<Form.Item
						label="Condição"
						name="conditionId"
						rules={[
							{
								required: true,
								message: "O estado de conservação é obrigatório",
							},
						]}
					>
						<Select
							placeholder="Selecione um estado de conservação"
							options={conditionOptions}
						/>
					</Form.Item>

					<Form.Item label="Imagem">
						<Upload
							accept="image/*"
							beforeUpload={async (file) => {
								const base64 = await getBase64(file);
								setFileBase64(base64);
								return false;
							}}
							showUploadList={!!fileBase64}
						>
							<Button icon={<UploadOutlined />}>Selecionar imagem</Button>
						</Upload>
					</Form.Item>

					<Divider />

					<Form.Item>
						<Button type="primary" block htmlType="submit">
							Editar produto
						</Button>
					</Form.Item>
				</Form>
			</Spin>
		</Modal>
	);
}
