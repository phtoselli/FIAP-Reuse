/* eslint-disable @typescript-eslint/no-explicit-any */
import { PostRepository } from "@/database/repositories/post.repository";
import {
	ProductCreateModel,
	ProductModel,
	ProductUpdateModel,
} from "@/types/product/ProductModel";
import { categoriesOptions } from "@/utils/categories";
import { conditionOptions } from "@/utils/conditions";

export class ProductService {
	private postRepository: PostRepository;

	constructor() {
		this.postRepository = new PostRepository();
	}

	/**
	 * Busca um produto por ID
	 * @param id - ID único do produto
	 * @returns Produto encontrado ou null se não existir
	 */
	async getProductById(id: string): Promise<ProductModel | null> {
		try {
			const post = await this.postRepository.findById(id);

			if (!post) {
				return null;
			}

			return this.mapPostToProductModel(post);
		} catch (error) {
			console.error("Erro ao buscar produto por ID:", error);
			throw new Error("Erro interno ao buscar produto");
		}
	}

	/**
	 * Lista todos os produtos ativos
	 * @returns Lista de produtos ativos
	 */
	async getAllActiveProducts(): Promise<ProductModel[]> {
		try {
			const posts = await this.postRepository.findAll();

			return posts
				.filter((post) => post.isActive)
				.map((post) => this.mapPostToProductModel(post));
		} catch (error) {
			console.error("Erro ao listar produtos:", error);
			throw new Error("Erro interno ao listar produtos");
		}
	}

	/**
	 * Lista produtos por categoria
	 * @param categoryId - ID da categoria
	 * @param activeOnly - Se deve retornar apenas produtos ativos
	 * @returns Lista de produtos da categoria
	 */
	async getProductsByCategory(
		categoryId: string,
		activeOnly: boolean = true
	): Promise<ProductModel[]> {
		try {
			const posts = await this.postRepository.findByCategory(
				categoryId,
				activeOnly
			);
			return posts.map((post) => this.mapPostToProductModel(post));
		} catch (error) {
			console.error("Erro ao listar produtos por categoria:", error);
			throw new Error("Erro interno ao listar produtos por categoria");
		}
	}

	/**
	 * Lista produtos com filtros avançados
	 * @param filters - Filtros aplicados
	 * @returns Lista de produtos filtrados com informações de paginação
	 */
	async getProductsWithFilters(filters: {
		categoryId?: string;
		activeOnly?: boolean;
		limit?: number;
		offset?: number;
	}): Promise<{
		products: ProductModel[];
		total: number;
		limit: number;
		offset: number;
		hasMore: boolean;
	}> {
		try {
			const { limit, offset, ...countFilters } = filters;

			// Não convertemos para string
			const filtersForRepo = { ...countFilters };

			// Buscar produtos com filtros
			const posts = await this.postRepository.findWithFilters(filtersForRepo);

			const total = await this.postRepository.countWithFilters(filtersForRepo);

			const currentLimit = limit || posts.length;
			const currentOffset = offset || 0;
			const hasMore = currentOffset + currentLimit < total;

			return {
				products: posts.map((post) => this.mapPostToProductModel(post)),
				total,
				limit: currentLimit,
				offset: currentOffset,
				hasMore,
			};
		} catch (error) {
			console.error("Erro ao listar produtos com filtros:", error);
			throw new Error("Erro interno ao listar produtos com filtros");
		}
	}

	/**
	 * Lista produtos sem categoria específica (todos)
	 * @param activeOnly - Se deve retornar apenas produtos ativos
	 * @param limit - Limite de produtos por página
	 * @param offset - Número de produtos para pular
	 * @returns Lista de produtos sem filtro de categoria
	 */
	async getProductsWithoutCategoryFilter(
		activeOnly: boolean = true,
		limit?: number,
		offset?: number
	): Promise<{
		products: ProductModel[];
		total: number;
		limit: number;
		offset: number;
		hasMore: boolean;
	}> {
		try {
			const posts = await this.postRepository.findWithFilters({
				activeOnly,
				limit,
				offset,
			});

			const total = await this.postRepository.countWithFilters({ activeOnly });

			const currentLimit = limit || posts.length;
			const currentOffset = offset || 0;
			const hasMore = currentOffset + currentLimit < total;

			return {
				products: posts.map((post) => this.mapPostToProductModel(post)),
				total,
				limit: currentLimit,
				offset: currentOffset,
				hasMore,
			};
		} catch (error) {
			console.error("Erro ao listar produtos sem filtro de categoria:", error);
			throw new Error(
				"Erro interno ao listar produtos sem filtro de categoria"
			);
		}
	}

