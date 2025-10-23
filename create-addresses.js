/**
 * Script para criar endereços no banco de dados
 */

const createAddresses = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🏠 Criando endereços no banco de dados...\n');

  // Primeiro, vamos pegar um usuário existente
  try {
    console.log('👤 Buscando usuários existentes...');
    const usersResponse = await fetch(`${baseUrl}/api/usuarios`);
    const usersData = await usersResponse.json();
    
    if (usersData.usuarios && usersData.usuarios.length > 0) {
      const firstUser = usersData.usuarios[0];
      console.log(`✅ Usuário encontrado: ${firstUser.nome} (ID: ${firstUser.id})`);
      
      // Criar endereços para este usuário
      const addresses = [
        {
          street: 'Rua das Flores, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil'
        },
        {
          street: 'Av. Paulista, 1000',
          city: 'São Paulo', 
          state: 'SP',
          zipCode: '01310-100',
          country: 'Brasil'
        },
        {
          street: 'Rua Augusta, 456',
          city: 'São Paulo',
          state: 'SP', 
          zipCode: '01305-000',
          country: 'Brasil'
        }
      ];
      
      console.log('\n📝 Criando endereços...');
      
      for (let i = 0; i < addresses.length; i++) {
        const address = addresses[i];
        console.log(`\n${i + 1}. Criando: ${address.street}`);
        
        try {
          const response = await fetch(`${baseUrl}/api/enderecos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...address,
              userId: firstUser.id
            }),
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
      
      console.log('\n🎉 Processo de criação de endereços concluído!');
      console.log(`👤 Endereços criados para: ${firstUser.nome}`);
      
    } else {
      console.log('❌ Nenhum usuário encontrado no banco');
      console.log('💡 Execute o seed do banco primeiro: npx prisma db seed');
    }
    
  } catch (error) {
    console.log('❌ Erro ao buscar usuários:', error.message);
  }
};

// Executar criação de endereços
createAddresses().catch(console.error);
