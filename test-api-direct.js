/**
 * Testar diretamente a API do Watson para aceitar proposta
 */

const testApiDirect = async () => {
  const baseUrl = 'http://localhost:3001';
  const proposalId = 'c0adc64b-2879-4644-a313-f6d5788cf6ff';
  const userId = 'bab9bece-a0e4-445b-823c-c744666f38ec'; // Carol
  
  console.log('🎯 Testando API diretamente...\n');
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

    console.log(`📊 Status da resposta: ${response.status}`);
    
    if (!response.ok) {
      console.log('❌ Erro na resposta da API');
      const errorText = await response.text();
      console.log('Erro:', errorText);
      return;
    }

    const data = await response.json();
    
    console.log('✅ Resposta da API:');
    console.log('📋 Watson Response:', JSON.stringify(data.watsonResponse, null, 2));
    console.log('\n📋 ReUse Response:', JSON.stringify(data.reuseResponse, null, 2));
    
    if (data.reuseResponse.action === 'accept_proposal') {
      console.log('\n🎉 SUCESSO! Proposta aceita via API!');
      console.log(`   Status: ${data.reuseResponse.data?.status}`);
      console.log(`   Solicitante: ${data.reuseResponse.data?.requester?.name}`);
      console.log(`   Respondente: ${data.reuseResponse.data?.responder?.name}`);
    } else if (data.reuseResponse.action === 'error') {
      console.log('\n❌ ERRO na API:');
      console.log(`   Mensagem: ${data.reuseResponse.message}`);
    } else {
      console.log('\n⚠️  Ação inesperada:', data.reuseResponse.action);
    }
    
  } catch (error) {
    console.log('❌ Erro na requisição:', error.message);
  }
};

testApiDirect();
