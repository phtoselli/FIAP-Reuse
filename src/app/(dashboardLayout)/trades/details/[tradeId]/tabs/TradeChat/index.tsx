"use client";

import { Button, Card, Empty, Flex, Input, List } from "antd";
import { useState } from "react";

const { TextArea } = Input;

type TradeChatProps = {
	tradeId: string;
};

export default function TradeChat({ tradeId }: TradeChatProps) {
	const [messages, setMessages] = useState<string[]>([]);
	const [input, setInput] = useState("");

	const sendMessage = () => {
		if (!input.trim()) return;
		setMessages((prev) => [...prev, input.trim()]);
		setInput("");
	};

	return (
		<Card title="Chat da Troca" style={{ height: "100%" }}>
			<List
				size="small"
				dataSource={messages}
				style={{
					maxHeight: 300,
					height: 150,
					overflowY: "auto",
					marginBottom: 16,
				}}
				renderItem={(msg, index) => <List.Item key={index}>{msg}</List.Item>}
				locale={{
					emptyText: (
						<Empty
							description="Nenhuma mensagem ainda"
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
					),
				}}
			/>

			<Flex gap={8}>
				<TextArea
					placeholder="Digite uma mensagem..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					autoSize={{ minRows: 1, maxRows: 4 }}
				/>
				<Button type="primary" onClick={sendMessage}>
					Enviar
				</Button>
			</Flex>
		</Card>
	);
}
