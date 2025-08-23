"use client";

import { ConfigProvider, Empty, theme } from "antd";
import React from "react";

export default function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider
      renderEmpty={() => (
        <Empty description="Sem dados" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
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
