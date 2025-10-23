/**
 * Debug específico para endereços
 */

const testAddressesDebug = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔍 Debug específico para endereços...\n');

  try {
    // Teste 1: Verificar endereços no banco
    console.log('📋 Verificando endereços no banco...');
    const addressesResponse = await fetch(`${baseUrl}/api/enderecos`);
    const addressesData = await addressesResponse.json();
    
    console.log(`📊 Total de endereços: ${addressesData.enderecos.length}`);
    
    if (addressesData.enderecos.length > 0) {
      console.log('\n📦 Endereços disponíveis:');
      addressesData.enderecos.forEach((addr, index) => {
        console.log(`${index + 1}. ${addr.street} - ${addr.city}, ${addr.state} (User: ${addr.userId})`);
      });
      
      // Teste 2: Testar com usuário que tem endereços
      const userWithAddresses = addressesData.enderecos[0].userId;
      console.log(`\n🧪 Testando com usuário que tem endereços: ${userWithAddresses}`);
      
      const watsonResponse = await fetch(`${baseUrl}/api/watson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Quero ver meus endereços cadastrados',
          userId: userWithAddresses,
          sessionId: 'test-session'
        }),
      });

      const watsonData = await watsonResponse.json();
      console.log('\n✅ Resposta do Watson:');
      console.log('📊 Ação:', watsonData.reuseResponse.action);
      console.log('📋 Endereços encontrados:', watsonData.reuseResponse.data?.length || 0);
      console.log('\n📝 Mensagem completa:');
      console.log(watsonData.reuseResponse.message);
      
    } else {
      console.log('❌ Nenhum endereço encontrado no banco');
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar debug
testAddressesDebug().catch(console.error);
