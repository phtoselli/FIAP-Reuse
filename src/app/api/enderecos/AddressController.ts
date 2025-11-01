import { AddressService } from "@/service/addresses/AddressService";
import { NextRequest, NextResponse } from "next/server";

export class AddressController {
	private addressService: AddressService;

	constructor() {
		this.addressService = new AddressService();
	}

	/**
	 * POST /api/enderecos - Criar novo endereço
	 */
	async createAddress(request: NextRequest) {
		try {
			const body = await request.json();
			const { userId, fullAddress, ...addressData } = body;

			if (!userId) {
				return NextResponse.json(
					{ error: "ID do usuário é obrigatório" },
					{ status: 400 }
				);
			}

			if (
				!addressData.street ||
				!addressData.city ||
				!addressData.state ||
				!addressData.zipCode ||
				!addressData.country
			) {
				return NextResponse.json(
					{ error: "Todos os campos de endereço são obrigatórios" },
					{ status: 400 }
				);
			}

			const novoEndereco = await this.addressService.createAddress({
				...addressData,
				userId,
			});

			return NextResponse.json(novoEndereco, { status: 201 });
		} catch (error) {
			console.error("Erro no controller ao criar endereço:", error);
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * GET /api/enderecos - Listar endereços
	 */
	async getAddresses(request: NextRequest) {
		try {
			const { searchParams } = new URL(request.url);
			const userId = searchParams.get("userId");
			const city = searchParams.get("city");
			const state = searchParams.get("state");
			const country = searchParams.get("country");
			const limit = searchParams.get("limit");
			const offset = searchParams.get("offset");

			const limitNum = limit ? parseInt(limit) : undefined;
			const offsetNum = offset ? parseInt(offset) : undefined;

			let addresses;

			if (userId) {
				// Listar endereços de um usuário específico
				addresses = await this.addressService.getAddressesByUserId(userId);
			} else if (city) {
				// Listar endereços por cidade
				addresses = await this.addressService.getAddressesByCity(city);
			} else if (state) {
				// Listar endereços por estado
				addresses = await this.addressService.getAddressesByState(state);
			} else if (country) {
				// Listar endereços por país
				addresses = await this.addressService.getAddressesByCountry(country);
			} else {
				// Listar todos os endereços com filtros avançados
				const result = await this.addressService.getAddressesWithFilters({
					limit: limitNum,
					offset: offsetNum,
				});

				return NextResponse.json({
					enderecos: result.enderecos,
					total: result.total,
					limit: result.limit,
					offset: result.offset,
					hasMore: result.hasMore,
				});
			}

			return NextResponse.json({
				enderecos: addresses,
				total: addresses.length,
			});
		} catch (error) {
			console.error("Erro no controller ao listar endereços:", error);
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * GET /api/enderecos/:id - Buscar endereço por ID
	 */
	async getAddressById(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) {
		try {
			const { id } = await params;

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID do endereço é obrigatório" },
					{ status: 400 }
				);
			}

			const endereco = await this.addressService.getAddressById(id);

			if (!endereco) {
				return NextResponse.json(
					{ error: "Endereço não encontrado" },
					{ status: 404 }
				);
			}

			return NextResponse.json(endereco);
		} catch (error) {
			console.error("Erro no controller ao buscar endereço:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrado")) {
					return NextResponse.json({ error: error.message }, { status: 404 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * PUT /api/enderecos/:id - Atualizar endereço
	 */
	async updateAddress(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) {
		try {
			const { id } = await params;
			const body = await request.json();
			const { userId, ...updateData } = body;

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID do endereço é obrigatório" },
					{ status: 400 }
				);
			}

			if (!userId) {
				return NextResponse.json(
					{ error: "ID do usuário é obrigatório" },
					{ status: 400 }
				);
			}

			const enderecoAtualizado = await this.addressService.updateAddress(
				id,
				updateData,
				userId
			);

			return NextResponse.json(enderecoAtualizado);
		} catch (error) {
			console.error("Erro no controller ao atualizar endereço:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrado")) {
					return NextResponse.json({ error: error.message }, { status: 404 });
				}
				if (error.message.includes("pode editá-lo")) {
					return NextResponse.json({ error: error.message }, { status: 403 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * DELETE /api/enderecos/:id - Deletar endereço
	 */
	async deleteAddress(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) {
		try {
			const { id } = await params;
			const { searchParams } = new URL(request.url);
			const userId = searchParams.get("userId");

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID do endereço é obrigatório" },
					{ status: 400 }
				);
			}

			if (!userId) {
				return NextResponse.json(
					{ error: "ID do usuário é obrigatório" },
					{ status: 400 }
				);
			}

			await this.addressService.deleteAddress(id, userId);

			return NextResponse.json({ message: "Endereço deletado com sucesso" });
		} catch (error) {
			console.error("Erro no controller ao deletar endereço:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrado")) {
					return NextResponse.json({ error: error.message }, { status: 404 });
				}
				if (error.message.includes("pode deletá-lo")) {
					return NextResponse.json({ error: error.message }, { status: 403 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * GET /api/enderecos/contar/:tipo - Contar endereços por tipo
	 */
	async countAddresses(
		request: NextRequest,
		{ params }: { params: { tipo: string } }
	) {
		try {
			const { tipo } = params;
			const { searchParams } = new URL(request.url);
			const valor = searchParams.get("valor");

			if (!tipo || typeof tipo !== "string") {
				return NextResponse.json(
					{ error: "Tipo de contagem é obrigatório" },
					{ status: 400 }
				);
			}

			let count: number;

			switch (tipo) {
				case "usuario":
					if (!valor) {
						return NextResponse.json(
							{
								error: "Valor (userId) é obrigatório para contagem por usuário",
							},
							{ status: 400 }
						);
					}
					count = await this.addressService.countAddressesByUserId(valor);
					break;

				case "cidade":
					if (!valor) {
						return NextResponse.json(
							{
								error: "Valor (cidade) é obrigatório para contagem por cidade",
							},
							{ status: 400 }
						);
					}
					count = await this.addressService.countAddressesByCity(valor);
					break;

				case "estado":
					if (!valor) {
						return NextResponse.json(
							{
								error: "Valor (estado) é obrigatório para contagem por estado",
							},
							{ status: 400 }
						);
					}
					count = await this.addressService.countAddressesByState(valor);
					break;

				default:
					return NextResponse.json(
						{
							error:
								"Tipo de contagem inválido. Use: usuario, cidade ou estado",
						},
						{ status: 400 }
					);
			}

			return NextResponse.json({
				tipo,
				valor,
				total: count,
			});
		} catch (error) {
			console.error("Erro no controller ao contar endereços:", error);
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}
}
