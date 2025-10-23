/**
 * Criar 5 propostas pendentes usando posts de diferentes usuários
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const create5ProposalsFinal = async () => {
  try {
    console.log('🏗️ Criando 5 propostas pendentes...\n');

    // Buscar usuários existentes
    const users = await prisma.user.findMany({
      take: 3
    });

    if (users.length < 3) {
      console.log('❌ Precisa de pelo menos 3 usuários para criar propostas');
      return;
    }

    const requester = users[0]; // Solicitante (Usuário Teste)
    const responder1 = users[1]; // Respondente 1 (Carol)
    const responder2 = users[2]; // Respondente 2 (Alice)

    console.log(`👤 Solicitante: ${requester.name} (${requester.id})`);
    console.log(`🏪 Respondente 1: ${responder1.name} (${responder1.id})`);
    console.log(`🏪 Respondente 2: ${responder2.name} (${responder2.id})`);

    // Buscar posts de diferentes usuários
    const postsCarol = await prisma.post.findMany({
      where: { userId: responder1.id },
      take: 3
    });

    const postsAlice = await prisma.post.findMany({
      where: { userId: responder2.id },
      take: 2
    });

    const allPosts = [...postsCarol, ...postsAlice];
    console.log(`📦 Posts disponíveis: ${allPosts.length}`);

    const proposals = [];

    // Criar 5 propostas pendentes
    for (let i = 0; i < 5; i++) {
      const post = allPosts[i];
      const responder = post.userId === responder1.id ? responder1 : responder2;
      
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
      console.log(`✅ Proposta ${i + 1} criada: ${proposal.id} (${post.title})`);
    }

    console.log('\n🎉 5 propostas pendentes criadas com sucesso!');
    console.log('\n📋 IDs das propostas para teste:');
    proposals.forEach((proposal, index) => {
      console.log(`${index + 1}. ${proposal.id} - ${proposal.items[0]?.post?.title || 'N/A'} (${proposal.responder.name})`);
    });
    
    console.log('\n🎯 AGORA VOCÊ PODE TESTAR O ACEITE NO CHAT:');
    console.log('1. Acesse: http://localhost:3001/chat');
    console.log('2. Digite: "Quero aceitar a proposta [ID]"');
    console.log('3. Use qualquer um dos IDs acima');
    console.log(`4. Usuário do chat: ${responder1.id} (${responder1.name}) ou ${responder2.id} (${responder2.name})`);

  } catch (error) {
    console.error('❌ Erro ao criar propostas:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

create5ProposalsFinal();
