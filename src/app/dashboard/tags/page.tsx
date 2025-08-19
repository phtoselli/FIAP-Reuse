import { Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";

export default function Tags() {
  return (
    <div>
      <Flex align="center" justify="space-between">
        <Title level={3}>Tags</Title>
      </Flex>

      <Divider />
    </div>
  );
}
