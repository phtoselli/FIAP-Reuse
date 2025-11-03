import { ProductService } from "@/service/products/ProductService";
import { NextRequest, NextResponse } from "next/server";

const productService = new ProductService();

// GET /api/produtos - Listar todos os produtos
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const limit = searchParams.get("limit");
		const offset = searchParams.get("offset");
		const active = searchParams.get("active");
		const categoryIdParam = searchParams.get("categoryId");

		const limitNum = limit ? parseInt(limit) : undefined;
		const offsetNum = offset ? parseInt(offset) : undefined;
		const activeOnly = active !== "false";
		const validCategoryId = Number(categoryIdParam);

		const categoryId = !isNaN(validCategoryId) ? validCategoryId : undefined;

		let result;

		if (categoryId !== undefined && !isNaN(categoryId)) {
			result = await productService.getProductsWithFilters({
				categoryId,
				activeOnly,
				limit: limitNum,
				offset: offsetNum,
			});
		} else {
			result = await productService.getProductsWithoutCategoryFilter(
				activeOnly,
				limitNum,
				offsetNum
			);
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error("Erro ao listar produtos:", error);
		return NextResponse.json(
			{ error: "Erro interno do servidor" },
			{ status: 500 }
		);
	}
}

// POST /api/produtos - Criar novo produto
export async function POST(request: NextRequest) {
	try {
		const data = await request.json();
		const newProduct = await productService.createProduct({
			title: data.title ?? "Título do produto",
			description: data.description || "Descrição do produto",
			categoryId: data.categoryId ? String(data.categoryId) : "1",
			conditionId: data.conditionId ? String(data.conditionId) : "1",
			userId: data.userId,
			rating: Number(data.rating) || 0,
			image: data.image || "",
		});

		return NextResponse.json(newProduct, { status: 201 });
	} catch (err: any) {
		console.error("Erro ao criar produto:", err);
		return NextResponse.json(
			{ error: "Erro interno", details: err.message },
			{ status: 500 }
		);
	}
}
