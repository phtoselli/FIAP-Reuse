/**
 * Verificar status de todas as propostas para identificar aceites automáticos
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkProposalStatus = async () => {
  try {
    console.log('🔍 Verificando status de todas as propostas...\n');

    // Buscar todas as propostas
    const proposals = await prisma.proposal.findMany({
      include: {
        requester: true,
        responder: true,
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total de propostas: ${proposals.length}\n`);

    if (proposals.length > 0) {
      console.log('📋 Status das propostas:');
      proposals.forEach((proposal, index) => {
        console.log(`\n${index + 1}. ID: ${proposal.id}`);
        console.log(`   📝 Status: ${proposal.status}`);
        console.log(`   👤 Solicitante: ${proposal.requester.name}`);
        console.log(`   🏪 Respondente: ${proposal.responder.name}`);
        console.log(`   📅 Criada em: ${proposal.createdAt}`);
        console.log(`   📅 Atualizada em: ${proposal.updatedAt}`);
        
        // Verificar se foi aceita automaticamente
        const timeDiff = new Date(proposal.updatedAt) - new Date(proposal.createdAt);
        const timeDiffSeconds = timeDiff / 1000;
        
        if (proposal.status === 'accepted' && timeDiffSeconds < 10) {
          console.log(`   ⚠️  POSSÍVEL ACEITE AUTOMÁTICO! (${timeDiffSeconds}s após criação)`);
        }
      });

      // Verificar se há propostas pendentes
      const pendingProposals = proposals.filter(p => p.status === 'pending');
      console.log(`\n📊 Resumo:`);
      console.log(`   🔴 Pendentes: ${pendingProposals.length}`);
      console.log(`   🟢 Aceitas: ${proposals.filter(p => p.status === 'accepted').length}`);
      console.log(`   🔴 Rejeitadas: ${proposals.filter(p => p.status === 'rejected').length}`);

      if (pendingProposals.length > 0) {
        console.log(`\n✅ Propostas pendentes disponíveis para teste:`);
        pendingProposals.forEach((proposal, index) => {
          console.log(`   ${index + 1}. ${proposal.id} (${proposal.requester.name} → ${proposal.responder.name})`);
        });
      } else {
        console.log(`\n❌ Nenhuma proposta pendente encontrada!`);
        console.log(`💡 Todas as propostas foram aceitas automaticamente ou manualmente.`);
      }

    } else {
      console.log('❌ Nenhuma proposta encontrada no banco.');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar propostas:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

checkProposalStatus();
