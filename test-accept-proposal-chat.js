/**
 * Testar aceite de proposta via chat
 */

const testAcceptProposal = async () => {
  const baseUrl = 'http://localhost:3001';
  const proposalId = 'fe0afb80-3531-4eec-ba9e-5c29f7753b40';
  const userId = 'bab9bece-a0e4-445b-823c-c744666f38ec'; // Carol (respondente)
  
  console.log('🎯 Testando aceite de proposta via chat...\n');
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
      console.log(`   Resultado: ${JSON.stringify(data.reuseResponse.data, null, 2)}`);
    }
    
    console.log('\n🎉 Teste de aceite de proposta concluído!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

testAcceptProposal();
