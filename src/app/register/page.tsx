"use client";

import { Routes } from "@/types/routes";
import { Button, Col, Divider, Flex, Form, Input, Row, theme } from "antd";
import { useForm } from "antd/es/form/Form";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form] = useForm();
  const router = useRouter();
  const { token } = theme.useToken();

  const changeRoute = (route: string) => {
    router.push(route);
  };

  return (
    <Row style={{ height: "100vh" }}>
      <Col span={12} style={{ backgroundColor: token.colorPrimary }}>
        <Flex align="center" justify="center" style={{ height: "100%" }}>
          <Title>ReUse</Title>
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
            <Flex vertical style={{ marginBottom: "24px" }}>
              <Title level={2}>Cadastre-se</Title>
              <Paragraph>
                Preencha os dados abaixo e comece a trocar seus itens agora
                mesmo!
              </Paragraph>
            </Flex>

            <Form form={form} layout="vertical">
              <Row>
                <Col span={24}>
                  <Form.Item name="email" label="E-mail">
                    <Input placeholder="Digite seu e-mail..." />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="password" label="Senha">
                    <Input.Password placeholder="Digite sua senha..." />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="confirmPassword" label="Confirmar Senha">
                    <Input.Password placeholder="Confirme sua senha..." />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Divider style={{ width: "100px" }}>ou</Divider>

            <Button
              color="primary"
              variant="solid"
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
