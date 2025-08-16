"use client";

import { useRouter } from "next/navigation";

import {
  Badge,
  Button,
  Dropdown,
  Flex,
  Layout,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { NotificationOutlined, SettingOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function Header() {
  const router = useRouter();

  const [notifications] = useState([
    { key: "1", label: "Nova mensagem recebida" },
    { key: "2", label: "Atualização disponível" },
    { key: "3", label: "Backup concluído" },
  ]);

  const changeRoute = (route: string) => {
    router.push(route);
  };

  return (
    <Layout.Header style={{ background: "#fff", padding: "0 16px" }}>
      <Flex
        align="center"
        justify="space-between"
        style={{ width: "100%", height: "100%" }}
      >
        <Typography.Title level={4}>Reuse</Typography.Title>

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
                  color="default"
                  variant="filled"
                  icon={<NotificationOutlined />}
                />
              </Badge>
            </Dropdown>
          </Tooltip>

          <Tooltip title="Configurações">
            <Button
              color="default"
              variant="filled"
              icon={<SettingOutlined />}
              onClick={() => changeRoute("/dashboard/settings")}
            />
          </Tooltip>
        </Space>
      </Flex>
    </Layout.Header>
  );
}
