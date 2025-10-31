"use client";

import ContentLayout from "@/components/ContentLayout";
import { getUser, setUser } from "@/utils/auth";
import { User } from "@prisma/client";
import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Image,
	Input,
	message,
	Row,
	Space,
	Typography,
} from "antd";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;

type Props = {
	params: {
		userId: string;
	};
};

export default function UserPage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = React.use(params);
	const [form] = Form.useForm();
	const [formChanged, setFormChanged] = useState(false);
	const [userData, setUserData] = useState<User | null>(null);

	const handleSave = async () => {
		try {
			const values = await form.validateFields();

			setUser({ ...userData, ...values });
			setUserData({ ...userData, ...values });

			message.success("Alterações salvas com sucesso!");
			setFormChanged(false);
		} catch {
			message.error("Verifique os campos do formulário.");
		}
	};

	useEffect(() => {
		const storedUser = getUser();

		if (!storedUser || storedUser.id?.toString() !== userId.toString()) {
			notFound();
		} else {
			setUserData(storedUser);
			form.setFieldsValue(storedUser);
		}
	}, [userId, form]);

	if (!userData) return null;

	return (
		<ContentLayout title="Meu Perfil">
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
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								textAlign: "center",
							}}
						>
							<Image
								src={
									userData.avatarUrl ||
									`https://xsgames.co/randomusers/assets/avatars/pixel/${
										Math.floor(Math.random() * 53) + 1
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
							<Title level={4} style={{ marginBottom: 4 }}>
								{userData.nome || "Usuário"}
							</Title>
							<Text type="secondary">{userData.email}</Text>
							<Divider style={{ margin: "24px 0" }} />
							<Text type="secondary" style={{ fontSize: 13 }}>
								Edite suas informações pessoais abaixo
							</Text>
						</div>
					</Col>

					{/* Formulário */}
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

							<Form.Item
								label="Avatar (URL)"
								name="avatarUrl"
								rules={[{ type: "url", message: "Digite uma URL válida" }]}
							>
								<Input
									placeholder="https://exemplo.com/meu-avatar.png"
									onBlur={(e) =>
										setUserData((prev) => ({
											...prev!,
											avatarUrl: e.target.value,
										}))
									}
								/>
							</Form.Item>

							<Form.Item label="Bio" name="bio">
								<Input.TextArea
									rows={4}
									placeholder="Fale um pouco sobre você..."
								/>
							</Form.Item>

							<Space style={{ marginTop: 24 }}>
								<Button
									type="primary"
									onClick={handleSave}
									disabled={!formChanged}
								>
									Salvar Alterações
								</Button>
								<Button
									onClick={() => {
										form.resetFields();
										form.setFieldsValue(userData);
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
		</ContentLayout>
	);
}
