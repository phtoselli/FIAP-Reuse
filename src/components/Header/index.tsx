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
  CameraOutlined,
  EditOutlined,
  LockOutlined,
  LogoutOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { Routes } from "@/types/routes";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState<[]>([]);

  const user = {
    id: "123",
    name: "João Silva",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const logout = () => {
    router.push(Routes.LOGIN);
  };

  const goToProfile = () => {
    router.push(`${Routes.USERS}/${user.id}`);
  };

  const changeName = () => {};

  const changePicture = () => {};

  const changePassword = () => {};

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
  };

  const menuItems: MenuProps["items"] = [
    { key: Routes.DASHBOARD, label: "Dashboard" },
    { key: Routes.POSTS, label: "Publicações" },
    { key: Routes.MY_POSTS, label: "Minhas Publicações" },
    { key: Routes.TRADES, label: "Minhas Trocas" },
  ];

  const settings: MenuProps["items"] = [
    {
      key: "changeName",
      label: "Alterar nome",
      icon: <EditOutlined />,
      onClick: changeName,
    },
    {
      key: "changePicture",
      label: "Alterar foto",
      icon: <CameraOutlined />,
      onClick: changePicture,
    },
    {
      key: "changePassword",
      label: "Alterar senha",
      icon: <LockOutlined />,
      onClick: changePassword,
    },
    { type: "divider" },
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
                  src={user.avatar}
                  icon={!user.avatar && <UserOutlined />}
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
