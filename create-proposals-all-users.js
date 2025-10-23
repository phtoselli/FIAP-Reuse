/**
 * Criar propostas pendentes para todos os usuários
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createProposalsAllUsers = async () => {
  try {
    console.log('📋 Criando propostas pendentes para todos os usuários...\n');

    // Buscar todos os usuários
    const users = await prisma.user.findMany();
    console.log(`👥 Usuários encontrados: ${users.length}`);

    // Buscar todos os posts disponíveis
    const posts = await prisma.post.findMany({
      include: {
        user: true
      }
    });
    console.log(`📦 Posts disponíveis: ${posts.length}`);

    if (posts.length < users.length) {
      console.log('❌ Não há posts suficientes para criar propostas para todos os usuários');
      return;
    }

    let totalCreated = 0;
    const proposalsPerUser = 2; // 2 propostas por usuário

    for (let i = 0; i < users.length; i++) {
      const requester = users[i];
      console.log(`\n👤 Processando usuário: ${requester.name} (${requester.id})`);

      // Verificar se o usuário já tem propostas pendentes
      const existingProposals = await prisma.proposal.findMany({
        where: { 
          requesterId: requester.id,
          status: 'pending'
        }
      });

      if (existingProposals.length >= proposalsPerUser) {
        console.log(`   ✅ Já possui ${existingProposals.length} proposta(s) pendente(s)`);
        continue;
      }

      // Encontrar posts de outros usuários para criar propostas
      const otherUsersPosts = posts.filter(post => post.userId !== requester.id);
      
      if (otherUsersPosts.length === 0) {
        console.log(`   ❌ Nenhum post de outros usuários disponível`);
        continue;
      }

      // Criar propostas para este usuário
      const proposalsToCreate = Math.min(proposalsPerUser - existingProposals.length, otherUsersPosts.length);
      
      for (let j = 0; j < proposalsToCreate; j++) {
        const post = otherUsersPosts[j % otherUsersPosts.length]; // Rotacionar posts se necessário
        
        const proposal = await prisma.proposal.create({
          data: {
            message: `Proposta de ${requester.name} para ${post.user.name} - ${post.title}`,
            status: 'pending',
            requesterId: requester.id,
            responderId: post.userId,
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

        console.log(`   📋 Proposta ${j + 1} criada: ${proposal.id}`);
        console.log(`      👤 Solicitante: ${proposal.requester.name}`);
        console.log(`      🏪 Respondente: ${proposal.responder.name}`);
        console.log(`      📦 Produto: ${post.title}`);
        totalCreated++;
      }
    }

    console.log(`\n🎉 Processo concluído!`);
    console.log(`📊 Total de propostas criadas: ${totalCreated}`);

    // Verificar resultado final
    console.log(`\n📋 Resumo final por usuário:`);
    const allUsers = await prisma.user.findMany({
      include: {
        proposalsRequested: {
          where: { status: 'pending' }
        },
        proposalsReceived: {
          where: { status: 'pending' }
        }
      }
    });

    allUsers.forEach(user => {
      console.log(`\n👤 ${user.name}:`);
      console.log(`   📤 Propostas enviadas (pendentes): ${user.proposalsRequested.length}`);
      console.log(`   📥 Propostas recebidas (pendentes): ${user.proposalsReceived.length}`);
      
      if (user.proposalsReceived.length > 0) {
        console.log(`   🎯 Pode aceitar propostas no chat!`);
        user.proposalsReceived.forEach((proposal, index) => {
          console.log(`      ${index + 1}. ${proposal.id} - ${proposal.message}`);
        });
      }
    });

    // Mostrar algumas propostas para teste
    console.log(`\n🧪 Propostas disponíveis para teste no chat:`);
    const pendingProposals = await prisma.proposal.findMany({
      where: { status: 'pending' },
      include: {
        requester: true,
        responder: true,
        items: {
          include: {
            post: true
          }
        }
      },
      take: 5
    });

    pendingProposals.forEach((proposal, index) => {
      console.log(`${index + 1}. ID: ${proposal.id}`);
      console.log(`   👤 Solicitante: ${proposal.requester.name}`);
      console.log(`   🏪 Respondente: ${proposal.responder.name}`);
      console.log(`   📦 Produto: ${proposal.items[0]?.post?.title || 'N/A'}`);
      console.log(`   💬 Para aceitar: "Quero aceitar a proposta ${proposal.id}"`);
    });

  } catch (error) {
    console.error('❌ Erro ao criar propostas:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

createProposalsAllUsers();
