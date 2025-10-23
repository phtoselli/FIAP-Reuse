/**
 * Criar 5 propostas pendentes para teste de aceite
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const create5PendingProposals = async () => {
  try {
    console.log('🏗️ Criando 5 propostas pendentes...\n');

    // Buscar usuários existentes
    const users = await prisma.user.findMany({
      take: 2
    });

    if (users.length < 2) {
      console.log('❌ Precisa de pelo menos 2 usuários para criar propostas');
      return;
    }

    const requester = users[0]; // Solicitante
    const responder = users[1]; // Respondente

    console.log(`👤 Solicitante: ${requester.name} (${requester.id})`);
    console.log(`🏪 Respondente: ${responder.name} (${responder.id})`);

    // Buscar posts existentes
    const posts = await prisma.post.findMany({
      where: {
        userId: responder.id // Posts do respondente
      },
      take: 5
    });

    if (posts.length < 5) {
      console.log(`❌ Apenas ${posts.length} posts encontrados. Precisa de 5.`);
      return;
    }

    console.log(`📦 Posts encontrados: ${posts.length}`);

    const proposals = [];

    // Criar 5 propostas pendentes
    for (let i = 0; i < 5; i++) {
      const post = posts[i];
      
      const proposal = await prisma.proposal.create({
        data: {
          message: `Proposta pendente ${i + 1} para teste de aceite via chat`,
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

      proposals.push(proposal);
      console.log(`✅ Proposta ${i + 1} criada: ${proposal.id}`);
    }

    console.log('\n🎉 5 propostas pendentes criadas com sucesso!');
    console.log('\n📋 IDs das propostas para teste:');
    proposals.forEach((proposal, index) => {
      console.log(`${index + 1}. ${proposal.id} - ${proposal.items[0]?.post?.title || 'N/A'}`);
    });
    
    console.log('\n🎯 AGORA VOCÊ PODE TESTAR O ACEITE NO CHAT:');
    console.log('1. Acesse: http://localhost:3001/chat');
    console.log('2. Digite: "Quero aceitar a proposta [ID]"');
    console.log('3. Use qualquer um dos IDs acima');
    console.log(`4. Usuário do chat: ${responder.id} (${responder.name})`);

  } catch (error) {
    console.error('❌ Erro ao criar propostas:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

create5PendingProposals();
