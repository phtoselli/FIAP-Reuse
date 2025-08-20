"use client";

import {
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
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  TagsOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { Routes } from "@/types/routes";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState<[]>([]);

  const logout = () => {
    router.push(Routes.LOGIN);
  };

  const changeName = () => {};

  const changePicture = () => {};

  const changePassword = () => {};

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
  };

  const menuItems: MenuProps["items"] = [
    { key: Routes.USERS, label: "Usuários" },
    { key: Routes.POSTS, label: "Publicações" },
    { key: Routes.MY_POSTS, label: "Minhas Publicações" },
    { key: Routes.REPORTS, label: "Relatórios" },
    { key: Routes.TAGS, label: "Tags" },
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

        <div>
          <Menu
            className="custom-menu-spacing"
            mode="horizontal"
            theme="dark"
            selectedKeys={[pathname]}
            onClick={handleMenuClick}
            items={menuItems}
            style={{ borderBottom: "none", flex: 1, height: "30px" }}
          />
        </div>

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

            <Tooltip title="Configurações">
              <Dropdown
                menu={{ items: settings }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button
                  color="primary"
                  variant="filled"
                  icon={<SettingOutlined />}
                />
              </Dropdown>
            </Tooltip>
          </Space>
        </div>
      </Flex>
    </Layout.Header>
  );
}
