import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Iniciando seed de dados...');

    // 1. Criar categorias
    const category = await prisma.category.create({
      data: {
        name: 'Eletrônicos',
        description: 'Produtos eletrônicos'
      }
    });

    console.log('Categoria criada:', category.id);

    // 2. Criar subcategoria
    const subcategory = await prisma.subcategory.create({
      data: {
        name: 'Smartphones',
        description: 'Telefones celulares',
        categoryId: category.id
      }
    });

    console.log('Subcategoria criada:', subcategory.id);

    // 3. Criar tipo/condição
    const condition = await prisma.type.create({
      data: {
        code: 'USED',
        type: 'condition',
        description: 'Usado'
      }
    });

    console.log('Condição criada:', condition.id);

    // 4. Criar usuários
    const user1 = await prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@teste.com',
        passwordHash: 'hash123',
        city: 'São Paulo',
        state: 'SP'
      }
    });

    const user2 = await prisma.user.create({
      data: {
        name: 'Maria Santos',
        email: 'maria@teste.com',
        passwordHash: 'hash456',
        city: 'Rio de Janeiro',
        state: 'RJ'
      }
    });

    console.log('Usuários criados:', user1.id, user2.id);

    // 5. Criar posts
    const post1 = await prisma.post.create({
      data: {
        title: 'Smartphone Samsung Galaxy',
        description: 'Smartphone em excelente estado',
        imageUrl: 'https://example.com/phone.jpg',
        userId: user1.id,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        conditionId: condition.id,
        rating: 4.5
      }
    });

    const post2 = await prisma.post.create({
      data: {
        title: 'iPhone 12',
        description: 'iPhone em ótimo estado',
        imageUrl: 'https://example.com/iphone.jpg',
        userId: user2.id,
        categoryId: category.id,
        subcategoryId: subcategory.id,
        conditionId: condition.id,
        rating: 4.8
      }
    });

    console.log('Posts criados:', post1.id, post2.id);

    return NextResponse.json({
      success: true,
      data: {
        users: {
          user1: { id: user1.id, name: user1.name },
          user2: { id: user2.id, name: user2.name }
        },
        posts: {
          post1: { id: post1.id, title: post1.title },
          post2: { id: post2.id, title: post2.title }
        },
        category: { id: category.id, name: category.name },
        subcategory: { id: subcategory.id, name: subcategory.name },
        condition: { id: condition.id, code: condition.code }
      }
    });

  } catch (error) {
    console.error('Erro no seed:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
