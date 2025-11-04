"use client";

import BreadcrumbRoute from "@/components/BreadcrumbRoute";
import { Flex, message, Spin, Tabs, Typography } from "antd";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TradeChat from "./tabs/TradeChat";
import TradeInfo from "./tabs/TradeInfo";

const { Title } = Typography;

export default function TradeDetailsPage() {
	const params = useParams<{ tradeId: string }>();
	const tradeId = params.tradeId;

	const [trade, setTrade] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const fetchTrade = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(`/api/propostas/${tradeId}`);
			setTrade(data);
		} catch (err: any) {
			message.error(err.response?.data?.error || "Erro ao carregar proposta");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTrade();
	}, [tradeId]);

	return (
		<Spin spinning={loading} tip="Carregando dados da proposta...">
			<Flex vertical gap={24} style={{ width: "100%" }}>
				<Flex gap={0} vertical>
					<BreadcrumbRoute />
					<Title level={2} style={{ color: "#2A4BA0", margin: 0, padding: 0 }}>
						Proposta Recebida
					</Title>
				</Flex>

				<Tabs
					defaultActiveKey="details"
					items={[
						{
							key: "details",
							label: "Detalhes",
							children: <TradeInfo trade={trade} />,
						},
						{
							key: "chat",
							label: "Chat",
							children: <TradeChat tradeId={tradeId} />,
						},
					]}
					tabBarStyle={{
						marginBottom: 24,
					}}
				/>
			</Flex>
		</Spin>
	);
}
