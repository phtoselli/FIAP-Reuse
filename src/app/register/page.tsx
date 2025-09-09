/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RegisterPayload } from "@/database/payloads/user.payload";
import { Routes } from "@/types/routes";
import { setUser } from "@/utils/auth";
import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  message,
  Row,
  theme,
} from "antd";
import { useForm } from "antd/es/form/Form";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form] = useForm();
  const router = useRouter();
  const { token } = theme.useToken();

  const [messageApi, contextHolder] = message.useMessage();

  const changeRoute = (route: string) => {
    router.push(route);
  };

  const doRegister = async (payload: RegisterPayload) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setUser(data.user);

      messageApi.success("Cadastro realizado com sucesso! Boas vindas.");
      changeRoute(Routes.LOGIN);
    } catch (error: any) {
      messageApi.error(error.message || "Erro no cadastro");
    }
  };

  return (
    <Row style={{ height: "100vh" }}>
      {contextHolder}
      <Col span={12} style={{ backgroundColor: token.colorPrimary }}>
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Image
            src="/logo.png"
            alt="Logo da empresa ReUse"
            width={200}
            preview={false}
          />
        </Flex>
      </Col>

      <Col span={12}>
        <Flex
          align="center"
          justify="center"
          vertical
          style={{ height: "100%" }}
        >
          <Flex vertical style={{ width: "320px" }}>
            <Flex vertical style={{ marginBottom: "8px" }}>
              <Title level={2}>Cadastre-se</Title>
              <Paragraph>
                Preencha os dados abaixo e comece a trocar seus itens agora
                mesmo!
              </Paragraph>
            </Flex>

            <Form form={form} layout="vertical" onFinish={doRegister}>
              <Row>
                <Col span={24}>
                  <Form.Item name="name" label="Nome">
                    <Input placeholder="Digite seu nome." />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="email" label="E-mail">
                    <Input placeholder="Digite seu e-mail." />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="password" label="Senha">
                    <Input.Password
                      visibilityToggle
                      placeholder="Digite sua senha."
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Button
                    color="primary"
                    variant="solid"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    Cadastrar-se
                  </Button>
                </Col>
              </Row>
            </Form>

            <Divider style={{ width: "100px" }}>ou</Divider>

            <Button
              color="primary"
              variant="filled"
              onClick={() => changeRoute(Routes.LOGIN)}
            >
              Faça Login
            </Button>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
}
