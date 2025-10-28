/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Routes } from "@/types/routes";
import {
	Button,
	Col,
	Divider,
	Flex,
	Form,
	Image,
	Input,
	message,
	Row,
	theme,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";

import { setUser } from "@/utils/auth";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";

export default function Login() {
	const router = useRouter();
	const [form] = useForm();
	const { token } = theme.useToken();

	const [messageApi, contextHolder] = message.useMessage();

	const changeRoute = (route: string) => {
		router.push(route);
	};

	const doLogin = async () => {
		try {
			const values = await form.validateFields();

			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: values.email,
					senha: values.password,
				}),
			});

			const data = await response.json();

			console.log(data);

			if (!response.ok) {
				throw new Error(data.error || "Erro no login");
			}

			setUser(data.user);

			changeRoute(Routes.POSTS);
			messageApi.success("Login realizado com sucesso!");
		} catch (error: any) {
			messageApi.error(error.message || "Erro inesperado no login");
		}
	};

	return (
		<Row style={{ height: "100vh" }}>
			{contextHolder}
			<Col span={12} style={{ backgroundColor: token.colorPrimary }}>
				<Flex align="center" justify="center" style={{ height: "100%" }}>
					<Image
						src="/logo.png"
						alt="Logo da empresa ReUse"
						width={200}
						preview={false}
					/>
				</Flex>
			</Col>

			<Col span={12}>
				<Flex
					align="center"
					justify="center"
					vertical
					style={{ height: "100%" }}
				>
					<Flex vertical style={{ width: "320px" }}>
						<Flex vertical style={{ marginBottom: "8px" }}>
							<Title level={2}>Login</Title>
							<Paragraph>
								Acesse a plataforma agora e experimente a melhor maneira trocar
								seus itens!
							</Paragraph>
						</Flex>

						<Form form={form} layout="vertical">
							<Row>
								<Col span={24}>
									<Form.Item
										name="email"
										label="E-mail"
										rules={[
											{ required: true, message: "O e-mail é obrigatório" },
											{ type: "email", message: "Digite um e-mail válido" },
										]}
									>
										<Input placeholder="Digite seu e-mail..." />
									</Form.Item>
								</Col>

								<Col span={24}>
									<Form.Item
										name="password"
										label="Senha"
										style={{ marginBottom: "4px" }}
										rules={[
											{ required: true, message: "A senha é obrigatória" },
										]}
									>
										<Input.Password placeholder="Digite sua senha..." />
									</Form.Item>
								</Col>

								<Col span={24}>
									<Button
										color="primary"
										variant="link"
										style={{
											padding: "0px",
											marginBottom: "16px",
										}}
									>
										Esqueceu sua senha?
									</Button>
								</Col>

								<Col span={24}>
									<Button
										color="primary"
										variant="solid"
										style={{ width: "100%" }}
										onClick={() => doLogin()}
									>
										Entrar
									</Button>
								</Col>
							</Row>
						</Form>

						<Divider style={{ width: "100px" }}>ou</Divider>

						<Button
							color="primary"
							variant="filled"
							onClick={() => changeRoute(Routes.REGISTER)}
						>
							Cadastre-se
						</Button>
					</Flex>
				</Flex>
			</Col>
		</Row>
	);
}
