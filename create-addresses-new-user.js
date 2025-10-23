/**
 * Criar endereços para o novo usuário
 */

const createAddressesForNewUser = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🏠 Criando endereços para o novo usuário...\n');

  try {
    // ID do usuário criado
    const userId = '28219dcb-8ef0-4c0c-8432-80284a84e44b';
    
    // Criar endereços para este usuário
    const addresses = [
      {
        street: 'Rua da Paz, 100',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '20000-000',
        country: 'Brasil',
        userId: userId
      },
      {
        street: 'Av. Copacabana, 500',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '22000-000',
        country: 'Brasil',
        userId: userId
      }
    ];
    
    console.log(`📝 Criando endereços para usuário: ${userId}`);
    
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      console.log(`\n${i + 1}. Criando: ${address.street}`);
      
      try {
        const response = await fetch(`${baseUrl}/api/enderecos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(address),
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log(`✅ Endereço criado com sucesso!`);
          console.log(`   ID: ${result.id}`);
        } else {
          console.log(`❌ Erro ao criar endereço: ${result.error || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.log(`❌ Erro na requisição: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Endereços criados!');
    console.log('💡 Agora vamos testar o chat com este usuário...');
    
    // Testar o chat com o novo usuário
    console.log('\n🧪 Testando chat com endereços...');
    
    const chatResponse = await fetch(`${baseUrl}/api/watson`, {
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

    const chatData = await chatResponse.json();
    console.log('\n✅ Resposta do Watson:');
    console.log(chatData.reuseResponse.message);
    console.log('📊 Ação:', chatData.reuseResponse.action);
    console.log('📋 Endereços encontrados:', chatData.reuseResponse.data?.length || 0);
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar criação de endereços
createAddressesForNewUser().catch(console.error);
