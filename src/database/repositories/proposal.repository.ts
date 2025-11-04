import { prisma } from "@/lib/prisma";

export class ProposalRepository {
	/**
	 * Cria uma nova proposta
	 */
	async create(data: any): Promise<any> {
		return prisma.proposal.create({ data });
	}

	/**
	 * Busca uma proposta por ID com todos os relacionamentos
	 */
	async findById(id: string) {
		const proposal = await prisma.proposal.findUnique({
			where: { id },
			include: {
				requester: true,
				responder: true,
				items: true,
			},
		});

		if (!proposal) {
			return null;
		}

		// Buscar os posts dos itens separadamente
		const itemsWithPosts = await Promise.all(
			proposal.items.map(async (item: any) => {
				const post = await prisma.post.findUnique({
					where: { id: item.postId },
					include: {
						user: true,
						tradeItems: true,
					},
				});

				return {
					...item,
					post,
				};
			})
		);

		return {
			...proposal,
			items: itemsWithPosts,
		};
	}

	/**
	 * Lista todas as propostas com relacionamentos
	 */
	async findAll() {
		const proposals = await prisma.proposal.findMany({
			include: {
				requester: true,
				responder: true,
				items: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Buscar os posts dos itens para cada proposta
		const proposalsWithPosts = await Promise.all(
			proposals.map(async (proposal: any) => {
				const itemsWithPosts = await Promise.all(
					proposal.items.map(async (item: any) => {
						const post = await prisma.post.findUnique({
							where: { id: item.postId },
							include: {
								user: true,
								tradeItems: true,
							},
						});

						return {
							...item,
							post,
						};
					})
				);

				return {
					...proposal,
					items: itemsWithPosts,
				};
			})
		);

		return proposalsWithPosts;
	}

	/**
	 * Busca propostas por usuário (requester ou responder)
	 */
	async findByUserId(
		userId: string,
		role: "requester" | "responder" = "requester"
	) {
		const where =
			role === "requester" ? { requesterId: userId } : { responderId: userId };

		const proposals = await prisma.proposal.findMany({
			where,
			include: {
				requester: true,
				responder: true,
				items: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Buscar os posts dos itens para cada proposta
		const proposalsWithPosts = await Promise.all(
			proposals.map(async (proposal: any) => {
				const itemsWithPosts = await Promise.all(
					proposal.items.map(async (item: any) => {
						const post = await prisma.post.findUnique({
							where: { id: item.postId },
							include: {
								user: true,
								tradeItems: true,
							},
						});

						return {
							...item,
							post,
						};
					})
				);

				return {
					...proposal,
					items: itemsWithPosts,
				};
			})
		);

		return proposalsWithPosts;
	}

	/**
	 * Busca propostas por status
	 */
	async findByStatus(status: string) {
		const proposals = await prisma.proposal.findMany({
			where: { status },
			include: {
				requester: true,
				responder: true,
				items: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		// Buscar os posts dos itens para cada proposta
		const proposalsWithPosts = await Promise.all(
			proposals.map(async (proposal: any) => {
				const itemsWithPosts = await Promise.all(
					proposal.items.map(async (item: any) => {
						const post = await prisma.post.findUnique({
							where: { id: item.postId },
							include: {
								user: true,
								tradeItems: true,
							},
						});

						return {
							...item,
							post,
						};
					})
				);

				return {
					...proposal,
					items: itemsWithPosts,
				};
			})
		);

		return proposalsWithPosts;
	}

	/**
	 * Atualiza uma proposta
	 */
	async update(id: string, data: any): Promise<any> {
		return prisma.proposal.update({ where: { id }, data });
	}

	/**
	 * Deleta uma proposta
	 */
	async delete(id: string): Promise<any> {
		return prisma.proposal.delete({ where: { id } });
	}

	/**
	 * Cria itens de proposta
	 */
	async createItems(items: Omit<any, "id">[]): Promise<any[]> {
		await prisma.proposalItem.createMany({
			data: items,
		});

		// Retorna os itens criados
		return prisma.proposalItem.findMany({
			where: {
				proposalId: items[0].proposalId,
			},
		});
	}

	/**
	 * Atualiza o status de uma proposta
	 */
	async updateStatus(
		id: string,
		status: "pending" | "accepted" | "rejected"
	): Promise<any> {
		return prisma.proposal.update({
			where: { id },
			data: { status },
		});
	}

	/**
	 * Conta propostas por status
	 */
	async countByStatus(status?: string): Promise<number> {
		const where = status ? { status } : {};
		return prisma.proposal.count({ where });
	}

	/**
	 * Conta propostas por usuário
	 */
	async countByUserId(
		userId: string,
		role: "requester" | "responder" = "requester"
	): Promise<number> {
		const where =
			role === "requester" ? { requesterId: userId } : { responderId: userId };

		return prisma.proposal.count({ where });
	}

	/**
	 * Atualiza os detalhes de envio de uma proposta
	 */
	async updateShippingDetails(
		id: string,
		shippingData: { shippingAddress: string; shippingMethod: string }
	): Promise<any> {
		console.log("🔍 Repository - Atualizando detalhes de envio:", {
			id,
			shippingData,
		});

		try {
			const result = await prisma.proposal.update({
				where: { id },
				data: {
					shippingAddress: shippingData.shippingAddress,
					shippingMethod: shippingData.shippingMethod,
					updatedAt: new Date(),
				},
			});

			console.log("🔍 Repository - Resultado da atualização:", result);
			return result;
		} catch (error) {
			console.error("🔍 Repository - Erro ao atualizar:", error);
			throw error;
		}
	}
}

// import { prisma } from "@/lib/prisma";

// export class ProposalRepository {
// 	async create(data: {
// 		message?: string | null;
// 		requesterId: string;
// 		responderId: string;
// 		status?: string;
// 	}) {
// 		return prisma.proposal.create({
// 			data: {
// 				message: data.message,
// 				requesterId: data.requesterId,
// 				responderId: data.responderId,
// 				status: data.status ?? "pending",
// 			},
// 		});
// 	}

// 	async createItems(
// 		items: { proposalId: string; postId: string; isOffered?: boolean | null }[]
// 	) {
// 		return prisma.proposalItem.createMany({
// 			data: items.map((it) => ({
// 				proposalId: it.proposalId,
// 				postId: it.postId,
// 				isOffered: it.isOffered ?? false,
// 			})),
// 			skipDuplicates: true,
// 		});
// 	}

// 	async findById(id: string) {
// 		return prisma.proposal.findUnique({
// 			where: { id },
// 			include: {
// 				requester: true,
// 				responder: true,
// 				items: {
// 					include: {
// 						post: {
// 							include: {
// 								// inclua coisas que existam no seu schema; aqui deixo básico
// 								// se houver relações (condition, category) adicione-as
// 							},
// 						},
// 					},
// 				},
// 			},
// 		});
// 	}

// 	async findAll() {
// 		return prisma.proposal.findMany({
// 			orderBy: { createdAt: "desc" },
// 			include: {
// 				requester: true,
// 				responder: true,
// 				items: {
// 					include: { post: true },
// 				},
// 			},
// 		});
// 	}

// 	async findByUserId(
// 		userId: string,
// 		role: "requester" | "responder" = "responder"
// 	) {
// 		const where =
// 			role === "requester" ? { requesterId: userId } : { responderId: userId };

// 		return prisma.proposal.findMany({
// 			where,
// 			orderBy: { createdAt: "desc" },
// 			include: {
// 				requester: true,
// 				responder: true,
// 				items: {
// 					include: { post: true },
// 				},
// 			},
// 		});
// 	}

// 	async findByStatus(status: string) {
// 		return prisma.proposal.findMany({
// 			where: { status },
// 			orderBy: { createdAt: "desc" },
// 			include: {
// 				requester: true,
// 				responder: true,
// 				items: { include: { post: true } },
// 			},
// 		});
// 	}

// 	async updateStatus(id: string, status: string) {
// 		return prisma.proposal.update({
// 			where: { id },
// 			data: { status },
// 		});
// 	}

// 	async updateShippingDetails(
// 		id: string,
// 		shippingData: { shippingAddress: string; shippingMethod: string }
// 	) {
// 		return prisma.proposal.update({
// 			where: { id },
// 			data: {
// 				shippingAddress: shippingData.shippingAddress,
// 				shippingMethod: shippingData.shippingMethod,
// 			},
// 		});
// 	}

// 	async update(id: string, data: Partial<Record<string, any>>) {
// 		return prisma.proposal.update({
// 			where: { id },
// 			data,
// 		});
// 	}

// 	async delete(id: string) {
// 		await prisma.proposalItem.deleteMany({ where: { proposalId: id } });
// 		return prisma.proposal.delete({ where: { id } });
// 	}
// }
