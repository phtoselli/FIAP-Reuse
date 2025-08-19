"use-client";

import { Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";

export default function Posts() {
  return (
    <div>
      <Flex align="center" justify="space-between">
        <Title level={3}>Publicações</Title>
      </Flex>

      <Divider />
    </div>
  );
}
