"use client";

import ContentLayout from "@/components/ContentLayout";
import { getUser, setUser } from "@/utils/auth";
import { getBase64 } from "@/utils/getBase64";
import { UploadOutlined } from "@ant-design/icons";
import { User } from "@prisma/client";
import {
	Button,
	Card,
	Col,
	Empty,
	Form,
	Image,
	Input,
	message,
	Row,
	Space,
	Spin,
	Typography,
	Upload,
} from "antd";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function UserPage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = React.use(params);
	const [form] = Form.useForm();

	const [userData, setUserData] = useState<User | null>(null);
	const [fileBase64, setFileBase64] = useState<string | null>(null);
	const [formChanged, setFormChanged] = useState(false);
	const [loading, setLoading] = useState(true);

	const handleSave = async () => {
		try {
			const values = await form.validateFields();

			setLoading(true);
			const response = await fetch(`/api/usuarios/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...values,
					avatarUrl: fileBase64 || userData?.avatarUrl || null,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Erro ao atualizar usuário");
			}

			const updatedUser = await response.json();

			setUser(updatedUser);
			setUserData(updatedUser);
			form.setFieldsValue(updatedUser);
			setFormChanged(false);
			message.success("Informações atualizadas com sucesso!");
		} catch (error: any) {
			console.error("Erro ao salvar alterações:", error);
			message.error(error.message || "Erro ao salvar alterações.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const storedUser = getUser();
		if (!storedUser || storedUser.id?.toString() !== userId.toString()) {
			notFound();
			return;
		}

		setUserData(storedUser);
		form.setFieldsValue(storedUser);
		setLoading(false);
	}, [userId, form]);

	console.log(userData);

	return (
		<ContentLayout title="Meu Perfil">
			{!userData && !loading && (
				<Empty
					description="Dados não encontrados"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			)}

			<Spin tip="Carregando dados do usuário..." spinning={loading}>
				<Card
					style={{
						maxWidth: 900,
						margin: "0 auto",
						borderRadius: 12,
						boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
					}}
					styles={{ body: { padding: "32px" } }}
				>
					<Row gutter={[32, 32]} align="top">
						<Col xs={24} md={8}>
							<Card>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										textAlign: "center",
										gap: 16,
									}}
								>
									<Image
										src={
											fileBase64 ||
											userData?.avatarUrl ||
											`https://randomuser.me/api/portraits/men/${
												Math.floor(Math.random() * 60) + 1
											}.jpg`
										}
										alt="Avatar"
										width={180}
										height={180}
										preview={false}
										style={{
											borderRadius: "50%",
											objectFit: "cover",
											marginBottom: 16,
											boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
										}}
									/>
									<div>
										<Title level={4} style={{ marginBottom: 0 }}>
											{userData?.nome || "Usuário"}
										</Title>
										<Text type="secondary">{userData?.email}</Text>
									</div>
								</div>
							</Card>
						</Col>

						<Col xs={24} md={16}>
							<Form
								layout="vertical"
								form={form}
								onValuesChange={() => setFormChanged(true)}
								autoComplete="off"
							>
								<Title level={5}>Informações Pessoais</Title>

								<Form.Item
									label="Nome"
									name="nome"
									rules={[{ required: true, message: "O nome é obrigatório" }]}
								>
									<Input placeholder="Seu nome completo" />
								</Form.Item>

								<Form.Item
									label="Email"
									name="email"
									rules={[
										{ required: true, message: "O e-mail é obrigatório" },
										{ type: "email", message: "Digite um e-mail válido" },
									]}
								>
									<Input placeholder="seu@email.com" />
								</Form.Item>

								<Form.Item label="Foto de perfil">
									<Upload
										accept="image/*"
										beforeUpload={async (file) => {
											const base64 = await getBase64(file);
											setFileBase64(base64);
											setFormChanged(true);
											return false;
										}}
										showUploadList={false}
									>
										<Button icon={<UploadOutlined />}>Selecionar imagem</Button>
									</Upload>
								</Form.Item>

								<Space style={{ marginTop: 16 }}>
									<Button
										type="primary"
										onClick={handleSave}
										disabled={!formChanged}
										loading={loading}
									>
										Salvar Alterações
									</Button>
									<Button
										onClick={() => {
											form.resetFields();
											form.setFieldsValue(userData);
											setFileBase64(null);
											setFormChanged(false);
										}}
									>
										Cancelar
									</Button>
								</Space>
							</Form>
						</Col>
					</Row>
				</Card>
			</Spin>
		</ContentLayout>
	);
}
