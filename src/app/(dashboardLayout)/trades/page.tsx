"use client";

import ContentLayout from "@/components/ContentLayout";
import { StringMap } from "@/types";
import { TradeStatus } from "@/types/status";
import { getUserId } from "@/utils/auth";
import getStatusColor from "@/utils/getStatusColor";
import { SearchOutlined } from "@ant-design/icons";
import {
	Button,
	Card,
	Flex,
	Form,
	Image,
	Input,
	List,
	Segmented,
	Select,
	Spin,
	Tag,
} from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const { Option } = Select;

export default function Trades() {
	const [form] = Form.useForm();
	const [filters, setFilters] = useState<StringMap>({});
	const [role, setRole] = useState<"requester" | "responder">("requester");
	const [loading, setLoading] = useState(false);
	const [propostas, setPropostas] = useState<any[]>([]);

	const router = useRouter();
	const userId = getUserId();

	const fetchPropostas = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get("/api/propostas", {
				params: {
					userId,
					role,
					status: filters.status,
				},
			});
			setPropostas(data.propostas || []);
		} catch (err) {
			console.error("Erro ao buscar propostas:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPropostas();
	}, [role, filters]);

	const filteredTrades = useMemo(() => {
		const search = (filters.search || "").toLowerCase();

		return propostas
			.filter((trade) => {
				return (
					!search ||
					trade.message.toLowerCase().includes(search) ||
					trade.requester?.name?.toLowerCase().includes(search) ||
					trade.responder?.name?.toLowerCase().includes(search)
				);
			})
			.sort((a, b) => {
				if (filters.ordem === "maisRecentes") {
					return (
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					);
				} else if (filters.ordem === "maisAntigos") {
					return (
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					);
				}
				return 0;
			});
	}, [filters, propostas]);

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "pending":
				return "Pendente de Aprovação";
			case "accepted":
				return "Proposta Aceita";
			case "rejected":
				return "Proposta Rejeitada";
			case "finished":
				return "Proposta Finalizada";
			default:
				return status; // fallback caso venha um status inesperado
		}
	};

	return (
		<ContentLayout
			title="Propostas"
			extra={[
				<Form
					key="propostasForm"
					layout="vertical"
					form={form}
					onValuesChange={(_, allValues) => setFilters(allValues)}
				>
					<Flex gap={8} wrap>
						<Form.Item name="search" style={{ margin: 0 }}>
							<Input
								placeholder="Buscar proposta"
								prefix={<SearchOutlined />}
								allowClear
							/>
						</Form.Item>

						<Form.Item name="status" style={{ margin: 0 }}>
							<Select placeholder="Todos" allowClear style={{ width: 200 }}>
								<Option value="pending">Pendente</Option>
								<Option value="accepted">Aceita</Option>
								<Option value="rejected">Recusada</Option>
								<Option value="finished">Finalizada</Option>
							</Select>
						</Form.Item>

						{/* <Form.Item name="ordem" style={{ margin: 0 }}>
              <Select defaultValue="maisRecentes" style={{ width: 200 }}>
                <Option value="maisRecentes">Mais recentes</Option>
                <Option value="maisAntigos">Mais antigos</Option>
              </Select>
            </Form.Item> */}

						<Segmented
							options={[
								{ label: "Feitas", value: "requester" },
								{ label: "Recebidas", value: "responder" },
							]}
							value={role}
							onChange={(val) => setRole(val as "requester" | "responder")}
						/>
					</Flex>
				</Form>,
			]}
		>
			<Spin spinning={loading}>
				<List
					style={{ height: "calc(100vh - 170px)" }}
					grid={{ gutter: 16, column: 4 }}
					dataSource={filteredTrades}
					locale={{ emptyText: "Nenhuma proposta encontrada." }}
					renderItem={(trade) => (
						<List.Item key={trade.id}>
							<Card
								size="small"
								title={`Proposta ${role === "requester" ? "para" : "de"} ${
									role === "requester"
										? trade.responder?.name
										: trade.requester?.name
								}`}
								extra={
									<Button
										color="primary"
										variant="filled"
										onClick={() => router.push(`/trades/details/${trade.id}`)}
										style={{ height: "20px" }}
									>
										{role === "requester" ? "Editar proposta" : "Ver proposta"}
									</Button>
								}
							>
								<Flex gap={16}>
									<Image
										src={
											trade.items?.[0]?.post.imageUrl ??
											`https://picsum.photos/500/500?random=${Math.floor(
												Math.random() * 100
											)}`
										}
										alt="Imagem da proposta"
										style={{
											borderRadius: 8,
											objectFit: "cover",
											height: 100,
											width: 100,
										}}
										preview={false}
									/>
									<div>
										<p>{trade.message}</p>
										<p>
											Status:{" "}
											<Tag color={getStatusColor(trade.status as TradeStatus)}>
												{getStatusLabel(trade.status)}
											</Tag>
										</p>
										<p>
											Data: {new Date(trade.createdAt).toLocaleDateString()}
										</p>
										<p>Total de itens: {trade.totalItems}</p>
									</div>
								</Flex>
							</Card>
						</List.Item>
					)}
				/>
			</Spin>
		</ContentLayout>
	);
}
