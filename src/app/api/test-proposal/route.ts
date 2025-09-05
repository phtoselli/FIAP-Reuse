import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requesterId, responderId, postId } = body;

    console.log('Dados recebidos:', { requesterId, responderId, postId });

    // 1. Verificar se os usuários existem
    const requester = await prisma.user.findUnique({
      where: { id: requesterId }
    });

    const responder = await prisma.user.findUnique({
      where: { id: responderId }
    });

    console.log('Requester encontrado:', !!requester);
    console.log('Responder encontrado:', !!responder);

    if (!requester || !responder) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // 2. Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    console.log('Post encontrado:', !!post);

    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      );
    }

    // 3. Criar a proposta
    const proposal = await prisma.proposal.create({
      data: {
        message: 'Teste de proposta',
        requesterId,
        responderId,
        status: 'pending'
      }
    });

    console.log('Proposta criada:', proposal.id);

    // 4. Criar o item da proposta
    const proposalItem = await prisma.proposalItem.create({
      data: {
        proposalId: proposal.id,
        postId
      }
    });

    console.log('Item da proposta criado:', proposalItem.id);

    // 5. Buscar a proposta completa
    const completeProposal = await prisma.proposal.findUnique({
      where: { id: proposal.id },
      include: {
        requester: true,
        responder: true,
        items: true
      }
    });

    return NextResponse.json({
      success: true,
      proposal: completeProposal
    });

  } catch (error) {
    console.error('Erro no teste:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
