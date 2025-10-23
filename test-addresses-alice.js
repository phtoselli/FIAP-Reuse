/**
 * Testar endereços com usuário que tem endereços cadastrados
 */

const testAddressesAlice = async () => {
  const baseUrl = 'http://localhost:3001';
  const userId = 'd21d52e9-2969-428c-8aba-e5e236eca94f'; // Alice (tem 3 endereços)
  
  console.log('🏠 Testando endereços com Alice...\n');
  console.log(`👤 Usuário: ${userId} (Alice)\n`);

  try {
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
    console.log('\n📊 Detalhes:');
    console.log(`   Ação: ${data.reuseResponse.action}`);
    console.log(`   Status Watson: ${data.isRealWatson ? 'Real' : 'Demo'}`);
    
    if (data.reuseResponse.data) {
      console.log(`   Endereços encontrados: ${data.reuseResponse.data.length}`);
      if (data.reuseResponse.data.length > 0) {
        console.log('\n📋 Detalhes dos endereços:');
        data.reuseResponse.data.forEach((addr, index) => {
          console.log(`\n${index + 1}. Endereço:`);
          console.log(`   Rua: ${addr.street}`);
          console.log(`   Número: ${addr.number || 's/n'}`);
          console.log(`   Cidade: ${addr.city}`);
          console.log(`   Estado: ${addr.state}`);
          console.log(`   CEP: ${addr.zipCode}`);
          console.log(`   País: ${addr.country}`);
        });
      }
    }
    
    console.log('\n🎉 Teste de endereços com Alice concluído!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

testAddressesAlice();
