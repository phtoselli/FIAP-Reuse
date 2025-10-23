/**
 * Testar aceite da nova proposta via chat
 */

const testNewProposalAccept = async () => {
  const baseUrl = 'http://localhost:3001';
  const proposalId = 'b1fd6da3-a95a-4b43-8193-93b348a8570a';
  const userId = 'bab9bece-a0e4-445b-823c-c744666f38ec'; // Carol (respondente)
  
  console.log('🎯 Testando aceite da nova proposta via chat...\n');
  console.log(`📋 Proposta ID: ${proposalId}`);
  console.log(`👤 Usuário: ${userId}\n`);

  try {
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Quero aceitar a proposta ${proposalId}`,
        userId: userId,
        sessionId: 'test-session'
      }),
    });

    const data = await response.json();
    
    console.log('✅ Resposta do Watson:');
    console.log(data.reuseResponse.message);
    console.log('\n📊 Detalhes:');
    console.log(`   Ação: ${data.reuseResponse.action}`);
    console.log(`   Status Watson: ${data.isRealWatson ? 'Real' : 'Demo'}`);
    
    if (data.reuseResponse.data) {
      console.log(`   Status da proposta: ${data.reuseResponse.data.status}`);
      console.log(`   Solicitante: ${data.reuseResponse.data.requester.name}`);
      console.log(`   Respondente: ${data.reuseResponse.data.responder.name}`);
    }
    
    console.log('\n🎉 Teste de aceite da nova proposta concluído!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

testNewProposalAccept();
