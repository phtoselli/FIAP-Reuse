/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContentLayout from "@/components/ContentLayout";
import {
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
	LoadingOutlined,
	SwapOutlined,
	UserOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Button,
	Descriptions,
	Divider,
	Image,
	Popconfirm,
	Rate,
	Result,
	Tag,
	Typography,
	message,
	theme,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { getUserId } from "@/utils/auth";
import { useProductStore } from "../store";

const { Title, Paragraph, Text } = Typography;

export default function PostDetailsPage() {
	const userId = getUserId();
	const router = useRouter();

	const { postId } = useParams();
	const { token } = theme.useToken();

	const { produtos, getAllProducts, isLoading } = useProductStore();

	const [error, setError] = useState<string | null>(null);

	const { open: openTradeRequestModal } = useURLControlledModal(
		URLControlledModalKeys.TRADE_REQUEST_MODAL
	);

	const { open: openEditPostModal } = useURLControlledModal(
		URLControlledModalKeys.EDIT_POST_MODAL
	);

	const filteredProduct = produtos.find((product) => product.id === postId);

	const handleDeleteProduct = async (id: string) => {
		try {
			const res = await fetch(`/api/produtos/${id}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "Erro ao desativar produto");
			}

			message.success("Produto desativado com sucesso!");
			await getAllProducts();
			router.push("/posts/my");
		} catch (err: any) {
			message.error(err.message || "Erro ao excluir produto");
		}
	};

	useEffect(() => {
		if (!produtos || produtos.length < 1) {
			getAllProducts();
		}
	}, []);

	return (
		<ContentLayout
			title="Detalhes do produto"
			extra={
				filteredProduct && (
					<>
						{userId === filteredProduct.user.id && (
							<div style={{ display: "flex", gap: 8 }}>
								<Button
									type="primary"
									icon={<EditOutlined />}
									size="large"
									onClick={() => openEditPostModal(filteredProduct.id)}
								>
									Editar Publicação
								</Button>

								<Popconfirm
									title="Tem certeza que deseja excluir esta publicação?"
									description="Esta ação não poderá ser desfeita."
									okText="Sim"
									cancelText="Não"
									okButtonProps={{ danger: true }}
									onConfirm={() => handleDeleteProduct(filteredProduct.id)}
								>
									<Button
										type="default"
										danger
										icon={<DeleteOutlined />}
										size="large"
									/>
								</Popconfirm>
							</div>
						)}

						{userId !== filteredProduct.user.id && (
							<Button
								type="primary"
								icon={<SwapOutlined />}
								size="large"
								onClick={() => openTradeRequestModal(filteredProduct.id)}
							>
								Enviar proposta de troca
							</Button>
						)}
					</>
				)
			}
		>
			{isLoading && !filteredProduct && !error && (
				<Result
					icon={<LoadingOutlined style={{ fontSize: 80 }} />}
					title="Carregando informações do produto..."
					subTitle="Por favor, aguarde."
				/>
			)}

			{!isLoading && error && !filteredProduct && (
				<Result
					status="error"
					title="Produto não encontrado"
					subTitle="O código informado não corresponde a nenhum produto cadastrado."
				>
					<div style={{ marginTop: 16 }}>
						<Paragraph>
							<Text strong style={{ fontSize: 16 }}>
								Possíveis motivos:
							</Text>
						</Paragraph>
						<Paragraph>
							<CloseCircleOutlined style={{ color: token.red }} /> Produto
							removido ou indisponível.
						</Paragraph>
						<Paragraph>
							<CloseCircleOutlined style={{ color: token.red }} /> Código
							incorreto.
						</Paragraph>
					</div>
				</Result>
			)}

			{filteredProduct && !isLoading && !error && (
				<div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
					<Image
						src={filteredProduct.image ?? "/placeholder.png"}
						width={400}
						height={400}
						style={{ objectFit: "cover", borderRadius: 8 }}
						alt={filteredProduct.name}
					/>

					<div style={{ flex: 1 }}>
						<Title level={4}>{filteredProduct.name}</Title>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<Rate
								disabled
								defaultValue={filteredProduct.rating || 0}
								allowHalf
							/>
							<Tag color={filteredProduct.isActive ? "green" : "red"}>
								{filteredProduct.isActive ? "Ativo" : "Inativo"}
							</Tag>
						</div>

						<Divider />

						<Descriptions column={1} bordered>
							<Descriptions.Item label="Descrição">
								{filteredProduct.description || "-"}
							</Descriptions.Item>
							<Descriptions.Item label="Categoria">
								{filteredProduct.category.name || "Outros"}
							</Descriptions.Item>

							<Descriptions.Item label="Estado de Conservação">
								{filteredProduct.condition?.name || "Novo"}
							</Descriptions.Item>
							<Descriptions.Item label="Criado em">
								{new Date(filteredProduct.createdAt).toLocaleString()}
							</Descriptions.Item>
							<Descriptions.Item label="Atualizado em">
								{new Date(filteredProduct.updatedAt).toLocaleString()}
							</Descriptions.Item>
							<Descriptions.Item label="Usuário">
								<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
									<Avatar
										src={filteredProduct.user?.avatarUrl}
										icon={<UserOutlined />}
										style={{ backgroundColor: "orange" }}
									/>
									<div>
										<div>{filteredProduct.user?.name}</div>
									</div>
								</div>
							</Descriptions.Item>
						</Descriptions>
					</div>
				</div>
			)}
		</ContentLayout>
	);
}
