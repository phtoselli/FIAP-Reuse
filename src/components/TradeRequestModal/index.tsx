/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { Product } from "@/types/product";
import { CategoryCode, CategoryId } from "@/types/type/category";
import { getUser, getUserId } from "@/utils/auth";
import {
	Button,
	Divider,
	Form,
	Image,
	message,
	Modal,
	Select,
	Spin,
	Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Text, Title, Paragraph } = Typography;

export default function TradeRequestModal() {
	const [loading, setLoading] = useState(false);
	const [userProducts, setUserProducts] = useState<Product[]>([]);
	const [targetProduct, setTargetProduct] = useState<Product | null>(null);
	const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

	const user = getUser();
	const userId = getUserId();

	const { isOpen, close, paramValue } = useURLControlledModal(
		URLControlledModalKeys.TRADE_REQUEST_MODAL
	);

	const getCategoryName = (id?: string) => {
		if (!id) return "Sem categoria";
		const entry = Object.entries(CategoryId).find(([_, value]) => value === id);
		if (!entry) return "Sem categoria";
		return CategoryCode[entry[0] as keyof typeof CategoryCode];
	};

	const selectedProductsOptions = userProducts.map((p) => ({
		key: p.id,
		value: p.id,
		label: p.name,
	}));

	const handleOk = async () => {
		if (!selectedProduct || !targetProduct) return;

		setLoading(true);
		try {
			const user = getUser();
			if (!user) throw new Error("Usuário não está logado");

			const res = await fetch("/api/propostas", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					requesterId: user.id,
					responderId: targetProduct.user?.id,
					message: `Gostaria de trocar meu produto pelo ${targetProduct.name}`,
					items: [
						{ postId: selectedProduct, isOffered: true },
						{ postId: targetProduct.id, isOffered: false },
					],
				}),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Erro ao criar proposta");

			message.success("Proposta enviada com sucesso!");
			setSelectedProduct(null);
			close();
		} catch (error: any) {
			message.error(error.message || "Erro ao enviar proposta");
		} finally {
			setLoading(false);
		}
	};

	const onCancel = () => {
		setSelectedProduct(null);
		setTargetProduct(null);
		setUserProducts([]);
		close();
	};

	useEffect(() => {
		if (!isOpen || !paramValue) return;

		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/produtos/${paramValue}`);
				if (!res.ok) throw new Error("Produto não encontrado");

				const data: Product = await res.json();
				setTargetProduct(data);

				if (!user) throw new Error("Usuário não está logado");

				const userRes = await fetch(`/api/produtos`);
				if (!userRes.ok)
					throw new Error("Não foi possível carregar seus produtos");

				const userData = await userRes.json();
				console.log("Resposta de /api/produtos:", userData);

				const allProducts: Product[] =
					userData?.products ||
					userData?.produtos ||
					(Array.isArray(userData) ? userData : []);

				const myProducts = allProducts.filter(
					(p: Product) => p.user?.id === userId
				);

				setUserProducts(myProducts);
			} catch (error: any) {
				message.error(error.message || "Erro ao carregar dados");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [isOpen, paramValue]);

	return (
		<Modal
			centered
			title="Proposta de troca"
			open={isOpen}
			onCancel={onCancel}
			footer={null}
			width={600}
		>
			{loading || !targetProduct ? (
				<Spin tip="Carregando produto..." />
			) : (
				<>
					<div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
						<Image
							src={
								targetProduct.image ??
								`https://picsum.photos/500/500?random=${Math.floor(
									Math.random() * 100
								)}`
							}
							alt={targetProduct.name}
							width={350}
							style={{ objectFit: "cover", borderRadius: 8 }}
							preview={false}
						/>
						<div>
							<Title level={4}>{targetProduct.name}</Title>
							<Text type="secondary">
								Categoria: {getCategoryName(targetProduct.category?.id)}
							</Text>
							<Paragraph
								ellipsis={{ rows: 3, expandable: true, symbol: "mais" }}
							>
								{targetProduct.description || "Sem descrição"}
							</Paragraph>
						</div>
					</div>

					<Divider />

					<Form layout="vertical">
						<Form.Item label="Selecione o produto que deseja oferecer" required>
							<Select
								style={{ width: "100%" }}
								placeholder="Escolha seu produto"
								value={selectedProduct}
								options={selectedProductsOptions}
								onChange={setSelectedProduct}
								optionLabelProp="label"
							/>
						</Form.Item>

						<Form.Item>
							<Button
								type="primary"
								block
								disabled={!selectedProduct}
								onClick={handleOk}
							>
								Confirmar Proposta
							</Button>
						</Form.Item>
					</Form>
				</>
			)}
		</Modal>
	);
}
