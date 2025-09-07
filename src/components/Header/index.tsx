"use client";

import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Flex,
  Image,
  Layout,
  Menu,
  MenuProps,
  Space,
  Tooltip,
} from "antd";
import {
  LogoutOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";
import { Routes } from "@/types/routes";
import { useState, useEffect } from "react";
import { clearUser, getUser } from "@/utils/auth";
import useSearchParamsHelper from "@/hooks/useSearchParamsHelper";
import { User } from "@prisma/client";

export default function Header() {
  const pathname = usePathname();
  const { redirect } = useSearchParamsHelper();

  const [notifications, setNotifications] = useState<[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    clearUser();
    redirect(Routes.LOGIN);
  };

  const goToProfile = () => {
    if (user?.id) {
      redirect(`${Routes.USERS}/${user.id}`);
    }
  };

  const handleMenuClick = (e: { key: string }) => {
    redirect(e.key);
  };

  const menuItems: MenuProps["items"] = [
    { key: Routes.POSTS, label: "Publicações" },
    { key: Routes.MY_POSTS, label: "Minhas Publicações" },
    { key: Routes.TRADES, label: "Propostas" },
    { key: Routes.DASHBOARD, label: "Usuários" },
  ];

  const settings: MenuProps["items"] = [
    {
      key: "profile",
      label: "Meu perfil",
      icon: <UserOutlined />,
      onClick: goToProfile,
    },
    { key: "logout", label: "Sair", icon: <LogoutOutlined />, onClick: logout },
  ];

  return (
    <Layout.Header
      style={{
        padding: "0 16px",
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Flex align="center" justify="space-between" style={{ width: "100%" }}>
        <div>
          <Image
            src="/logo.png"
            alt="Logo da empresa ReUse"
            width={60}
            preview={false}
          />
        </div>

        <Flex align="center" justify="center" style={{ flex: 1 }}>
          <Menu
            className="custom-menu-spacing"
            mode="horizontal"
            theme="dark"
            selectedKeys={[pathname]}
            onClick={handleMenuClick}
            items={menuItems}
            style={{ borderBottom: "none", height: "30px" }}
          />
        </Flex>

        <div>
          <Space size={8}>
            <Tooltip title="Notificações">
              <Dropdown
                menu={{ items: notifications }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Badge
                  count={notifications.length}
                  overflowCount={99}
                  size="small"
                  offset={[0, 6]}
                >
                  <Button
                    color="primary"
                    variant="filled"
                    icon={<NotificationOutlined />}
                  />
                </Badge>
              </Dropdown>
            </Tooltip>

            <Tooltip title="Meu perfil">
              <Dropdown
                menu={{ items: settings }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar
                  src={user?.avatarUrl}
                  icon={!user?.avatarUrl && <UserOutlined />}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
            </Tooltip>
          </Space>
        </div>
      </Flex>
    </Layout.Header>
  );
}
