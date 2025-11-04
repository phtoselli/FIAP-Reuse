"use client";

import { ProposalModel } from "@/service/proposals";
import { getUser } from "@/utils/auth";
import {
	Button,
	Card,
	Empty,
	Flex,
	Image,
	message,
	Rate,
	Spin,
	Typography,
} from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

const { Text, Link } = Typography;

type TradeInfoProps = {
	trade: ProposalModel | null;
};

export default function TradeInfo({ trade }: TradeInfoProps) {
	const user = getUser();
	const router = useRouter();

	if (!trade) return <Spin spinning tip="Carregando informações..." />;

	const responderId = user.id;

	const handleAction = async (action: "aceitar" | "recusar") => {
		try {
			const { data } = await axios.post(
				`/api/propostas/${trade.id}/${action}`,
				{ responderId }
			);

			message.success(data.message);

			if (action === "aceitar") {
				router.push(`/trades/finalize_exchange?tradeId=${trade.id}`);
			}
		} catch (err: any) {
			message.error(err.response?.data?.message || "Erro ao processar ação");
		}
	};

	const offeredItems = trade.items?.filter((i: any) => i.isOffered);
	const interestItems = trade.items?.filter((i: any) => !i.isOffered);

	const renderItems = (items: any[]) => {
		if (!items?.length) {
			return (
				<Empty
					description="Nenhum item encontrado"
					image={Empty.PRESENTED_IMAGE_SIMPLE}
				/>
			);
		}

		return (
			<Flex wrap gap={16}>
				{items.map((item: any) => (
					<Card
						key={item.id}
						style={{
							width: 220,
							borderRadius: 12,
							overflow: "hidden",
						}}
						styles={{ body: { padding: 12 } }}
					>
						<Image
							src={
								item.post?.imageUrl
									? item.post.imageUrl
									: "https://picsum.photos/200"
							}
							alt={item.post?.title || "Produto"}
							width="100%"
							height={140}
							style={{
								objectFit: "cover",
								borderRadius: 8,
								marginBottom: 8,
							}}
							preview={false}
						/>
						<Flex vertical gap={4}>
							<Rate disabled allowHalf defaultValue={item.post?.rating || 0} />
							<Text strong>{item.post?.title || "Sem título"}</Text>
							<Text type="secondary" ellipsis>
								{item.post?.description || "Sem descrição"}
							</Text>
							<Text type="secondary" style={{ fontSize: 12 }}>
								Categoria: {item.post?.subcategory?.name || "Sem categoria"}
							</Text>
						</Flex>
					</Card>
				))}
			</Flex>
		);
	};

	return (
		<Flex gap={16} align="stretch" style={{ width: "100%" }}>
			<Flex vertical gap={16} style={{ width: "30%" }}>
				<Card title="Proponente">
					<Flex align="center" gap={12} style={{ marginTop: 8 }}>
						<Image
							src={trade.requester?.avatarUrl || "https://picsum.photos/50"}
							width={50}
							height={50}
							style={{ borderRadius: "50%", objectFit: "cover" }}
							preview={false}
						/>
						<Flex vertical>
							<Link strong>{trade.requester?.name}</Link>
							<Text type="secondary" style={{ fontSize: 12 }}>
								{trade.requester?.city} - {trade.requester?.state}
							</Text>
						</Flex>
					</Flex>
				</Card>

				<Card title="Item de interesse">
					<div style={{ marginTop: 16 }}>{renderItems(interestItems)}</div>
				</Card>
			</Flex>

			<Card
				style={{ flex: 1 }}
				title="Produtos oferecidos em troca"
				extra={
					<Flex gap={8}>
						<Button
							danger
							shape="round"
							disabled={trade.status !== "pending"}
							onClick={() => handleAction("recusar")}
						>
							Recusar
						</Button>

						<Button
							type="primary"
							shape="round"
							disabled={trade.status !== "pending"}
							onClick={() => handleAction("aceitar")}
						>
							Aceitar
						</Button>
					</Flex>
				}
			>
				<Flex vertical gap={16} style={{ flex: 1 }}>
					{renderItems(offeredItems)}
				</Flex>
			</Card>
		</Flex>
	);
}
