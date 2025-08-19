// Header.tsx
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
  FolderOpenOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { Routes } from "@/types/routes";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const notifications: MenuProps["items"] = [
    { key: "1", label: "Mensagem 1" },
    { key: "2", label: "Mensagem 2" },
    { key: "3", label: "Mensagem 3" },
  ];

  const settings: MenuProps["items"] = [
    { key: "changeName", label: "Alterar nome", icon: <EditOutlined /> },
    { key: "changePicture", label: "Alterar foto", icon: <CameraOutlined /> },
    { key: "changePassword", label: "Alterar senha", icon: <LockOutlined /> },
    { type: "divider" },
    { key: "logout", label: "Sair", icon: <LogoutOutlined /> },
  ];

  const menuItems: MenuProps["items"] = [
    { key: Routes.USERS, icon: <TeamOutlined />, label: "Usuários" },
    { key: Routes.POSTS, icon: <FileTextOutlined />, label: "Publicações" },
    { key: Routes.TAGS, icon: <TagsOutlined />, label: "Tags" },
    { key: Routes.REPORTS, icon: <BarChartOutlined />, label: "Relatórios" },
    {
      key: Routes.CATEGORIES,
      icon: <FolderOpenOutlined />,
      label: "Categorias",
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    router.push(e.key);
  };

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
            style={{ borderBottom: "none", flex: 1, height: "40px" }}
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
