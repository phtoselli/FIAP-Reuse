/**
 * Verificar propostas pendentes criadas
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkProposalsFinal = async () => {
  try {
    console.log('📋 Verificando propostas pendentes...\n');

    // Buscar todas as propostas pendentes
    const proposals = await prisma.proposal.findMany({
      where: { status: 'pending' },
      include: {
        requester: true,
        responder: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total de propostas pendentes: ${proposals.length}\n`);

    if (proposals.length > 0) {
      console.log('📋 Propostas disponíveis para teste no chat:');
      proposals.forEach((proposal, index) => {
        console.log(`\n${index + 1}. ID: ${proposal.id}`);
        console.log(`   👤 Solicitante: ${proposal.requester.name}`);
        console.log(`   🏪 Respondente: ${proposal.responder.name}`);
        console.log(`   📝 Mensagem: ${proposal.message}`);
        console.log(`   📅 Criada em: ${proposal.createdAt}`);
        console.log(`   💬 Para aceitar: "Quero aceitar a proposta ${proposal.id}"`);
      });

      // Agrupar por respondente
      console.log(`\n📊 Propostas por respondente:`);
      const proposalsByResponder = {};
      proposals.forEach(proposal => {
        const responderId = proposal.responderId;
        if (!proposalsByResponder[responderId]) {
          proposalsByResponder[responderId] = {
            user: proposal.responder,
            proposals: []
          };
        }
        proposalsByResponder[responderId].proposals.push(proposal);
      });

      Object.keys(proposalsByResponder).forEach(responderId => {
        const data = proposalsByResponder[responderId];
        console.log(`\n👤 ${data.user.name} (${responderId}):`);
        console.log(`   📥 Pode aceitar ${data.proposals.length} proposta(s)`);
        data.proposals.forEach((proposal, index) => {
          console.log(`   ${index + 1}. ${proposal.id} - ${proposal.message}`);
        });
      });

    } else {
      console.log('❌ Nenhuma proposta pendente encontrada.');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar propostas:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkProposalsFinal();
