/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ContentLayout from "@/components/ContentLayout";
import { Product } from "@/types/product";
import { CategoryDescription } from "@/types/type/category";
import { ConditionDescription } from "@/types/type/condition";
import {
	CloseCircleOutlined,
	EditOutlined,
	LoadingOutlined,
	SwapOutlined,
} from "@ant-design/icons";
import {
	Avatar,
	Button,
	Descriptions,
	Divider,
	Image,
	Rate,
	Result,
	Tag,
	Typography,
	theme,
} from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { Categories } from "@/types/category";
import { getUserId } from "@/utils/auth";

const { Title, Paragraph, Text } = Typography;

export default function PostDetailsPage() {
	const { token } = theme.useToken();
	const { postId } = useParams();

	const [postData, setPostData] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { open: openTradeRequestModal } = useURLControlledModal(
		URLControlledModalKeys.TRADE_REQUEST_MODAL
	);

	const { open: openEditPostModal } = useURLControlledModal(
		URLControlledModalKeys.EDIT_POST_MODAL
	);

	const userId = getUserId();

	const getCategoryNamePT = (categoryId?: string | number) => {
		if (!categoryId) return "-";
		const id = Number(categoryId) as keyof typeof Categories;
		return Categories[id]?.namePT || "-";
	};

	useEffect(() => {
		async function fetchProduct() {
			if (!postId) return;

			setIsLoading(true);
			setError(null);

			try {
				const res = await fetch(`/api/produtos/${postId}`);
				if (!res.ok) {
					const errData = await res.json();
					throw new Error(errData?.error || "Erro ao buscar produto");
				}
				const data: Product = await res.json();
				setPostData(data);
			} catch (err: any) {
				setError(err.message);
				setPostData(null);
			} finally {
				setIsLoading(false);
			}
		}

		fetchProduct();
	}, [postId]);

	const getConditionDescription = () => {
		if (!postData?.condicao?.codigo) return "-";
		const code = postData.condicao.codigo as keyof typeof ConditionDescription;
		return ConditionDescription[code] || "-";
	};

	const getCategoryDescription = () => {
		if (!postData?.categoria?.nome) return "-";
		return (
			CategoryDescription[
				postData.categoria.nome as keyof typeof CategoryDescription
			] || "-"
		);
	};

	console.log(postData);

	return (
		<ContentLayout
			title="Detalhes do produto"
			extra={
				postData && (
					<>
						{userId === postData.usuario.id && (
							<Button
								type="primary"
								icon={<EditOutlined />}
								size="large"
								onClick={() => openEditPostModal(postData.id)}
							>
								Editar Publicação
							</Button>
						)}

						{userId !== postData.usuario.id && (
							<Button
								type="primary"
								icon={<SwapOutlined />}
								size="large"
								onClick={() => openTradeRequestModal(postData.id)}
							>
								Enviar proposta de troca
							</Button>
						)}
					</>
				)
			}
		>
			{isLoading && !postData && !error && (
				<Result
					icon={<LoadingOutlined style={{ fontSize: 80 }} />}
					title="Carregando informações do produto..."
					subTitle="Por favor, aguarde."
				/>
			)}

			{!isLoading && error && !postData && (
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

			{postData && !isLoading && !error && (
				<div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
					<Image
						src={postData.imagem ?? "/placeholder.png"}
						width={400}
						height={400}
						style={{ objectFit: "cover", borderRadius: 8 }}
						alt={postData.nome}
					/>

					<div style={{ flex: 1 }}>
						<Title level={4}>{postData.nome}</Title>
						<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
							<Rate disabled defaultValue={postData.avaliacao} allowHalf />
							<Tag color={postData.ativo ? "green" : "red"}>
								{postData.ativo ? "Ativo" : "Inativo"}
							</Tag>
						</div>

						<Divider />

						<Descriptions column={1} bordered>
							<Descriptions.Item label="Descrição">
								{postData.descricao || "-"}
							</Descriptions.Item>
							<Descriptions.Item label="Categoria">
								{postData.categoria.id
									? getCategoryNamePT(postData.categoria.id)
									: "-"}
							</Descriptions.Item>

							<Descriptions.Item label="Estado de Conservação">
								{postData.condicao?.tipo || "-"}
							</Descriptions.Item>
							<Descriptions.Item label="Criado em">
								{new Date(postData.dataCriacao).toLocaleString()}
							</Descriptions.Item>
							<Descriptions.Item label="Atualizado em">
								{new Date(postData.dataAtualizacao).toLocaleString()}
							</Descriptions.Item>
							<Descriptions.Item label="Usuário">
								<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
									<Avatar src={postData.usuario?.avatarUrl || undefined} />
									<div>
										<div>{postData.usuario?.nome}</div>
										{/* <div>
                      {postData.usuario?.cidade}, {postData.usuario?.estado}
                    </div> */}
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
