/**
 * Debug detalhado do ProposalService
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const debugProposalService = async () => {
  try {
    const proposalId = 'b1fd6da3-a95a-4b43-8193-93b348a8570a';
    const userId = 'bab9bece-a0e4-445b-823c-c744666f38ec';
    
    console.log('🔍 Debug detalhado do ProposalService...\n');

    // 1. Verificar proposta atual
    console.log('1️⃣ Verificando proposta atual...');
    const currentProposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        requester: true,
        responder: true,
        items: true
      }
    });

    console.log(`   Status atual: ${currentProposal.status}`);
    console.log(`   Requester: ${currentProposal.requester.name}`);
    console.log(`   Responder: ${currentProposal.responder.name}`);

    // 2. Simular o que o ProposalService faz
    console.log('\n2️⃣ Simulando ProposalService.acceptProposal...');
    
    // Verificar se a proposta existe
    const existingProposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        requester: true,
        responder: true,
        items: true
      }
    });

    if (!existingProposal) {
      console.log('❌ Proposta não encontrada');
      return;
    }

    console.log('✅ Proposta encontrada');

    // Verificar se o usuário é o responder
    if (existingProposal.responderId !== userId) {
      console.log('❌ Usuário não é o responder da proposta');
      console.log(`   Esperado: ${existingProposal.responderId}`);
      console.log(`   Recebido: ${userId}`);
      return;
    }

    console.log('✅ Usuário é o responder correto');

    // Verificar se a proposta está pendente
    if (existingProposal.status !== 'pending') {
      console.log(`❌ Proposta não está pendente! Status: ${existingProposal.status}`);
      return;
    }

    console.log('✅ Proposta está pendente');

    // 3. Tentar aceitar a proposta
    console.log('\n3️⃣ Aceitando a proposta...');
    await prisma.proposal.update({
      where: { id: proposalId },
      data: { status: 'accepted' }
    });

    console.log('✅ Proposta aceita no banco');

    // 4. Buscar a proposta atualizada
    console.log('\n4️⃣ Buscando proposta atualizada...');
    const updatedProposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
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

    console.log('✅ Proposta atualizada encontrada');
    console.log(`   Novo status: ${updatedProposal.status}`);

    // 5. Testar o mapeamento
    console.log('\n5️⃣ Testando mapeamento...');
    try {
      const mappedProposal = {
        id: updatedProposal.id,
        message: updatedProposal.message,
        status: updatedProposal.status,
        createdAt: updatedProposal.createdAt,
        updatedAt: updatedProposal.updatedAt,
        requester: {
          id: updatedProposal.requester.id,
          name: updatedProposal.requester.name,
          city: updatedProposal.requester.city,
          state: updatedProposal.requester.state,
          avatarUrl: updatedProposal.requester.avatarUrl,
        },
        responder: {
          id: updatedProposal.responder.id,
          name: updatedProposal.responder.name,
          city: updatedProposal.responder.city,
          state: updatedProposal.responder.state,
          avatarUrl: updatedProposal.responder.avatarUrl,
        },
        items: updatedProposal.items.map((item) => ({
          id: item.id,
          postId: item.postId,
          isOffered: item.isOffered,
          post: {
            id: item.post.id,
            title: item.post.title,
            description: item.post.description,
            imageUrl: item.post.imageUrl,
            rating: item.post.rating,
            isActive: item.post.isActive,
            category: {
              id: item.post.categoryRel?.id,
              name: item.post.categoryRel?.name,
              description: item.post.categoryRel?.description,
            },
            subcategory: {
              id: item.post.subcategoryId,
              name: item.post.subcategoryId,
              description: item.post.subcategoryId,
            },
            condition: item.post.condition
              ? {
                  id: item.post.condition.id,
                  code: item.post.condition.code,
                  type: item.post.condition.type,
                  description: item.post.condition.description,
                }
              : null,
          },
        })),
        totalItems: updatedProposal.items?.filter((item) => item.isOffered).length,
      };

      console.log('✅ Mapeamento realizado com sucesso');
      console.log(`   Total de itens: ${mappedProposal.totalItems}`);
      console.log(`   Status final: ${mappedProposal.status}`);

    } catch (mappingError) {
      console.error('❌ Erro no mapeamento:', mappingError.message);
      console.error('Stack trace:', mappingError.stack);
    }

  } catch (error) {
    console.error('❌ Erro durante o debug:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
};

debugProposalService();
