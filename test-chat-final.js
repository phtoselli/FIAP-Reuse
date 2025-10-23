/**
 * Teste final do chat com usuário que tem endereços
 */

const testChatFinal = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🎯 Teste final do chat com usuário correto...\n');

  try {
    // Usar o usuário que tem endereços
    const userId = '28219dcb-8ef0-4c0c-8432-80284a84e44b';
    
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
    
    console.log('\n🎉 Teste concluído!');
    console.log('💡 Agora o chat vai mostrar os endereços corretamente!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar teste
testChatFinal().catch(console.error);
