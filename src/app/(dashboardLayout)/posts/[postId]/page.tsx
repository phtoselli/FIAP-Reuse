/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useParams } from "next/navigation";
import {
  Button,
  Descriptions,
  Divider,
  Flex,
  Image,
  Rate,
  Typography,
  Result,
  theme,
} from "antd";
import {
  CloseCircleOutlined,
  LoadingOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import useService from "@/hooks/useService";
import productService from "@/service/products";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import ContentLayout from "@/components/ContentLayout";
import { CategoryDescription } from "@/types/type/category";
import { ConditionDescription } from "@/types/type/condition";
import TradeRequestModal from "@/components/TradeRequestModal";

const { Title, Paragraph, Text } = Typography;

export default function PostDetailsPage() {
  const { token } = theme.useToken();

  const { postId } = useParams();

  const [isTradeRequestModalOpen, setIsTradeRequestModalOpen] =
    useState<boolean>(false);

  const {
    data: postData,
    execute: getPostByCode,
    error: getPostError,
    isLoading: isLoadingGetPost,
  } = useService<Product | undefined>(productService.getByCode);

  const openTradeRequestModal = () => {
    setIsTradeRequestModalOpen(true);
  };

  useEffect(() => {
    if (postId) {
      getPostByCode(postId);
    }
  }, [postId]);

  return (
    <ContentLayout
      title="Detalhes do produto"
      extra={
        postData && (
          <Button
            type="primary"
            icon={<SwapOutlined />}
            size="large"
            style={{ marginTop: 16 }}
            onClick={openTradeRequestModal}
          >
            Enviar proposta de troca
          </Button>
        )
      }
    >
      {isTradeRequestModalOpen && postData && (
        <TradeRequestModal
          isOpen={isTradeRequestModalOpen}
          setIsOpen={setIsTradeRequestModalOpen}
          targetProduct={postData}
        />
      )}

      {postData && !isLoadingGetPost && !getPostError && (
        <Flex gap={32} align="flex-start" wrap="wrap">
          <Image
            src={postData.imageUrl}
            width={400}
            height={400}
            style={{ objectFit: "cover", borderRadius: 8 }}
            alt={postData.title}
          />

          <div style={{ flex: 1 }}>
            <Title level={4}>{postData.title}</Title>

            <Flex align="center" gap={8}>
              <Rate disabled defaultValue={postData.rate} allowHalf />
              <span>({postData.rateNumber} avaliações)</span>
            </Flex>

            <Divider />

            <Descriptions
              column={1}
              bordered
              styles={{
                label: {
                  fontWeight: "bold",
                  width: 180,
                },
              }}
              items={[
                {
                  key: "description",
                  label: "Descrição",
                  children: postData.description,
                },
                {
                  key: "category",
                  label: "Categoria",
                  children: CategoryDescription[postData.categoryCode],
                },
                {
                  key: "condition",
                  label: "Estado de Conservação",
                  children: ConditionDescription[postData.conditionCode],
                },
              ]}
            />
          </div>
        </Flex>
      )}

      {!postData && isLoadingGetPost && !getPostError && (
        <Flex align="center" justify="center">
          <Result
            icon={<LoadingOutlined size={80} />}
            title="Carregando informações do produto..."
            subTitle="Por favor, aguarde."
          />
        </Flex>
      )}

      {!postData && !isLoadingGetPost && getPostError && (
        <Flex align="center" justify="center">
          <Result
            status="error"
            title="Produto não encontrado."
            subTitle="O código informado não corresponde a nenhum produto cadastrado em nosso sistema."
          >
            <div className="desc">
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  Possíveis motivos:
                </Text>
              </Paragraph>
              <Paragraph>
                <CloseCircleOutlined style={{ color: token.red }} /> O produto
                pode ter sido removido ou não está mais disponível.
              </Paragraph>
              <Paragraph>
                <CloseCircleOutlined style={{ color: token.red }} /> O código
                informado está incorreto. Verifique e tente novamente.
              </Paragraph>
              <Paragraph>
                <CloseCircleOutlined style={{ color: token.red }} /> Se você
                acredita que isso é um erro, entre em contato com nosso suporte.
              </Paragraph>
            </div>
          </Result>
        </Flex>
      )}
    </ContentLayout>
  );
}
