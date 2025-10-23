/**
 * Criar usuário user-123 no banco
 */

const createUser123 = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('👤 Criando usuário user-123...\n');

  try {
    const userData = {
      name: 'Usuário Teste',
      email: 'user123@teste.com',
      password: '123456',
      city: 'Rio de Janeiro',
      state: 'RJ'
    };
    
    console.log('📝 Criando usuário...');
    
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Usuário criado com sucesso!`);
      console.log(`   ID: ${result.user?.id || 'ID não retornado'}`);
      console.log(`   Nome: ${result.user?.name}`);
      console.log(`   Email: ${result.user?.email}`);
    } else {
      console.log(`❌ Erro ao criar usuário: ${result.error || 'Erro desconhecido'}`);
      console.log('💡 Pode ser que o usuário já exista ou haja outro problema');
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar criação de usuário
createUser123().catch(console.error);
