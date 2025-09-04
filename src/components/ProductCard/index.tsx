import { Product } from "@/types/product";
import { Card, Flex, Image, Rate, theme } from "antd";
import Text from "antd/es/typography/Text";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { token } = theme.useToken();

  return (
    <Card
      hoverable
      cover={
        <Image
          alt={product.nome}
          src={product.imagem || undefined}
          height={130}
          preview={false}
          fallback="https://via.placeholder.com/400x400?text=No+Image"
          style={{ borderRadius: "8px", border: "2px solid white" }}
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
          <Flex align="center" justify="space-between">
            <Rate disabled value={product.avaliacao} />
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              ({product.avaliacao} avaliações)
            </Text>
          </Flex>
        }
      />
    </Card>
  );
}
