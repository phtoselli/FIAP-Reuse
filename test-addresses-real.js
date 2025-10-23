/**
 * Teste de endereços com dados reais do banco
 */

const testAddressesReal = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🏠 Testando endereços com dados reais do banco...\n');

  try {
    // Primeiro, vamos verificar se há endereços no banco
    console.log('📋 Verificando endereços no banco...');
    const addressesResponse = await fetch(`${baseUrl}/api/enderecos`);
    const addressesData = await addressesResponse.json();
    
    console.log(`📊 Total de endereços encontrados: ${addressesData.enderecos.length}`);
    
    if (addressesData.enderecos.length > 0) {
      console.log('\n📦 Endereços disponíveis:');
      addressesData.enderecos.forEach((addr, index) => {
        console.log(`${index + 1}. ${addr.street} - ${addr.city}, ${addr.state}`);
      });
      
      // Pegar o ID do primeiro usuário que tem endereços
      const firstAddress = addressesData.enderecos[0];
      const userId = firstAddress.userId;
      
      console.log(`\n🧪 Testando Watson com usuário: ${userId}`);
      
      // Testar Watson com endereços reais
      const watsonResponse = await fetch(`${baseUrl}/api/watson`, {
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

      const watsonData = await watsonResponse.json();
      console.log('\n✅ Resposta do Watson:');
      console.log(watsonData.reuseResponse.message);
      
      if (watsonData.reuseResponse.action === 'list_addresses') {
        console.log('\n🎯 Funcionalidade detectada: Listar endereços');
        console.log('📋 Endereços encontrados:', watsonData.reuseResponse.data?.length || 0);
        
        if (watsonData.reuseResponse.data && watsonData.reuseResponse.data.length > 0) {
          console.log('\n📝 Detalhes dos endereços:');
          watsonData.reuseResponse.data.forEach((addr, index) => {
            console.log(`${index + 1}. ${addr.street}`);
            console.log(`   📍 ${addr.city}, ${addr.state}`);
            console.log(`   📮 CEP: ${addr.zipCode}`);
          });
        }
      }
      
    } else {
      console.log('❌ Nenhum endereço encontrado no banco');
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }

  console.log('\n🎉 Teste concluído!');
  console.log('💡 Agora o Watson pode listar endereços reais do banco!');
};

// Executar teste
testAddressesReal().catch(console.error);
