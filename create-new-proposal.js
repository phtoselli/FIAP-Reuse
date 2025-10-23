/**
 * Criar uma nova proposta para testar o aceite
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createNewProposal = async () => {
  try {
    console.log('🏗️ Criando nova proposta para teste...\n');

    // Buscar usuários existentes
    const users = await prisma.user.findMany({
      take: 2
    });

    if (users.length < 2) {
      console.log('❌ Precisa de pelo menos 2 usuários para criar uma proposta');
      return;
    }

    const requester = users[0]; // Solicitante
    const responder = users[1]; // Respondente

    console.log(`👤 Solicitante: ${requester.name} (${requester.id})`);
    console.log(`🏪 Respondente: ${responder.name} (${responder.id})`);

    // Buscar um post existente
    const post = await prisma.post.findFirst({
      where: {
        userId: responder.id // Post do respondente
      }
    });

    if (!post) {
      console.log('❌ Nenhum post encontrado para criar a proposta');
      return;
    }

    console.log(`📦 Post: ${post.title} (${post.id})`);

    // Criar a nova proposta
    const proposal = await prisma.proposal.create({
      data: {
        message: 'Nova proposta de teste para aceite via chat',
        status: 'pending',
        requesterId: requester.id,
        responderId: responder.id,
        items: {
          create: {
            postId: post.id,
            isOffered: true
          }
        }
      },
      include: {
        requester: true,
        responder: true,
        items: true
      }
    });

    console.log('\n✅ Nova proposta criada com sucesso!');
    console.log(`📋 ID da Proposta: ${proposal.id}`);
    console.log(`📝 Status: ${proposal.status}`);
    console.log(`👤 Solicitante: ${proposal.requester.name}`);
    console.log(`🏪 Respondente: ${proposal.responder.name}`);
    console.log(`📦 Itens: ${proposal.items.length} item(s)`);
    
    console.log('\n🎯 Agora você pode testar o aceite via chat!');
    console.log(`💬 Digite no chat: "Quero aceitar a proposta ${proposal.id}"`);
    console.log(`👤 Use o usuário: ${responder.id} (${responder.name})`);

  } catch (error) {
    console.error('❌ Erro ao criar proposta:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

createNewProposal();
