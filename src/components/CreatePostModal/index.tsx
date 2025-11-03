import { useProductStore } from "@/app/(dashboardLayout)/posts/store";
import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
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
import axios from "axios";
import { useEffect, useState } from "react";

export default function CreatePostModal() {
	const [form] = Form.useForm();

	const { getAllProducts } = useProductStore();

	const [loading, setLoading] = useState(false);
	const [fileBase64, setFileBase64] = useState<string | null>(null);

	const { isOpen, close } = useURLControlledModal(
		URLControlledModalKeys.CREATE_POST_MODAL
	);

	const handleSave = async (values: any) => {
		try {
			setLoading(true);
			const user = getUser();
			if (!user) throw new Error("Usuário não está logado");

			const payload = {
				title: values.name,
				description: values.description,
				categoryId: values.categoryId,
				conditionId: values.conditionId,
				userId: user.id,
				rating: 0,
				image: fileBase64,
			};

			await axios.post("/api/produtos", payload);

			message.success("Publicação criada com sucesso!");
			await getAllProducts();
			onCancel();
		} catch (error: any) {
			console.error("Erro ao criar publicação:", error);
			message.error(error.response?.data?.error || "Erro ao criar publicação");
		} finally {
			setLoading(false);
		}
	};

	const onCancel = () => {
		form.resetFields();
		setFileBase64(null);
		close();
	};

	useEffect(() => {
		if (!isOpen) return;

		form.resetFields();
		setFileBase64(null);
	}, [isOpen]);

	const getBase64 = (file: File): Promise<string> =>
		new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});

	return (
		<Modal
			centered
			title="Criar nova publicação"
			open={isOpen}
			onCancel={onCancel}
			footer={null}
			width={600}
		>
			<Spin spinning={loading} tip="Salvando produto...">
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
							Criar publicação
						</Button>
					</Form.Item>
				</Form>
			</Spin>
		</Modal>
	);
}
