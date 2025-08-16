"use client";

import { Avatar, Flex, Layout, Menu, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  TagsOutlined,
  BarChartOutlined,
  FolderOpenOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Routes } from "@/types/routes";

const menuItems: MenuProps["items"] = [
  {
    key: Routes.DASHBOARD,
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: Routes.USERS,
    icon: <TeamOutlined />,
    label: "Gestão de Usuários",
  },
  {
    key: Routes.POSTS,
    icon: <FileTextOutlined />,
    label: "Publicações",
  },
  {
    key: Routes.TAGS,
    icon: <TagsOutlined />,
    label: "Tags",
  },
  {
    key: Routes.REPORTS,
    icon: <BarChartOutlined />,
    label: "Relatórios",
  },
  {
    key: Routes.CATEGORIES,
    icon: <FolderOpenOutlined />,
    label: "Categorias",
  },
];

export default function Sider() {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const changeRoute = (route: string) => {
    router.push(route);
  };

  return (
    <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <Flex
        vertical
        align="center"
        justify="center"
        gap={16}
        style={{ padding: "16px 0px" }}
      >
        <Avatar
          size={collapsed ? 40 : 80}
          icon={<UserOutlined />}
          style={{ backgroundColor: "orange" }}
        />
        {!collapsed && (
          <Typography.Title level={4} style={{ color: "white" }}>
            Nome do usuário
          </Typography.Title>
        )}
      </Flex>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        onClick={(e) => changeRoute(e.key)}
        items={menuItems}
      />
    </Layout.Sider>
  );
}
