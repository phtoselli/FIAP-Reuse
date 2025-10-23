/**
 * Debug do aceite de proposta
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const debugProposalAccept = async () => {
  try {
    const proposalId = 'fe0afb80-3531-4eec-ba9e-5c29f7753b40';
    const userId = 'bab9bece-a0e4-445b-823c-c744666f38ec'; // Carol (respondente)
    
    console.log('🔍 Debug do aceite de proposta...\n');
    console.log(`📋 Proposta ID: ${proposalId}`);
    console.log(`👤 Usuário: ${userId}\n`);

    // 1. Verificar se a proposta existe
    console.log('1️⃣ Verificando se a proposta existe...');
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        requester: true,
        responder: true,
        items: true
      }
    });

    if (!proposal) {
      console.log('❌ Proposta não encontrada!');
      return;
    }

    console.log('✅ Proposta encontrada:');
    console.log(`   Status: ${proposal.status}`);
    console.log(`   Requester: ${proposal.requester.name} (${proposal.requesterId})`);
    console.log(`   Responder: ${proposal.responder.name} (${proposal.responderId})`);

    // 2. Verificar se o usuário é o responder
    console.log('\n2️⃣ Verificando se o usuário é o responder...');
    if (proposal.responderId !== userId) {
      console.log('❌ Usuário não é o responder da proposta!');
      console.log(`   Esperado: ${proposal.responderId}`);
      console.log(`   Recebido: ${userId}`);
      return;
    }
    console.log('✅ Usuário é o responder correto');

    // 3. Verificar se a proposta está pendente
    console.log('\n3️⃣ Verificando status da proposta...');
    if (proposal.status !== 'pending') {
      console.log(`❌ Proposta não está pendente! Status: ${proposal.status}`);
      return;
    }
    console.log('✅ Proposta está pendente');

    // 4. Tentar aceitar a proposta
    console.log('\n4️⃣ Tentando aceitar a proposta...');
    const updatedProposal = await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'accepted' },
      include: {
        requester: true,
        responder: true,
        items: {
          include: {
            post: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    console.log('✅ Proposta aceita com sucesso!');
    console.log(`   Novo status: ${updatedProposal.status}`);
    console.log(`   Atualizada em: ${updatedProposal.updatedAt}`);

    // 5. Verificar se a proposta foi realmente atualizada
    console.log('\n5️⃣ Verificando se a proposta foi atualizada...');
    const finalProposal = await prisma.proposal.findUnique({
      where: { id: proposalId }
    });
    
    console.log(`   Status final: ${finalProposal.status}`);
    console.log('✅ Proposta aceita com sucesso no banco!');

  } catch (error) {
    console.error('❌ Erro durante o debug:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
};

debugProposalAccept();
