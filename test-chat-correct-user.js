/**
 * Teste do chat com o usuário correto que tem endereços
 */

const testChatCorrectUser = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🧪 Testando chat com usuário que tem endereços...\n');

  try {
    // Usar o ID do usuário que tem endereços (Alice)
    const userId = 'd21d52e9-2969-428c-8aba-e5e236eca94f';
    
    console.log(`👤 Testando com usuário: ${userId}`);
    
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Quero ver meus endereços cadastrados',
        userId: userId,
        sessionId: 'test-session'
      }),
    });

    const data = await response.json();
    console.log('✅ Resposta do Watson:');
    console.log(data.reuseResponse.message);
    console.log('📊 Ação:', data.reuseResponse.action);
    console.log('📋 Endereços encontrados:', data.reuseResponse.data?.length || 0);
    
    if (data.reuseResponse.data && data.reuseResponse.data.length > 0) {
      console.log('\n📝 Detalhes dos endereços:');
      data.reuseResponse.data.forEach((addr, index) => {
        console.log(`${index + 1}. ${addr.street}`);
        console.log(`   📍 ${addr.city}, ${addr.state}`);
        console.log(`   📮 CEP: ${addr.zipCode}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar teste
testChatCorrectUser().catch(console.error);
