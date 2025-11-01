"use client";

import ContentLayout from "@/components/ContentLayout";
import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { getUserId } from "@/utils/auth";
import {
	DeleteOutlined,
	EditOutlined,
	EnvironmentOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import {
	Button,
	Card,
	Form,
	Input,
	List,
	message,
	Modal,
	Popconfirm,
	Space,
	Spin,
	Typography,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAddressStore } from "./store";

const { Text } = Typography;

interface Address {
	id: string;
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
}

export default function AddressesPage() {
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [form] = Form.useForm();

	const userId = getUserId();

	const { open: openCreateAddressModal } = useURLControlledModal(
		URLControlledModalKeys.CREATE_ADDRESS_MODAL
	);

	const { addresses, isLoading, getAllAddresses } = useAddressStore();

	const handleSubmit = async (values: any) => {
		try {
			setLoading(true);

			const addressData = {
				...values,
				userId: userId || "6fd9c6b8-8ecd-482b-b321-a7ae05e44dc9",
				fullAddress: `${values.street} - ${values.city}, ${values.state} - ${values.zipCode}`,
			};

			if (editingAddress) {
				await axios.put(`/api/enderecos/${editingAddress.id}`, addressData);
				message.success("Endereço atualizado com sucesso!");
			} else {
				await axios.post("/api/enderecos", addressData);
				message.success("Endereço cadastrado com sucesso!");
			}

			setModalVisible(false);
			setEditingAddress(null);
			form.resetFields();
			getAllAddresses(userId);
		} catch (error: any) {
			console.error("Erro ao salvar endereço:", error);
			message.error(error.response?.data?.error || "Erro ao salvar endereço");
		} finally {
			setLoading(false);
		}
	};

	const handleEdit = (address: Address) => {
		setEditingAddress(address);
		form.setFieldsValue(address);
		setModalVisible(true);
	};

	const handleDelete = async (addressId: string) => {
		try {
			setLoading(true);
			await axios.delete(`/api/enderecos/${addressId}`);
			message.success("Endereço removido com sucesso!");
			getAllAddresses(userId);
		} catch (error: any) {
			console.error("Erro ao deletar endereço:", error);
			message.error(error.response?.data?.error || "Erro ao remover endereço");
		} finally {
			setLoading(false);
		}
	};

	const handleAddNew = () => {
		form.resetFields();
		setEditingAddress(null);
		openCreateAddressModal();
	};

	useEffect(() => {
		getAllAddresses(userId);
	}, [userId]);

	return (
		<ContentLayout title="Meus Endereços">
			<Card>
				<div style={{ marginBottom: 24 }}>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleAddNew}
						size="large"
					>
						Adicionar Endereço
					</Button>
				</div>

				{isLoading ? (
					<div style={{ textAlign: "center", padding: "40px" }}>
						<Spin size="large" />
					</div>
				) : (
					<List
						dataSource={addresses}
						locale={{ emptyText: "Nenhum endereço cadastrado" }}
						renderItem={(address) => (
							<List.Item
								actions={[
									<Button
										key="edit"
										type="link"
										icon={<EditOutlined />}
										onClick={() => handleEdit(address)}
									>
										Editar
									</Button>,
									<Popconfirm
										key="delete"
										title="Remover endereço?"
										description="Esta ação não pode ser desfeita."
										onConfirm={() => handleDelete(address.id)}
										okText="Sim"
										cancelText="Não"
									>
										<Button type="link" danger icon={<DeleteOutlined />}>
											Remover
										</Button>
									</Popconfirm>,
								]}
							>
								<List.Item.Meta
									avatar={
										<EnvironmentOutlined
											style={{ fontSize: "24px", color: "#1890ff" }}
										/>
									}
									title={
										<Space>
											<Text strong>{address.street}</Text>
										</Space>
									}
									description={
										<Space direction="vertical" size={4}>
											<Text type="secondary">
												📍 {address.city}, {address.state}
											</Text>
											<Text type="secondary">📮 CEP: {address.zipCode}</Text>
										</Space>
									}
								/>
							</List.Item>
						)}
					/>
				)}
			</Card>

			<Modal
				title={editingAddress ? "Editar Endereço" : "Adicionar Endereço"}
				open={modalVisible}
				onCancel={() => {
					setModalVisible(false);
					setEditingAddress(null);
					form.resetFields();
				}}
				footer={null}
				width={600}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					initialValues={{
						country: "Brasil",
					}}
				>
					<Form.Item
						name="street"
						label="Endereço Completo"
						rules={[{ required: true, message: "Endereço é obrigatório" }]}
					>
						<Input placeholder="Rua, número, apartamento, etc." />
					</Form.Item>

					<Form.Item
						name="city"
						label="Cidade"
						rules={[{ required: true, message: "Cidade é obrigatória" }]}
					>
						<Input placeholder="Cidade" />
					</Form.Item>

					<Form.Item
						name="state"
						label="Estado"
						rules={[{ required: true, message: "Estado é obrigatório" }]}
					>
						<Input placeholder="Estado" />
					</Form.Item>

					<Form.Item
						name="zipCode"
						label="CEP"
						rules={[
							{ required: true, message: "CEP é obrigatório" },
							{
								pattern: /^\d{5}-?\d{3}$/,
								message: "CEP deve ter formato 00000-000",
							},
						]}
					>
						<Input placeholder="00000-000" />
					</Form.Item>

					<Form.Item
						name="country"
						label="País"
						rules={[{ required: true, message: "País é obrigatório" }]}
					>
						<Input placeholder="País" />
					</Form.Item>

					<Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
						<Space>
							<Button onClick={() => setModalVisible(false)}>Cancelar</Button>
							<Button type="primary" htmlType="submit" loading={loading}>
								{editingAddress ? "Atualizar" : "Cadastrar"}
							</Button>
						</Space>
					</Form.Item>
				</Form>
			</Modal>
		</ContentLayout>
	);
}