	/**
	 * Cria um novo produto
	 * @param productData - Dados do produto a ser criado
	 * @returns Produto criado
	 */
	async createProduct(productData: ProductCreateModel): Promise<ProductModel> {
		const post = await this.postRepository.create({
			isActive: true,
			title: productData.title,
			description: productData.description ?? "",
			image: productData.image ?? "",
			categoryId: productData.categoryId ?? "1",
			conditionId: productData.conditionId ?? "1",
			userId: productData.userId,
			rating: Number(productData.rating) ?? 0,
		});

		const createdPost = await this.postRepository.findById(post.id);
		if (!createdPost) throw new Error("Erro ao criar produto");

		return this.mapPostToProductModel(createdPost);
	}

	/**
	 * Atualiza um produto existente
	 * @param id - ID do produto
	 * @param productData - Dados a serem atualizados
	 * @returns Produto atualizado
	 */
	async updateProduct(
		id: string,
		productData: ProductUpdateModel
	): Promise<ProductModel> {
		try {
			// Verificar se o produto existe
			const existingProduct = await this.postRepository.findById(id);
			if (!existingProduct) {
				throw new Error("Produto não encontrado");
			}

			// Preparar dados para atualização
			const updateData: any = {};
			if (productData.title) updateData.title = productData.title;
			if (productData.description !== undefined)
				updateData.description = productData.description;
			if (productData.image !== undefined) updateData.image = productData.image;
			if (productData.categoryId !== undefined)
				updateData.categoryId = String(productData.categoryId);
			if (productData.conditionId !== undefined)
				updateData.conditionId = String(productData.conditionId);
			if (productData.isActive !== undefined)
				updateData.isActive = productData.isActive;
			if (productData.rating !== undefined)
				updateData.rating = Number(productData.rating);

			// Atualizar o produto
			await this.postRepository.update(id, updateData);

			// Buscar o produto atualizado
			const updatedPost = await this.postRepository.findById(id);

			if (!updatedPost) {
				throw new Error("Erro ao atualizar produto");
			}

			return this.mapPostToProductModel(updatedPost);
		} catch (error) {
			console.error("Erro ao atualizar produto:", error);
			throw new Error("Erro interno ao atualizar produto");
		}
	}

	/**
	 * Desativa um produto (soft delete)
	 * @param id - ID do produto
	 * @returns true se desativado com sucesso
	 */
	async deactivateProduct(id: string): Promise<boolean> {
		try {
			const existingProduct = await this.postRepository.findById(id);
			if (!existingProduct) {
				throw new Error("Produto não encontrado");
			}

			await this.postRepository.update(id, { isActive: false });
			return true;
		} catch (error) {
			console.error("Erro ao desativar produto:", error);
			throw new Error("Erro interno ao desativar produto");
		}
	}

	/**
	 * Mapeia um Post do Prisma para ProductModel
	 * @param post - Post do Prisma
	 * @returns ProductModel mapeado
	 */
	private mapPostToProductModel(post: any): ProductModel {
		return {
			id: post.id,
			name: post.title,
			description: post.description || null,
			image: post.image || null,
			rating: post.rating !== undefined ? Number(post.rating) : null,
			isActive: post.isActive,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
			user: {
				id: post.user.id,
				name: post.user.name,
				city: post.user.city || null,
				state: post.user.state || null,
				avatarUrl: post.user.avatarUrl || null,
			},
			category: {
				id: post.categoryId,
				name:
					categoriesOptions.find((cat) => cat.value === post.categoryId)
						?.label || "Outros",
				description: null,
			},

			condition: {
				id: post.conditionId,
				name:
					conditionOptions.find((cat) => cat.value === post.conditionId)
						?.label || "Outros",
				description: null,
			},
		};
	}
}
