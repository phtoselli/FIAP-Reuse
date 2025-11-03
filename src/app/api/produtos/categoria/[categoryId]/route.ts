import { ProductService } from "@/service/products/ProductService";
import { NextRequest, NextResponse } from "next/server";

const productService = new ProductService();

// GET /api/produtos/categoria/:categoryId - Listar produtos por categoria
export async function GET(
	request: NextRequest,
	{ params }: { params: { categoryId: string } }
) {
	try {
		const { categoryId } = params;
		const { searchParams } = new URL(request.url);

		const limit = searchParams.get("limit");
		const offset = searchParams.get("offset");
		const active = searchParams.get("active");

		// Converter parâmetros para números
		const limitNum = limit ? parseInt(limit) : undefined;
		const offsetNum = offset ? parseInt(offset) : undefined;
		const activeOnly = active === "false" ? false : true;

		if (!categoryId || typeof categoryId !== "string") {
			return NextResponse.json(
				{ error: "ID da categoria é obrigatório" },
				{ status: 400 }
			);
		}

		const result = await productService.getProductsWithFilters({
			categoryId,
			activeOnly,
			limit: limitNum,
			offset: offsetNum,
		});

		return NextResponse.json(result);
	} catch (error) {
		console.error("Erro ao listar produtos por categoria:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 }
		);
	}
}
