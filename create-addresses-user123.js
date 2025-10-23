/**
 * Criar endereços para o usuário user-123
 */

const createAddressesForUser123 = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🏠 Criando endereços para user-123...\n');

  try {
    // Criar endereços para user-123
    const addresses = [
      {
        street: 'Rua da Paz, 100',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '20000-000',
        country: 'Brasil',
        userId: 'user-123'
      },
      {
        street: 'Av. Copacabana, 500',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '22000-000',
        country: 'Brasil',
        userId: 'user-123'
      }
    ];
    
    console.log('📝 Criando endereços para user-123...');
    
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
    
    console.log('\n🎉 Endereços criados para user-123!');
    console.log('💡 Agora o chat vai mostrar os endereços corretamente!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar criação de endereços
createAddressesForUser123().catch(console.error);
