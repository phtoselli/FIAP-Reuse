"use client";

import { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Col,
  Input,
  message,
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
  DeleteTwoTone,
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
  id: string;
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
          id: u.id,
          name: u.nome,
          avatar: u.avatarUrl || "https://i.pravatar.cc/150",
          location: `${u.cidade}, ${u.estado}`,
          createdAt: new Date(u.dataCriacao).toLocaleDateString(),
          email: u.email,
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

  async function handleDelete(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || "Usuário deletado com sucesso");
        // Atualize a tabela, se necessário
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        const errorData = await response.json();
        message.error(errorData.error || "Erro ao deletar usuário");
      }
    } catch (error) {
      console.error(error);
      message.error("Erro inesperado ao deletar usuário");
    }
  }

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
      title: "Data de Cadastro",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },

    {
      title: (
        <Space>
          <span>Excluir Usuário?</span>
        </Space>
      ),
      key: "action",
      render: (_: any, record: User) => (
        <DeleteTwoTone
          twoToneColor="#ff4d4f"
          onClick={() => handleDelete(record.id)}
          style={{ cursor: "pointer" }}
        />
      ),
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
            <Statistic title="Trocas" value={"-"} prefix={<SwapOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Novos Este Mês"
              value={"-"}
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
