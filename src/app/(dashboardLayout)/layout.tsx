"use client";

import React from "react";
import { Layout } from "antd";
import Header from "@/components/Header";
import Script from "next/script";
import VLibras from "@/components/Vlibras";

const { Content } = Layout;

// Declarar para o TS
declare global {
  interface Window {
    VLibras: any;
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Carregando o script do VLibras */}
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.VLibras) {
            new window.VLibras.Widget("https://vlibras.gov.br/app");
          }
        }}
      />

      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Header />
          <Content
            style={{ margin: "8px", background: "#fff", padding: "16px" }}
          >
            {children}
          </Content>
        </Layout>

        <VLibras />
      </Layout>
    </>
  );
}
