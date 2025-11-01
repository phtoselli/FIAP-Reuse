// components/AddressModal.tsx
"use client";

import { useAddressStore } from "@/app/(dashboardLayout)/addresses/store";
import {
	URLControlledModalKeys,
	useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import { getUserId } from "@/utils/auth";
import { Form, Input, Modal, message } from "antd";
import axios from "axios";

export default function CreateAddressModal() {
	const [form] = Form.useForm();

	const userId = getUserId();

	const { isOpen: isCreateAddressModalOpen, close } = useURLControlledModal(
		URLControlledModalKeys.CREATE_ADDRESS_MODAL
	);

	const { getAllAddresses } = useAddressStore();

	const handleSubmit = async (values: any) => {
		try {
			message.loading("Cadastrando endereço...", 0);
			const addressData = {
				...values,
				userId: userId || "6fd9c6b8-8ecd-482b-b321-a7ae05e44dc9",
			};

			await axios.post("/api/enderecos", addressData);

			message.destroy();
			message.success("Endereço cadastrado com sucesso!");
			getAllAddresses(userId);
			window.dispatchEvent(new Event("addressesUpdated"));
			close();
		} catch (error: any) {
			message.error(error.response?.data?.error || "Erro ao salvar endereço");
		}
	};

	return (
		<>
			<Modal
				title="Adicionar Endereço"
				open={isCreateAddressModalOpen}
				onCancel={close}
				onOk={() => form.submit()}
				okText="Adicionar Endereço"
				cancelText="Cancelar"
				width={600}
			>
				<Form
					form={form}
					layout="vertical"
					onFinish={handleSubmit}
					initialValues={{ country: "Brasil" }}
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
				</Form>
			</Modal>
		</>
	);
}
