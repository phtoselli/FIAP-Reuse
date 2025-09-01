import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Buscar todos os dados disponíveis
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true }
    });

    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });

    const subcategories = await prisma.subcategory.findMany({
      select: { id: true, name: true, categoryId: true }
    });

    const types = await prisma.type.findMany({
      select: { id: true, code: true, type: true, description: true }
    });

    const posts = await prisma.post.findMany({
      select: { id: true, title: true, userId: true, categoryId: true, subcategoryId: true }
    });

    return NextResponse.json({
      success: true,
      data: {
        users,
        categories,
        subcategories,
        types,
        posts
      }
    });

  } catch (error) {
    console.error('Erro ao buscar IDs:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
