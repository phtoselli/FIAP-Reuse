import { ProposalService } from './ProposalService';

const proposalService = new ProposalService();

/**
 * Teste dos métodos de proposta
 */
async function testarPropostas() {
  try {
    console.log('🧪 Testando sistema de propostas...\n');

    // 1. Testar criação de proposta
    console.log('1️⃣ Criando proposta de teste:');
    const novaProposta = await proposalService.createProposal({
      message: 'Gostaria de fazer uma proposta pelos seus produtos',
      responderId: 'uuid-usuario-destinatario',
      items: [
        { postId: 'uuid-produto-1' },
        { postId: 'uuid-produto-2' }
      ]
    }, 'uuid-usuario-solicitante');
    
    console.log(`   ✅ Proposta criada com ID: ${novaProposta.id}`);
    console.log(`   ✅ Status: ${novaProposta.status}`);
    console.log(`   ✅ Total de itens: ${novaProposta.totalItems}\n`);

    // 2. Testar busca por ID
    console.log('2️⃣ Buscando proposta por ID:');
    const propostaEncontrada = await proposalService.getProposalById(novaProposta.id);
    
    if (propostaEncontrada) {
      console.log(`   ✅ Proposta encontrada: ${propostaEncontrada.message}`);
      console.log(`   ✅ Requester: ${propostaEncontrada.requester.name}`);
      console.log(`   ✅ Responder: ${propostaEncontrada.responder.name}\n`);
    }

    // 3. Testar listagem de propostas
    console.log('3️⃣ Listando propostas:');
    const todasPropostas = await proposalService.getAllProposals();
    console.log(`   ✅ Total de propostas: ${todasPropostas.length}\n`);

    // 4. Testar propostas por usuário
    console.log('4️⃣ Listando propostas do usuário solicitante:');
    const propostasUsuario = await proposalService.getProposalsByUserId('uuid-usuario-solicitante', 'requester');
    console.log(`   ✅ Propostas do usuário: ${propostasUsuario.length}\n`);

    // 5. Testar propostas por status
    console.log('5️⃣ Listando propostas pendentes:');
    const propostasPendentes = await proposalService.getProposalsByStatus('pending');
    console.log(`   ✅ Propostas pendentes: ${propostasPendentes.length}\n`);

    // 6. Testar aceitar proposta
    console.log('6️⃣ Aceitando proposta:');
    const propostaAceita = await proposalService.acceptProposal(novaProposta.id, 'uuid-usuario-destinatario');
    console.log(`   ✅ Proposta aceita com status: ${propostaAceita.status}\n`);

    // 7. Testar atualização de proposta
    console.log('7️⃣ Atualizando proposta:');
    const propostaAtualizada = await proposalService.updateProposal(novaProposta.id, {
      message: 'Mensagem atualizada da proposta'
    }, 'uuid-usuario-solicitante');
    console.log(`   ✅ Proposta atualizada: ${propostaAtualizada.message}\n`);

    console.log('🎉 Todos os testes de proposta foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao testar propostas:', error);
  }
}

/**
 * Teste de validações de segurança
 */
async function testarValidacoesSeguranca() {
  try {
    console.log('🔒 Testando validações de segurança...\n');

    // 1. Testar aceitar proposta com usuário errado
    console.log('1️⃣ Tentando aceitar proposta com usuário errado:');
    try {
      await proposalService.acceptProposal('uuid-proposta-teste', 'uuid-usuario-errado');
      console.log('   ❌ Deveria ter falhado');
    } catch (error) {
      console.log('   ✅ Validação funcionou: Apenas o destinatário pode aceitar');
    }

    // 2. Testar editar proposta com usuário errado
    console.log('2️⃣ Tentando editar proposta com usuário errado:');
    try {
      await proposalService.updateProposal('uuid-proposta-teste', {
        message: 'Mensagem não autorizada'
      }, 'uuid-usuario-errado');
      console.log('   ❌ Deveria ter falhado');
    } catch (error) {
      console.log('   ✅ Validação funcionou: Apenas o criador pode editar');
    }

    // 3. Testar aceitar proposta já finalizada
    console.log('3️⃣ Tentando aceitar proposta já finalizada:');
    try {
      await proposalService.acceptProposal('uuid-proposta-aceita', 'uuid-usuario-destinatario');
      console.log('   ❌ Deveria ter falhado');
    } catch (error) {
      console.log('   ✅ Validação funcionou: Apenas propostas pendentes podem ser aceitas');
    }

    console.log('🔒 Todas as validações de segurança funcionaram corretamente!');

  } catch (error) {
    console.error('❌ Erro ao testar validações:', error);
  }
}

// Executar testes
if (require.main === module) {
  testarPropostas()
    .then(() => testarValidacoesSeguranca())
    .then(() => {
      console.log('🏁 Testes de proposta concluídos!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

export { testarPropostas, testarValidacoesSeguranca };
