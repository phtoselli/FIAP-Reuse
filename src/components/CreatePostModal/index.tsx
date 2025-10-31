"use client";

import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { Categories } from "@/types/category";
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
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreatePostModal() {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState<
		{ label: string; value: string }[]
	>([]);

	const { isOpen, close } = useURLControlledModal(
		URLControlledModalKeys.CREATE_POST_MODAL
	);

	useEffect(() => {
		if (!isOpen) return;

		const catOptions = Object.entries(Categories).map(([key, value]) => ({
			label: value.namePT,
			value: key,
		}));
		setCategories(catOptions);

		form.resetFields();
	}, [isOpen]);

	const handleSave = async (values: any) => {
		try {
			setLoading(true);
			const user = getUser();
			if (!user) throw new Error("Usuário não está logado");

			const payload = {
				titulo: values.nome,
				descricao: values.descricao || "",
				categoriaId: values.categoria,
				subcategoriaId: "",
				condicaoId: values.condicao || "",
				usuarioId: user.id,
				imagemUrl: values.imagem,
				avaliacao: 0,
			};

			await axios.post("/api/produtos", payload);
			message.success("Produto criado com sucesso!");
			onCancel();
		} catch (error: any) {
			console.error(error);
			message.error(error.message || "Erro ao criar produto");
		} finally {
			setLoading(false);
		}
	};

	const onCancel = () => {
		form.resetFields();
		close();
	};

	return (
		<Modal
			centered
			title="Criar nova publicação"
			open={isOpen}
			onCancel={onCancel}
			footer={null}
			width={600}
		>
			{loading ? (
				<Spin tip="Salvando produto..." />
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

					<Form.Item label="Condição" name="condicao">
						<Select placeholder="Selecione">
							<Select.Option value="cond-1">Novo</Select.Option>
							<Select.Option value="cond-2">Seminovo</Select.Option>
							<Select.Option value="cond-3">Usado</Select.Option>
							<Select.Option value="cond-4">Para reparar</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="URL da Imagem"
						name="imagem"
						rules={[{ required: true, message: "Informe a URL da imagem" }]}
					>
						<Input
							placeholder="Cole a URL da imagem"
							prefix={<FileImageOutlined />}
						/>
					</Form.Item>

					<Divider />

					<Form.Item>
						<Button type="primary" block htmlType="submit">
							Criar publicação
						</Button>
					</Form.Item>
				</Form>
			)}
		</Modal>
	);
}
