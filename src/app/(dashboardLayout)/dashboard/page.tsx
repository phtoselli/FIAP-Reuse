"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  Input,
  Rate,
  Row,
  Space,
  Statistic,
  Switch,
  Table,
} from "antd";
import Title from "antd/es/typography/Title";
import {
  UserOutlined,
  CalendarOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import ContentLayout from "@/components/ContentLayout";
import axios from "axios";

interface User {
  key: string;
  name: string;
  avatar: string;
  location: string;
  createdAt: string;
  score: number;
  active: boolean;
}

export default function Dashboard() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar usuários da API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/usuarios");
        const data = res.data;

        const mapped = data.usuarios.map((u: any) => ({
          key: u.id,
          name: u.nome,
          avatar: u.avatarUrl || "https://i.pravatar.cc/150",
          location: `${u.cidade}, ${u.estado}`,
          createdAt: new Date(u.dataCriacao).toLocaleDateString(),
          score: Math.floor(Math.random() * 5) + 1, // se não tiver score no back
          active: true, // se não tiver campo no back
        }));

        setUsers(mapped);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar localmente
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Usuário",
      dataIndex: "name",
      key: "name",
      render: (_: string, record: User) => (
        <Space>
          <Avatar src={record.avatar} />
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: "Localização",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Data de Cadastro",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score: number) => <Rate disabled defaultValue={score} />,
    },
    {
      title: "Ativo",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => <Switch defaultChecked={active} />,
    },
  ];

  return (
    <ContentLayout title="Dashboard">
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Usuários Ativos"
              value={users.length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Trocas" value={12} prefix={<SwapOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Novos Este Mês"
              value={5}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Input.Search
        placeholder="Buscar usuário pelo nome"
        allowClear
        onSearch={setSearchText}
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </ContentLayout>
  );
}
