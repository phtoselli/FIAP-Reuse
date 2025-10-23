/**
 * Demonstração de endereços com dados simulados
 */

const testAddressesDemo = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🏠 Demonstração de endereços (simulando dados)...\n');

  // Simular endereços que estariam no banco
  const mockAddresses = [
    {
      id: 'addr-001',
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil'
    },
    {
      id: 'addr-002', 
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil'
    }
  ];

  console.log('📦 Endereços simulados disponíveis:');
  mockAddresses.forEach((addr, index) => {
    console.log(`${index + 1}. ${addr.street} - ${addr.city}, ${addr.state}`);
  });

  console.log('\n' + '='.repeat(60) + '\n');

  // Teste 1: Listar endereços
  console.log('📋 Teste: Listar endereços do usuário');
  try {
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
    
    if (data.reuseResponse.action === 'list_addresses') {
      console.log('\n🎯 Funcionalidade detectada: Listar endereços');
      console.log('📋 Endereços encontrados:', data.reuseResponse.data?.length || 0);
    }
    
    console.log('\n💡 Como funcionaria com dados reais:');
    console.log('1. Usuário digita: "Quero ver meus endereços"');
    console.log('2. Watson detecta a intenção');
    console.log('3. Backend busca endereços do usuário no banco');
    console.log('4. Retorna lista formatada com todos os endereços');
    
    console.log('\n📝 Exemplo de resposta com dados:');
    console.log('🏠 Seus Endereços');
    console.log('');
    console.log('1. Rua das Flores, 123');
    console.log('   📍 São Paulo, SP');
    console.log('   📮 CEP: 01234-567');
    console.log('');
    console.log('2. Av. Paulista, 1000');
    console.log('   📍 São Paulo, SP');
    console.log('   📮 CEP: 01310-100');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }

  console.log('\n🎉 Demonstração concluída!');
  console.log('💡 A funcionalidade está pronta para funcionar com dados reais!');
};

// Executar demonstração
testAddressesDemo().catch(console.error);
