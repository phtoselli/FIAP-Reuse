"use client";

import { useState } from "react";

import {
  Avatar,
  Card,
  Col,
  Divider,
  Flex,
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

interface User {
  key: string;
  name: string;
  avatar: string;
  location: string;
  createdAt: string;
  score: number;
  active: boolean;
}

const mockUsers: User[] = [
  {
    key: "1",
    name: "João Silva",
    avatar: "https://i.pravatar.cc/150?img=1",
    location: "São Paulo, BR",
    createdAt: "2023-08-01",
    score: 4,
    active: true,
  },
  {
    key: "2",
    name: "Maria Oliveira",
    avatar: "https://i.pravatar.cc/150?img=2",
    location: "Lisboa, PT",
    createdAt: "2023-07-15",
    score: 5,
    active: false,
  },
  {
    key: "3",
    name: "Carlos Souza",
    avatar: "https://i.pravatar.cc/150?img=3",
    location: "Rio de Janeiro, BR",
    createdAt: "2023-06-20",
    score: 3,
    active: true,
  },
];

export default function Dashboard() {
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = mockUsers.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

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
              value={128}
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
              value={24}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Input.Search
        placeholder="Buscar usuário pelo nome"
        allowClear
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        value={searchText}
        style={{ marginBottom: 16 }}
      />

      <Table
        columns={columns}
        dataSource={filteredUsers}
        pagination={{ pageSize: 5 }}
      />
    </ContentLayout>
  );
}
