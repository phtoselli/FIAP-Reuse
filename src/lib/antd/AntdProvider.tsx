"use client";

import { ConfigProvider, theme } from "antd";
import React from "react";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.compactAlgorithm,
        token: {
          borderRadius: 4,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
