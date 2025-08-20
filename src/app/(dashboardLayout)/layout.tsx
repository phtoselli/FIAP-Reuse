"use client";

import React from "react";

import { Layout } from "antd";
import Header from "@/components/Header";

const { Content } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header />
        <Content style={{ margin: "8px", background: "#fff", padding: "16px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
