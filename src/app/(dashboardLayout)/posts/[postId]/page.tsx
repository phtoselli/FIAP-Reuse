"use client";

import { useParams } from "next/navigation";
import {
  Button,
  Card,
  Descriptions,
  Divider,
  Flex,
  Image,
  Rate,
  Typography,
} from "antd";
import { SwapOutlined } from "@ant-design/icons";
import BreadcrumbRoute from "@/components/BreadcrumbRoute";

const { Title, Paragraph } = Typography;

const mockPost = {
  id: 1,
  nome: "Tênis Nike Air Max",
  descricao: "Tênis usado em bom estado, cor branca, tamanho 42.",
  categoria: "Calçados",
  estado: "Bom",
  imagem: "https://picsum.photos/400?random=1",
  avaliacoes: 4.5,
  ofertante: {
    nome: "João da Silva",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
};

export default function PostDetailsPage() {
  const { postId } = useParams();

  const post = mockPost;

  return (
    <div style={{ padding: 24 }}>
      <BreadcrumbRoute />
      <Title level={3}>Detalhes do Produto</Title>

      <Divider />

      <Flex gap={32} align="flex-start" wrap="wrap">
        <Image
          src={post.imagem}
          width={400}
          height={400}
          style={{ objectFit: "cover", borderRadius: 8 }}
          alt={post.nome}
        />

        <div style={{ flex: 1 }}>
          <Title level={4}>{post.nome}</Title>

          <Flex align="center" gap={8}>
            <Rate disabled defaultValue={post.avaliacoes} allowHalf />
            <span>({post.avaliacoes} estrelas)</span>
          </Flex>

          <Divider />

          <Descriptions
            column={1}
            bordered
            labelStyle={{ fontWeight: "bold", width: 180 }}
          >
            <Descriptions.Item label="Descrição">
              <Paragraph>{post.descricao}</Paragraph>
            </Descriptions.Item>
            <Descriptions.Item label="Categoria">
              {post.categoria}
            </Descriptions.Item>
            <Descriptions.Item label="Estado de Conservação">
              {post.estado}
            </Descriptions.Item>
          </Descriptions>

          <Divider />

          <Button
            type="primary"
            icon={<SwapOutlined />}
            size="large"
            style={{ marginTop: 16 }}
          >
            Enviar proposta de troca
          </Button>
        </div>
      </Flex>

      <Divider />

      <Card title="Ofertante" bordered style={{ maxWidth: 400, marginTop: 24 }}>
        <Flex align="center" gap={16}>
          <Image
            src={post.ofertante.avatar}
            width={64}
            height={64}
            style={{ borderRadius: "50%", objectFit: "cover" }}
            alt={post.ofertante.nome}
          />
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {post.ofertante.nome}
            </Title>
          </div>
        </Flex>
      </Card>
    </div>
  );
}
