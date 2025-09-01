import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/service/products/ProductService';

const productService = new ProductService();

// GET /api/produtos - Listar todos os produtos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');
    const active = searchParams.get('active');

    // Converter parâmetros para números
    const limitNum = limit ? parseInt(limit) : undefined;
    const offsetNum = offset ? parseInt(offset) : undefined;
    const activeOnly = active === 'false' ? false : true;

    let result;

    if (categoryId) {
      // Se tem categoria, usar filtro por categoria
      result = await productService.getProductsWithFilters({
        categoryId,
        subcategoryId: subcategoryId || undefined,
        activeOnly,
        limit: limitNum,
        offset: offsetNum,
      });
    } else {
      // Se não tem categoria, listar todos sem filtro de categoria
      result = await productService.getProductsWithoutCategoryFilter(
        activeOnly,
        limitNum,
        offsetNum
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/produtos - Criar novo produto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const novoProduto = await productService.createProduct(body);

    return NextResponse.json(novoProduto, { status: 201 });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
