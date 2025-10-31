"use client";

import { MAX_CONTAINER_WIDTH } from "@/utils/constants";
import {
	EditOutlined,
	EnvironmentOutlined,
	SearchOutlined,
} from "@ant-design/icons";
import { Input, Typography } from "antd";

const { Text } = Typography;

export default function TopHeader() {
	return (
		<div
			style={{
				backgroundColor: "#2A4BA0",
				padding: "16px 20px",
				width: "100%",
			}}
		>
			<div
				style={{
					width: "100%",
					maxWidth: MAX_CONTAINER_WIDTH,
					margin: "0 auto",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flexWrap: "wrap",
						gap: "32px",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
							<Text
								style={{
									fontSize: "28px",
									fontWeight: "bold",
									color: "white",
								}}
							>
								Re
							</Text>
							<Text
								style={{
									fontSize: "28px",
									fontWeight: "bold",
									color: "#FFD700",
								}}
							>
								Use
							</Text>
						</div>
						<Text
							style={{
								color: "white",
								fontSize: "12px",
								lineHeight: "1.4",
								width: 350,
							}}
						>
							Somos a plataforma brasileira de troca de qualquer coisa =)
						</Text>
					</div>

					<div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								backgroundColor: "white",
								borderRadius: "8px",
								padding: "8px 12px",
								minWidth: "200px",
							}}
						>
							<EnvironmentOutlined
								style={{ color: "#666", marginRight: "8px" }}
							/>
							<div style={{ flex: 1 }}>
								<Text
									style={{ color: "#999", fontSize: "12px", display: "block" }}
								>
									Local:
								</Text>
								<Text
									style={{
										color: "#000",
										fontWeight: "bold",
										fontSize: "14px",
									}}
								>
									Uberlândia/MG
								</Text>
							</div>
							<EditOutlined style={{ color: "#666", cursor: "pointer" }} />
						</div>

						<Input
							prefix={<SearchOutlined style={{ color: "#999" }} />}
							placeholder="Busca"
							style={{
								backgroundColor: "white",
								borderRadius: "8px",
								border: "none",
								minWidth: "200px",
								height: 32,
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
