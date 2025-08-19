import { Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";

export default function Categories() {
  return (
    <div>
      <Flex align="center" justify="space-between">
        <Title level={3}>Categorias</Title>
      </Flex>

      <Divider />
    </div>
  );
}
