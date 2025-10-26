"use client";

import React from "react";
import {
  Typography,
  Input,
  Button,
  Row,
  Col,
  Space,
  Divider,
} from "antd";
import {
  MailOutlined,
  TwitterOutlined,
  FacebookOutlined,
  InstagramOutlined,
  GithubOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Footer() {
  return (
    <div style={{ marginTop: "auto" }}>
      {/* Newsletter Section */}
      <div
        style={{
          backgroundColor: "#2A4BA0",
          padding: "40px 0",
          borderRadius: "12px",
          margin: "20px 0",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} md={12}>
              <Title
                level={2}
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                Assine nossa newsletter e fique por dentro das novidades
              </Title>
            </Col>
            <Col xs={24} md={8}>
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Enter your email address"
                  style={{ borderRadius: "8px 0 0 8px" }}
                />
                <Button
                  type="primary"
                  style={{
                    backgroundColor: "#f0f0f0",
                    borderColor: "#d9d9d9",
                    color: "#000",
                    borderRadius: "0 8px 8px 0",
                    fontWeight: "bold",
                  }}
                >
                  Assinar
                </Button>
              </Space.Compact>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main Footer */}
      <div style={{ backgroundColor: "#f5f5f5", padding: "40px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <Row gutter={[32, 32]}>
            {/* Brand Column */}
            <Col xs={24} md={6}>
              <div>
                <Title
                  level={2}
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontWeight: "bold",
                  }}
                >
                  <span style={{ color: "#2A4BA0" }}>Re</span>
                  <span style={{ color: "#FFD700" }}>Use</span>
                </Title>
                <Text
                  style={{
                    color: "#666",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    display: "block",
                    marginTop: "12px",
                  }}
                >
                  We have clothes that suits your style and which you're proud to
                  wear. From women to men.
                </Text>
                <Space size="middle" style={{ marginTop: "20px" }}>
                  <Button
                    type="text"
                    icon={<TwitterOutlined />}
                    style={{
                      backgroundColor: "#000",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <Button
                    type="text"
                    icon={<FacebookOutlined />}
                    style={{
                      backgroundColor: "#000",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <Button
                    type="text"
                    icon={<InstagramOutlined />}
                    style={{
                      backgroundColor: "#000",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <Button
                    type="text"
                    icon={<GithubOutlined />}
                    style={{
                      backgroundColor: "#000",
                      color: "white",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                </Space>
              </div>
            </Col>

            {/* Company Column */}
            <Col xs={12} md={4}>
              <div>
                <Title level={5} style={{ color: "#333", marginBottom: "16px" }}>
                  COMPANY
                </Title>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    About
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Features
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Works
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Career
                  </Text>
                </div>
              </div>
            </Col>

            {/* Help Column */}
            <Col xs={12} md={4}>
              <div>
                <Title level={5} style={{ color: "#333", marginBottom: "16px" }}>
                  HELP
                </Title>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Customer Support
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Delivery Details
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Terms & Conditions
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Privacy Policy
                  </Text>
                </div>
              </div>
            </Col>

            {/* FAQ Column */}
            <Col xs={12} md={4}>
              <div>
                <Title level={5} style={{ color: "#333", marginBottom: "16px" }}>
                  FAQ
                </Title>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Account
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Manage Deliveries
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Orders
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Payments
                  </Text>
                </div>
              </div>
            </Col>

            {/* Resources Column */}
            <Col xs={12} md={4}>
              <div>
                <Title level={5} style={{ color: "#333", marginBottom: "16px" }}>
                  RESOURCES
                </Title>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Free eBooks
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Development Tutorial
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    How to - Blog
                  </Text>
                  <Text style={{ color: "#666", fontSize: "14px", cursor: "pointer" }}>
                    Youtube Playlist
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: "32px 0 16px 0" }} />

          {/* Copyright */}
          <div style={{ textAlign: "left" }}>
            <Text style={{ color: "#666", fontSize: "14px" }}>
              ReUse - Todos os direitos reservados.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
