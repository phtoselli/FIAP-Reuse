import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/service/products/ProductService";
import fs from "fs";

const productService = new ProductService();

// GET /api/produtos - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const active = searchParams.get("active");

    // Converter parâmetros para números
    const limitNum = limit ? parseInt(limit) : undefined;
    const offsetNum = offset ? parseInt(offset) : undefined;
    const activeOnly = active === "false" ? false : true;

    let result;

    if (categoryId) {
      result = await productService.getProductsWithFilters({
        categoryId,
        subcategoryId: subcategoryId || undefined,
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
    const formData = await request.formData();

    const file = formData.get("imagens");
    let base64String: string | undefined;

    if (file && file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64String = buffer.toString("base64");
    }

    const novoProduto = await productService.createProduct({
      titulo: formData.get("titulo") as string,
      descricao: (formData.get("descricao") as string) || "",
      categoriaId: formData.get("categoriaId") as string,
      subcategoriaId: (formData.get("subcategoriaId") as string) || "",
      condicaoId: (formData.get("condicaoId") as string) || "",
      usuarioId: formData.get("usuarioId") as string,
      avaliacao: Number(formData.get("avaliacao")) || 0,
      imagemUrl: base64String,
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 }
    );
  }
}
