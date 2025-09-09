import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/service/products/ProductService";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  /**
   * GET /api/produtos/:id - Busca produto por ID
   */
  async getProductById(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await context.params; // ✅ await aqui

      if (!id || typeof id !== "string") {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
      }

      // Buscar produto no service
      const produto = await this.productService.getProductById(id);

      // Se não encontrou, retornar 404
      if (!produto) {
        return NextResponse.json(
          { error: "Produto não encontrado" },
          { status: 404 }
        );
      }

      // Retornar produto encontrado
      return NextResponse.json(produto);
    } catch (error) {
      console.error("Erro no controller ao buscar produto:", error);

      // Verificar se é um erro conhecido
      if (error instanceof Error) {
        if (error.message.includes("não encontrado")) {
          return NextResponse.json({ error: error.message }, { status: 404 });
        }
      }

      // Erro interno do servidor
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 }
      );
    }
  }

  /**
   * PUT /api/produtos/:id - Atualiza produto
   */
  async updateProduct(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;
      const body = await request.json();

      // Validação básica
      if (!id || typeof id !== "string") {
        return NextResponse.json(
          { error: "ID do produto é obrigatório" },
          { status: 400 }
        );
      }

      // Atualizar produto
      const produtoAtualizado = await this.productService.updateProduct(
        id,
        body
      );

      return NextResponse.json(produtoAtualizado);
    } catch (error) {
      console.error("Erro no controller ao atualizar produto:", error);

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
   * DELETE /api/produtos/:id - Desativa produto (soft delete)
   */
  async deactivateProduct(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { id } = params;

      // Validação básica
      if (!id || typeof id !== "string") {
        return NextResponse.json(
          { error: "ID do produto é obrigatório" },
          { status: 400 }
        );
      }

      // Desativar produto
      await this.productService.deactivateProduct(id);

      return NextResponse.json(
        { message: "Produto desativado com sucesso" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erro no controller ao desativar produto:", error);

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
}
