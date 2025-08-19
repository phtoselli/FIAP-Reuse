import { Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";

export default function Reports() {
  return (
    <div>
      <Flex align="center" justify="space-between">
        <Title level={3}>Relatórios</Title>
      </Flex>

      <Divider />
    </div>
  );
}
