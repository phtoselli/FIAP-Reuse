/**
 * Teste de endereços com Watson
 */

const testAddresses = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🏠 Testando funcionalidade de endereços...\n');

  try {
    // Teste 1: Listar endereços
    console.log('📋 Teste 1: Listar endereços do usuário');
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Quero ver meus endereços cadastrados',
        userId: 'user-123',
        sessionId: 'test-session'
      }),
    });

    const data = await response.json();
    console.log('✅ Resposta do Watson:');
    console.log(data.reuseResponse.message);
    console.log('📊 Ação:', data.reuseResponse.action);
    console.log('📋 Dados:', data.reuseResponse.data ? `${data.reuseResponse.data.length} endereço(s)` : 'Nenhum endereço');
    
    console.log('\n' + '='.repeat(60) + '\n');

    // Teste 2: Comando alternativo
    console.log('📋 Teste 2: Comando alternativo');
    const response2 = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Listar endereços',
        userId: 'user-123',
        sessionId: 'test-session'
      }),
    });

    const data2 = await response2.json();
    console.log('✅ Resposta do Watson:');
    console.log(data2.reuseResponse.message);
    console.log('📊 Ação:', data2.reuseResponse.action);
    
    console.log('\n🎉 Teste de endereços concluído!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar teste
testAddresses().catch(console.error);
