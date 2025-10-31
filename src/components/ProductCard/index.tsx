import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { Product } from "@/types/product";
import { Routes } from "@/types/routes";
import { InfoCircleOutlined, SwapOutlined } from "@ant-design/icons";
import { Card, Flex, Image, Rate, theme } from "antd";
import Text from "antd/es/typography/Text";

interface Props {
	product: Product;
}

export default function ProductCard({ product }: Props) {
	const { token } = theme.useToken();

	const { redirect } = useSearchParamsHelper();
	const { open: openTradeRequestModal } = useURLControlledModal(
		URLControlledModalKeys.TRADE_REQUEST_MODAL
	);

	return (
		<>
			<Card
				hoverable
				cover={
					<Image
						alt={product.nome}
						src={
							product.imagem
								? product.imagem
								: "https://via.placeholder.com/200x130/4A90E2/FFFFFF?text=Produto"
						}
						height={130}
						preview={false}
						style={{ borderRadius: 8, border: "2px solid white" }}
					/>
				}
				style={{
					width: 200,
					margin: "16px",
					border: "2px solid white",
				}}
				styles={{ body: { padding: "8px 4px 16px 4px" } }}
				actions={[
					<InfoCircleOutlined
						key="product-info-button"
						onClick={() => {
							window.location.href = `${Routes.POSTS}/${product?.id}`;
						}}
						title="Informações do produto"
						style={{
							color: "#1890ff",
							fontSize: "18px",
							fontWeight: "bold",
						}}
					/>,
					<SwapOutlined
						key="trade-card-button"
						onClick={() => openTradeRequestModal(product?.id)}
						title="Propor troca"
					/>,
				]}
			>
				<Card.Meta
					title={product.nome}
					description={
						<Flex vertical gap={8}>
							<Flex align="center" justify="space-between">
								<Rate disabled value={product.avaliacao} />
								<Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
									({product.avaliacao} avaliações)
								</Text>
							</Flex>
						</Flex>
					}
				/>
			</Card>
		</>
	);
}
