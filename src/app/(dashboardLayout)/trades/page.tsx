"use client";

import {
  Card,
  Divider,
  Flex,
  Form,
  Input,
  Select,
  Typography,
  List,
  Tag,
  Tooltip,
  Button,
  Image,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import getStatusColor from "@/lib/utils/getStatusColor";
import { TradeStatus } from "@/types/status";
import { useRouter } from "next/navigation";
import { StringMap } from "@/types";

const { Title } = Typography;
const { Option } = Select;

const mockTrades = [
  {
    id: 1,
    titulo: "Troca com João",
    descricao: "Camisa por tênis",
    status: "pendente",
    data: "2025-08-01",
    imagem: "https://picsum.photos/seed/1/120/120",
  },
  {
    id: 2,
    titulo: "Troca com Maria",
    descricao: "Livro por mochila",
    status: "aceita",
    data: "2025-07-28",
    imagem: "https://picsum.photos/seed/2/120/120",
  },
  {
    id: 3,
    titulo: "Troca com Lucas",
    descricao: "Boné por óculos",
    status: "recusada",
    data: "2025-07-20",
    imagem: "https://picsum.photos/seed/3/120/120",
  },
];

export default function Trades() {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<StringMap>({});
  const router = useRouter();

  const filteredTrades = useMemo(() => {
    return mockTrades
      .filter((trade) => {
        const search = (filters.search || "").toLowerCase();
        const status = filters.status;

        return (
          (!search ||
            trade.titulo.toLowerCase().includes(search) ||
            trade.descricao.toLowerCase().includes(search)) &&
          (!status || trade.status === status)
        );
      })
      .sort((a, b) => {
        if (filters.ordem === "maisRecentes") {
          return new Date(b.data).getTime() - new Date(a.data).getTime();
        } else if (filters.ordem === "maisAntigos") {
          return new Date(a.data).getTime() - new Date(b.data).getTime();
        }
        return 0;
      });
  }, [filters]);

  return (
    <div>
      <Flex align="center" justify="space-between">
        <Title level={3}>Minhas trocas</Title>

        <Flex>
          <Form
            layout="vertical"
            form={form}
            onValuesChange={(_, allValues) => setFilters(allValues)}
          >
            <Flex gap={8} wrap>
              <Form.Item name="search" style={{ margin: 0 }}>
                <Input
                  placeholder="Buscar por título ou descrição"
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Form.Item>

              <Form.Item name="status" style={{ margin: 0 }}>
                <Select placeholder="Todos" allowClear style={{ width: 200 }}>
                  <Option value="pendente">Pendente</Option>
                  <Option value="aceita">Aceita</Option>
                  <Option value="recusada">Recusada</Option>
                  <Option value="finalizada">Finalizada</Option>
                </Select>
              </Form.Item>

              <Form.Item name="ordem" style={{ margin: 0 }}>
                <Select defaultValue="maisRecentes" style={{ width: 200 }}>
                  <Option value="maisRecentes">Mais recentes</Option>
                  <Option value="maisAntigos">Mais antigos</Option>
                </Select>
              </Form.Item>
            </Flex>
          </Form>
        </Flex>
      </Flex>

      <Divider />

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={filteredTrades}
        locale={{ emptyText: "Nenhuma troca encontrada." }}
        renderItem={(trade) => (
          <List.Item key={trade.id}>
            <Card
              title={trade.titulo}
              extra={
                <Tooltip title="Ver detalhes da troca">
                  <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => router.push(`/trades/details/${trade.id}`)}
                  />
                </Tooltip>
              }
            >
              <Flex gap={16}>
                <Image
                  src={trade.imagem}
                  alt="Imagem da troca"
                  width={100}
                  height={100}
                  style={{ borderRadius: 8, objectFit: "cover" }}
                  preview={false}
                />
                <div>
                  <p>{trade.descricao}</p>
                  <p>
                    Status:{" "}
                    <Tag color={getStatusColor(trade.status as TradeStatus)}>
                      {trade.status}
                    </Tag>
                  </p>
                  <p>Data: {new Date(trade.data).toLocaleDateString()}</p>
                </div>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
