import { Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";
import { ReactNode } from "react";
import BreadcrumbRoute from "../BreadcrumbRoute";

interface ContentLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumb?: boolean;
  extra?: ReactNode | ReactNode[];
}

export default function ContentLayout({
  children,
  title,
  breadcrumb,
  extra,
}: ContentLayoutProps) {
  return (
    <div>
      <Flex align="center" justify="space-between">
        <Flex vertical>
          <Title level={3}>{title}</Title>
          {breadcrumb && <BreadcrumbRoute />}
        </Flex>

        {extra && (
          <Flex align="center" gap={8}>
            {extra}
          </Flex>
        )}
      </Flex>

      <Divider />

      <div
        style={{
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
