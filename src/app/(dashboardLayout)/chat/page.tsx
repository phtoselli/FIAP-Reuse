"use client";

import ContentLayout from "@/components/ContentLayout";
import WatsonChat from "@/components/WatsonChat";
import { getUserId } from "@/utils/auth";
import { RobotOutlined } from "@ant-design/icons";
import { Card, Space, Typography } from "antd";

const { Title, Paragraph } = Typography;

export default function ChatPage() {
	const userId = getUserId();

	return (
		<ContentLayout title="Assistente Virtual">
			<Card>
				<Space direction="vertical" size="large" style={{ width: "100%" }}>
					<div style={{ textAlign: "center" }}>
						<RobotOutlined
							style={{
								fontSize: "48px",
								color: "#1890ff",
								marginBottom: "16px",
							}}
						/>
						<Title level={2}>Assistente Virtual ReUse</Title>
						<Paragraph>
							Converse com nosso assistente para obter informações sobre
							produtos, endereços e propostas de troca.
						</Paragraph>
					</div>

					<WatsonChat
						userId={userId || "6fd9c6b8-8ecd-482b-b321-a7ae05e44dc9"}
						onProductDetails={(productId) => {
							console.log("Product details requested:", productId);
						}}
						onListAddresses={(id) => {
							console.log("Addresses requested for user:", id);
						}}
						onAcceptProposal={(proposalId, id) => {
							console.log("Proposal accepted:", proposalId, "by user:", id);
						}}
					/>
				</Space>
			</Card>
		</ContentLayout>
	);
}
