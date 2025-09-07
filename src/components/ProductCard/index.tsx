import { Product } from "@/types/product";
import { Card, Flex, Image, Rate, theme, Button } from "antd";
import Text from "antd/es/typography/Text";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { token } = theme.useToken();

  const { open } = useURLControlledModal(
    URLControlledModalKeys.TRADE_REQUEST_MODAL
  );

  return (
    <>
      <Card
        hoverable
        cover={
          <Image
            alt={product.nome}
            src={product.imagem || undefined}
            height={130}
            preview={false}
            fallback="https://via.placeholder.com/400x400?text=No+Image"
            style={{ borderRadius: 8, border: "2px solid white" }}
          />
        }
        style={{
          width: 200,
          margin: "16px",
          border: "2px solid white",
        }}
        styles={{ body: { padding: "8px 4px 16px 4px" } }}
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

              <Button
                type="primary"
                block
                size="small"
                onClick={() => open(product?.id)}
              >
                Propor Troca
              </Button>
            </Flex>
          }
        />
      </Card>
    </>
  );
}
