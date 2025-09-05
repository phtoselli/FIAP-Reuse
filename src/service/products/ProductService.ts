import { PostRepository } from "@/database/repositories/post.repository";
import {
  ProductModel,
  ProductCreateModel,
  ProductUpdateModel,
} from "@/types/product/ProductModel";

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
    subcategoryId?: string;
    activeOnly?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{
    produtos: ProductModel[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }> {
    try {
      const { limit, offset, ...countFilters } = filters;

      // Buscar produtos com filtros
      const posts = await this.postRepository.findWithFilters(filters);

      // Contar total de produtos que atendem aos filtros
      const total = await this.postRepository.countWithFilters(countFilters);

      // Calcular se há mais produtos
      const currentLimit = limit || posts.length;
      const currentOffset = offset || 0;
      const hasMore = currentOffset + currentLimit < total;

      return {
        produtos: posts.map((post) => this.mapPostToProductModel(post)),
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
    produtos: ProductModel[];
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
        produtos: posts.map((post) => this.mapPostToProductModel(post)),
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
    try {
      const post = await this.postRepository.create({
        title: productData.titulo,
        description: productData.descricao ?? "",
        imageUrl: productData.imagemUrl ?? "",
        categoryId: productData.categoriaId,
        subcategoryId: productData.subcategoriaId,
        conditionId: productData.condicaoId,
        userId: productData.usuarioId,
        rating: productData.avaliacao || 0,
        isActive: true,
      });

      // Buscar o post criado com todos os relacionamentos
      const createdPost = await this.postRepository.findById(post.id);

      if (!createdPost) {
        throw new Error("Erro ao criar produto");
      }

      return this.mapPostToProductModel(createdPost);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      throw new Error("Erro interno ao criar produto");
    }
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
      if (productData.titulo) updateData.title = productData.titulo;
      if (productData.descricao !== undefined)
        updateData.description = productData.descricao;
      if (productData.imagemUrl !== undefined)
        updateData.imageUrl = productData.imagemUrl;
      if (productData.categoriaId)
        updateData.categoryId = productData.categoriaId;
      if (productData.subcategoriaId)
        updateData.subcategoryId = productData.subcategoriaId;
      if (productData.condicaoId !== undefined)
        updateData.conditionId = productData.condicaoId;
      if (productData.ativo !== undefined)
        updateData.isActive = productData.ativo;
      if (productData.avaliacao !== undefined)
        updateData.rating = productData.avaliacao;

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
      nome: post.title,
      descricao: post.description,
      imagem: post.imageUrl,
      avaliacao: post.rating,
      ativo: post.isActive,
      dataCriacao: post.createdAt,
      dataAtualizacao: post.updatedAt,
      usuario: {
        id: post.user.id,
        nome: post.user.name,
        cidade: post.user.city,
        estado: post.user.state,
        avatarUrl: post.user.avatarUrl,
      },
      categoria: {
        id: post.category.id,
        nome: post.category.name,
        descricao: post.category.description,
      },
      subcategoria: {
        id: post.subcategory.id,
        nome: post.subcategory.name,
        descricao: post.subcategory.description,
      },
      condicao: post.condition
        ? {
            id: post.condition.id,
            codigo: post.condition.code,
            tipo: post.condition.type,
            descricao: post.condition.description,
          }
        : null,
    };
  }
}
