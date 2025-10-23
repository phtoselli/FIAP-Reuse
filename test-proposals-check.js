/**
 * Verificar propostas existentes no banco
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkProposals = async () => {
  try {
    console.log('🔍 Verificando propostas no banco...\n');

    // Buscar todas as propostas
    const proposals = await prisma.proposal.findMany({
      include: {
        requester: true,
        responder: true,
        items: true
      }
    });

    console.log(`📊 Total de propostas encontradas: ${proposals.length}\n`);

    if (proposals.length > 0) {
      console.log('📋 Detalhes das propostas:');
      proposals.forEach((proposal, index) => {
        console.log(`\n${index + 1}. Proposta ID: ${proposal.id}`);
        console.log(`   📝 Status: ${proposal.status}`);
        console.log(`   👤 Solicitante: ${proposal.requester?.name || 'N/A'}`);
        console.log(`   🏪 Respondente: ${proposal.responder?.name || 'N/A'}`);
        console.log(`   📦 Itens: ${proposal.items?.length || 0} item(s)`);
        console.log(`   📅 Criada em: ${proposal.createdAt}`);
      });
    } else {
      console.log('❌ Nenhuma proposta encontrada no banco.');
      console.log('💡 Vamos criar uma proposta de teste...');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar propostas:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

checkProposals();
