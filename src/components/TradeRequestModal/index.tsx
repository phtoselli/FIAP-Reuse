import { Modal, Select, Form, Button, Typography, Image } from "antd";
import { Product } from "@/types/product";
import { useState } from "react";
import useService from "@/hooks/useService";
import productService from "@/service/products";

const { Text } = Typography;

interface TradeRequestModalProps {
  isOpen: boolean;
  setIsOpen: (param: boolean) => void;
  targetProduct: Product;
}

export default function TradeRequestModal({
  isOpen,
  setIsOpen,
  targetProduct,
}: TradeRequestModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const handleOk = () => {
    if (selectedProducts.length === 0) return;
    setSelectedProducts([]);
    setIsOpen(false);
  };

  const onCancel = () => {
    setIsOpen(false);
  };

  const {
    execute: getProductsData,
    data: productsData,
    isLoading: productsDataLoading,
    error: getProductsDataError,
  } = useService(productService.get);

  return (
    <Modal
      centered
      destroyOnHidden
      title={`Propor troca por: ${targetProduct.title}`}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item label="Selecione os produtos que deseja oferecer" required>
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Escolha seus produtos"
            value={selectedProducts}
            onChange={(values) => setSelectedProducts(values)}
            optionLabelProp="label"
          >
            {productsData?.map((product) => (
              <Select.Option
                key={product.id}
                value={product.id}
                label={product.title}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    style={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <Text>{product.title}</Text>
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            block
            disabled={selectedProducts.length === 0}
            onClick={handleOk}
          >
            Confirmar Proposta
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
