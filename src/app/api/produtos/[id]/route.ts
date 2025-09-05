import { NextRequest, NextResponse } from 'next/server';
import { ProductController } from './ProductController';

const productController = new ProductController();

// GET /api/produtos/:id - Buscar produto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return productController.getProductById(request, { params });
}

// PUT /api/produtos/:id - Atualizar produto
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return productController.updateProduct(request, { params });
}

// DELETE /api/produtos/:id - Desativar produto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return productController.deactivateProduct(request, { params });
}
