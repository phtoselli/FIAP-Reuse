import { Product } from "@/types/product";
import { Card, Flex, Image, Rate, theme } from "antd";
import Text from "antd/es/typography/Text";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { InfoCircleOutlined, SwapOutlined } from "@ant-design/icons";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import { Routes } from "@/types/routes";

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
            src={product.imagem ? product.imagem : "/produto.png"}
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
            onClick={() => redirect(`${Routes.POSTS}/${product?.id}`)}
            title="Informações do produto"
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
