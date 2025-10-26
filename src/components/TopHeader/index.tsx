"use client";

import React from "react";
import { Input, Typography, Space } from "antd";
import { EnvironmentOutlined, SearchOutlined, EditOutlined, BellOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function TopHeader() {
  return (
    <div
      style={{
        backgroundColor: "#2A4BA0",
        padding: "16px 20px",
        width: "100%",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          {/* Logo e Tagline */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
              <Text
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Re
              </Text>
              <Text
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#FFD700",
                }}
              >
                Use
              </Text>
            </div>
            <Text
              style={{
                color: "white",
                fontSize: "12px",
                lineHeight: "1.4",
                maxWidth: "300px",
              }}
            >
              Somos a plataforma brasileira de troca de qualquer coisa =)
            </Text>
          </div>

          {/* Campos de Localização e Busca */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* Campo de Localização */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "8px 12px",
                minWidth: "200px",
              }}
            >
              <EnvironmentOutlined style={{ color: "#666", marginRight: "8px" }} />
              <div style={{ flex: 1 }}>
                <Text style={{ color: "#999", fontSize: "12px", display: "block" }}>
                  Local:
                </Text>
                <Text style={{ color: "#000", fontWeight: "bold", fontSize: "14px" }}>
                  Uberlândia/MG
                </Text>
              </div>
              <EditOutlined style={{ color: "#666", cursor: "pointer" }} />
            </div>

            {/* Campo de Busca */}
            <Input
              prefix={<SearchOutlined style={{ color: "#999" }} />}
              placeholder="Busca"
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "none",
                minWidth: "200px",
                height: "40px",
              }}
            />

            {/* Ícone de Notificação */}
            <div style={{ position: "relative", cursor: "pointer" }}>
              <BellOutlined
                style={{
                  color: "white",
                  fontSize: "20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#ff4d4f",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
