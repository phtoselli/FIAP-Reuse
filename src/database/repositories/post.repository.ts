import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client";

export class PostRepository {
	async create(data: Omit<Post, "id" | "createdAt" | "updatedAt">) {
		return prisma.post.create({ data });
	}

	async findById(id: string) {
		return prisma.post.findUnique({
			where: { id },
			include: {
				user: true,
			},
		});
	}

	async findAll() {
		return prisma.post.findMany({
			include: {
				user: true,
			},
		});
	}

	/**
	 * Busca produtos por categoria
	 * @param categoryId - ID da categoria
	 * @param activeOnly - Se deve retornar apenas produtos ativos
	 * @returns Lista de produtos da categoria
	 */
	async findByCategory(categoryId: string, activeOnly: boolean = true) {
		return prisma.post.findMany({
			where: {
				categoryId,
				...(activeOnly && { isActive: true }),
			},
			include: {
				user: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	/**
	 * Busca produtos com filtros avançados
	 * @param filters - Filtros aplicados
	 * @returns Lista de produtos filtrados
	 */
	async findWithFilters(filters: {
		categoryId?: string;
		activeOnly?: boolean;
		limit?: number;
		offset?: number;
	}) {
		const { categoryId, activeOnly = true, limit, offset } = filters;

		return prisma.post.findMany({
			where: {
				...(categoryId ? { categoryId } : {}),
				...(activeOnly ? { isActive: true } : {}),
			},
			include: { user: true },
			orderBy: { createdAt: "desc" },
			...(limit ? { take: limit } : {}),
			...(offset ? { skip: offset } : {}),
		});
	}

	/**
	 * Conta produtos com filtros
	 * @param filters - Filtros aplicados
	 * @returns Total de produtos que atendem aos filtros
	 */
	async countWithFilters(filters: {
		categoryId?: number;
		activeOnly?: boolean;
	}) {
		const { categoryId, activeOnly = true } = filters;

		return prisma.post.count({
			where: {
				...(categoryId ? { categoryId } : {}),
				...(activeOnly ? { isActive: true } : {}),
			},
		});
	}

	async update(id: string, data: Partial<Post>) {
		return prisma.post.update({ where: { id }, data });
	}

	async delete(id: string) {
		return prisma.post.delete({ where: { id } });
	}

	async deletebyuserid(id: string) {
		return prisma.post.deleteMany({ where: { userId: id } });
	}
}
