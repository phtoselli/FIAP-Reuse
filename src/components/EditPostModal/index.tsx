/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { Categories } from "@/types/category";
import { Product } from "@/types/product";
import { getUser } from "@/utils/auth";
import { FileImageOutlined } from "@ant-design/icons";
import {
	Button,
	Divider,
	Form,
	Input,
	message,
	Modal,
	Select,
	Spin,
} from "antd";
import { useEffect, useState } from "react";

export default function EditPostModal() {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [product, setProduct] = useState<Product | null>(null);
	const [categories, setCategories] = useState<
		{ label: string; value: string }[]
	>([]);

	const { isOpen, close, paramValue } = useURLControlledModal(
		URLControlledModalKeys.EDIT_POST_MODAL
	);

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
					nome: data.nome,
					descricao: data.descricao,
					categoria: data.categoria?.id || null,
				});

				// Aqui pegamos os labels em PT
				const catOptions = Object.entries(Categories).map(([key, value]) => ({
					label: value.namePT,
					value: key,
				}));
				setCategories(catOptions);
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
					...values,
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Erro ao atualizar produto");

			message.success("Produto atualizado com sucesso!");
			onCancel();
		} catch (error: any) {
			message.error(error.message || "Erro ao atualizar produto");
		} finally {
			setLoading(false);
		}
	};

	const onCancel = () => {
		form.resetFields();
		setProduct(null);
		close();
	};

	return (
		<Modal
			centered
			title="Editar produto"
			open={isOpen}
			onCancel={onCancel}
			footer={null}
			width={600}
		>
			{loading || !product ? (
				<Spin tip="Carregando produto..." />
			) : (
				<Form form={form} layout="vertical" onFinish={handleSave}>
					<Form.Item
						label="Nome"
						name="nome"
						rules={[{ required: true, message: "O nome é obrigatório" }]}
					>
						<Input placeholder="Nome do produto" />
					</Form.Item>

					<Form.Item
						label="Descrição"
						name="descricao"
						rules={[{ required: true, message: "A descrição é obrigatória" }]}
					>
						<Input.TextArea rows={4} placeholder="Descrição do produto" />
					</Form.Item>

					<Form.Item
						label="Categoria"
						name="categoria"
						rules={[{ required: true, message: "A categoria é obrigatória" }]}
					>
						<Select placeholder="Selecione a categoria" options={categories} />
					</Form.Item>

					<Form.Item
						label="URL da Imagem"
						name="imagem"
						rules={[{ required: false }]}
					>
						<Input
							placeholder="Cole a URL da imagem"
							prefix={<FileImageOutlined />}
						/>
					</Form.Item>

					<Divider />

					<Form.Item>
						<Button type="primary" block htmlType="submit">
							Salvar alterações
						</Button>
					</Form.Item>
				</Form>
			)}
		</Modal>
	);
}
