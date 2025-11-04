import { ProposalService } from "@/service/proposals/ProposalService";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export class ProposalController {
	private proposalService: ProposalService;

	constructor() {
		this.proposalService = new ProposalService();
	}

	/**
	 * POST /api/propostas - Criar nova proposta
	 */
	async createProposal(request: NextRequest) {
		try {
			const body = await request.json();
			const { requesterId, ...proposalData } = body;

			// Validações básicas
			if (!requesterId || typeof requesterId !== "string") {
				return NextResponse.json(
					{
						error:
							"ID do usuário solicitante é obrigatório e deve ser uma string",
					},
					{ status: 400 }
				);
			}

			if (
				!proposalData.responderId ||
				typeof proposalData.responderId !== "string"
			) {
				return NextResponse.json(
					{
						error:
							"ID do usuário destinatário é obrigatório e deve ser uma string",
					},
					{ status: 400 }
				);
			}

			if (
				!proposalData.items ||
				!Array.isArray(proposalData.items) ||
				proposalData.items.length === 0
			) {
				return NextResponse.json(
					{ error: "A proposta deve conter pelo menos um item" },
					{ status: 400 }
				);
			}

			// Validar se o item tem postId válido
			console.log(proposalData?.items);
			const item = proposalData.items[0];
			if (!item.postId || typeof item.postId !== "string") {
				return NextResponse.json(
					{ error: "ID do post é obrigatório e deve ser uma string" },
					{ status: 400 }
				);
			}

			const novaProposta = await this.proposalService.createProposal(
				proposalData,
				requesterId
			);

			return NextResponse.json(novaProposta, { status: 201 });
		} catch (error) {
			console.error("Erro no controller ao criar proposta:", error);
			if (error instanceof Error) {
				if (
					error.message.includes("deve conter") ||
					error.message.includes("pode conter apenas") ||
					error.message.includes("deve ser uma string")
				) {
					return NextResponse.json({ error: error.message }, { status: 400 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * GET /api/propostas - Listar propostas
	 */
	async getProposals(request: NextRequest) {
		try {
			const { searchParams } = new URL(request.url);
			const userId = searchParams.get("userId");
			const role = searchParams.get("role") as
				| "requester"
				| "responder"
				| undefined;
			const status = searchParams.get("status");

			let proposals;

			if (userId) {
				// Listar propostas de um usuário específico
				proposals = await this.proposalService.getProposalsByUserId(
					userId,
					role || "requester"
				);
			} else if (status) {
				// Listar propostas por status
				proposals = await this.proposalService.getProposalsByStatus(status);
			} else {
				// Listar todas as propostas
				proposals = await this.proposalService.getAllProposals();
			}

			return NextResponse.json({
				propostas: proposals,
				total: proposals.length,
			});
		} catch (error) {
			console.error("Erro no controller ao listar propostas:", error);
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * GET /api/propostas/:id - Buscar proposta por ID
	 */
	async getProposalById(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> } // Mudança 1: params agora é Promise
	) {
		try {
			const { id } = await params; // Mudança 2: await params antes de usar

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID da proposta é obrigatório" },
					{ status: 400 }
				);
			}

			const proposta = await this.proposalService.getProposalById(id);

			if (!proposta) {
				return NextResponse.json(
					{ error: "Proposta não encontrada" },
					{ status: 404 }
				);
			}

			return NextResponse.json(proposta);
		} catch (error) {
			console.error("Erro no controller ao buscar proposta:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrada")) {
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
	 * PUT /api/propostas/:id - Atualizar proposta
	 */
	async updateProposal(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) {
		try {
			const { id } = await params;
			const body = await request.json();
			const { requesterId, ...updateData } = body;

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID da proposta é obrigatório" },
					{ status: 400 }
				);
			}

			if (!requesterId) {
				return NextResponse.json(
					{ error: "ID do usuário solicitante é obrigatório" },
					{ status: 400 }
				);
			}

			const propostaAtualizada = await this.proposalService.updateProposal(
				id,
				updateData,
				requesterId
			);

			return NextResponse.json(propostaAtualizada);
		} catch (error) {
			console.error("Erro no controller ao atualizar proposta:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrada")) {
					return NextResponse.json({ error: error.message }, { status: 404 });
				}
				if (error.message.includes("pode editá-la")) {
					return NextResponse.json({ error: error.message }, { status: 403 });
				}
				if (error.message.includes("pendentes")) {
					return NextResponse.json({ error: error.message }, { status: 400 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * DELETE /api/propostas/:id - Deletar proposta
	 */
	async deleteProposal(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) {
		try {
			const { id } = await params;
			const { searchParams } = new URL(request.url);
			const requesterId = searchParams.get("requesterId");

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID da proposta é obrigatório" },
					{ status: 400 }
				);
			}

			if (!requesterId) {
				return NextResponse.json(
					{ error: "ID do usuário solicitante é obrigatório" },
					{ status: 400 }
				);
			}

			await this.proposalService.deleteProposal(id, requesterId);

			return NextResponse.json({ message: "Proposta deletada com sucesso" });
		} catch (error) {
			console.error("Erro no controller ao deletar proposta:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrada")) {
					return NextResponse.json({ error: error.message }, { status: 404 });
				}
				if (error.message.includes("pode deletá-la")) {
					return NextResponse.json({ error: error.message }, { status: 403 });
				}
				if (error.message.includes("pendentes")) {
					return NextResponse.json({ error: error.message }, { status: 400 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * POST /api/propostas/:id/aceitar - Aceitar proposta
	 */
	async acceptProposal(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) {
		try {
			const { id } = await params;
			const body = await request.json();
			const { responderId } = body;

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID da proposta é obrigatório" },
					{ status: 400 }
				);
			}

			if (!responderId) {
				return NextResponse.json(
					{ error: "ID do usuário destinatário é obrigatório" },
					{ status: 400 }
				);
			}

			const propostaAceita = await this.proposalService.acceptProposal(
				id,
				responderId
			);

			return NextResponse.json({
				message: "Proposta aceita com sucesso",
				proposta: propostaAceita,
			});
		} catch (error) {
			console.error("Erro no controller ao aceitar proposta:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrada")) {
					return NextResponse.json({ error: error.message }, { status: 404 });
				}
				if (error.message.includes("pode aceitá-la")) {
					return NextResponse.json({ error: error.message }, { status: 403 });
				}
				if (error.message.includes("pendentes")) {
					return NextResponse.json({ error: error.message }, { status: 400 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * POST /api/propostas/:id/recusar - Recusar proposta
	 */
	async rejectProposal(
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) {
		try {
			const { id } = await params;
			const body = await request.json();
			const { responderId } = body;

			if (!id || typeof id !== "string") {
				return NextResponse.json(
					{ error: "ID da proposta é obrigatório" },
					{ status: 400 }
				);
			}

			if (!responderId) {
				return NextResponse.json(
					{ error: "ID do usuário destinatário é obrigatório" },
					{ status: 400 }
				);
			}

			const propostaRecusada = await this.proposalService.rejectProposal(
				id,
				responderId
			);

			return NextResponse.json({
				message: "Proposta recusada com sucesso",
				proposta: propostaRecusada,
			});
		} catch (error) {
			console.error("Erro no controller ao recusar proposta:", error);
			if (error instanceof Error) {
				if (error.message.includes("não encontrada")) {
					return NextResponse.json({ error: error.message }, { status: 404 });
				}
				if (error.message.includes("pode recusá-la")) {
					return NextResponse.json({ error: error.message }, { status: 403 });
				}
				if (error.message.includes("pendentes")) {
					return NextResponse.json({ error: error.message }, { status: 400 });
				}
			}
			return NextResponse.json(
				{ error: "Erro interno do servidor" },
				{ status: 500 }
			);
		}
	}

	/**
	 * Finaliza os detalhes de envio de uma proposta já aceita
	 * @param id - ID da proposta
	 * @param shippingData - Dados de envio
	 * @returns Proposta atualizada
	 */
	async finalizeShippingDetails(
		id: string,
		shippingData: { shippingAddress: string; shippingMethod: string }
	) {
		try {
			const result = await this.proposalService.finalizeShippingDetails(
				id,
				shippingData
			);
			return result;
		} catch (error: any) {
			console.error("Erro no controller ao finalizar envio:", error);
			throw new Error(error.message || "Erro interno ao finalizar envio");
		}
	}

	async finalizeShipping(
		proposalId: string,
		shippingData: { shippingAddress: string; shippingMethod: string }
	) {
		return await this.proposalService.finalizeShippingDetails(
			proposalId,
			shippingData
		);
	}

	async create(req: NextApiRequest, res: NextApiResponse) {
		try {
			const requesterId = req.body.requesterId;
			const payload = req.body.proposal;
			const proposal = await this.proposalService.createProposal(
				payload,
				requesterId
			);
			return res.status(201).json(proposal);
		} catch (err: any) {
			return res.status(500).json({ error: err.message || "Erro interno" });
		}
	}

	async getById(id: string) {
		return await this.proposalService.getProposalById(id);
	}

	async accept(id: string, responderId: string) {
		return await this.proposalService.acceptProposal(id, responderId);
	}

	async reject(id: string, responderId: string) {
		return await this.proposalService.rejectProposal(id, responderId);
	}

	async update(id: string, data: any, requesterId: string) {
		return await this.proposalService.updateProposal(id, data, requesterId);
	}

	async delete(id: string, requesterId: string) {
		return await this.proposalService.deleteProposal(id, requesterId);
	}
}
