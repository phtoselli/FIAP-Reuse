"use client";

import { MAX_CONTAINER_WIDTH } from "@/utils/constants";
import {
	FacebookOutlined,
	GithubOutlined,
	InstagramOutlined,
	MailOutlined,
	TwitterOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function Footer() {
	return (
		<div style={{ marginTop: "auto" }}>
			<div
				style={{
					backgroundColor: "#2A4BA0",
					padding: "40px 0",
					margin: "20px 0",
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: MAX_CONTAINER_WIDTH,
						margin: "0 auto",
						padding: "0 20px",
					}}
				>
					<Row align="middle" justify="space-between">
						<Col xs={24} md={12}>
							<Title
								level={2}
								style={{
									color: "white",
									margin: 0,
									fontSize: "24px",
									fontWeight: "bold",
								}}
							>
								Assine nossa newsletter e fique por dentro das novidades
							</Title>
						</Col>
						<Col xs={24} md={8}>
							<Space.Compact style={{ width: "100%" }}>
								<Input
									prefix={<MailOutlined style={{ opacity: 0.5 }} />}
									placeholder="Informe seu endereço de e-mail."
								/>
								<Button variant="filled" color="primary">
									Assinar
								</Button>
							</Space.Compact>
						</Col>
					</Row>
				</div>
			</div>

			<div style={{ backgroundColor: "#f5f5f5", padding: "40px 0" }}>
				<div
					style={{
						width: "100%",
						maxWidth: MAX_CONTAINER_WIDTH,
						margin: "0 auto",
						padding: "0 20px",
					}}
				>
					<Row gutter={[32, 32]}>
						<Col xs={24} md={6}>
							<div>
								<Title
									level={2}
									style={{
										margin: 0,
										fontSize: "28px",
										fontWeight: "bold",
									}}
								>
									<span style={{ color: "#2A4BA0" }}>Re</span>
									<span style={{ color: "#FFD700" }}>Use</span>
								</Title>
								<Text
									style={{
										color: "#666",
										fontSize: "14px",
										lineHeight: "1.6",
										display: "block",
										marginTop: "12px",
									}}
								>
									Temos roupas que combinam com o seu estilo e das quais você se
									orgulha de usar. Para mulheres e homens.
								</Text>
								<Space size="middle" style={{ marginTop: "20px" }}>
									<Button
										type="text"
										icon={<TwitterOutlined />}
										style={{
											backgroundColor: "#000",
											color: "white",
											borderRadius: "50%",
											width: "40px",
											height: "40px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									/>
									<Button
										type="text"
										icon={<FacebookOutlined />}
										style={{
											backgroundColor: "#000",
											color: "white",
											borderRadius: "50%",
											width: "40px",
											height: "40px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									/>
									<Button
										type="text"
										icon={<InstagramOutlined />}
										style={{
											backgroundColor: "#000",
											color: "white",
											borderRadius: "50%",
											width: "40px",
											height: "40px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									/>
									<Button
										type="text"
										icon={<GithubOutlined />}
										style={{
											backgroundColor: "#000",
											color: "white",
											borderRadius: "50%",
											width: "40px",
											height: "40px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									/>
								</Space>
							</div>
						</Col>

						<Col xs={12} md={4}>
							<div>
								<Title
									level={5}
									style={{ color: "#333", marginBottom: "16px" }}
								>
									EMPRESA
								</Title>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Sobre nós
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Recursos
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Como funciona
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Carreiras
									</Text>
								</div>
							</div>
						</Col>

						<Col xs={12} md={4}>
							<div>
								<Title
									level={5}
									style={{ color: "#333", marginBottom: "16px" }}
								>
									AJUDA
								</Title>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Suporte ao cliente
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Detalhes de entrega
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Termos e condições
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Política de privacidade
									</Text>
								</div>
							</div>
						</Col>

						<Col xs={12} md={4}>
							<div>
								<Title
									level={5}
									style={{ color: "#333", marginBottom: "16px" }}
								>
									DÚVIDAS FREQUENTES
								</Title>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Conta
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Gerenciar entregas
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Pedidos
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Pagamentos
									</Text>
								</div>
							</div>
						</Col>

						<Col xs={12} md={4}>
							<div>
								<Title
									level={5}
									style={{ color: "#333", marginBottom: "16px" }}
								>
									RECURSOS
								</Title>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										eBooks gratuitos
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Tutoriais de desenvolvimento
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Guia prático - Blog
									</Text>
									<Text
										style={{
											color: "#666",
											fontSize: "14px",
											cursor: "pointer",
										}}
									>
										Playlist no YouTube
									</Text>
								</div>
							</div>
						</Col>
					</Row>

					<Divider style={{ margin: "32px 0 16px 0" }} />

					<div style={{ textAlign: "left" }}>
						<Text style={{ color: "#666", fontSize: "14px" }}>
							ReUse - Todos os direitos reservados.
						</Text>
					</div>
				</div>
			</div>
		</div>
	);
}
