/**
 * Testar visualização de detalhes de produto via chat
 */

const testProductDetailsChat = async () => {
  const baseUrl = 'http://localhost:3001';
  const productId = '2c1612e3-d9d0-4cc1-a1eb-d0b4c772499f'; // Carol Produto 1
  const userId = 'bab9bece-a0e4-445b-823c-c744666f38ec'; // Carol
  
  console.log('🎯 Testando visualização de detalhes de produto via chat...\n');
  console.log(`📦 Produto ID: ${productId}`);
  console.log(`👤 Usuário: ${userId}\n`);

  try {
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Quero ver os detalhes do produto ${productId}`,
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
      console.log(`   Nome: ${data.reuseResponse.data.nome}`);
      console.log(`   Descrição: ${data.reuseResponse.data.descricao}`);
      console.log(`   Categoria: ${data.reuseResponse.data.categoria?.nome || 'N/A'}`);
      console.log(`   Condição: ${data.reuseResponse.data.condicao?.descricao || 'N/A'}`);
      console.log(`   Ofertante: ${data.reuseResponse.data.usuario?.nome || 'N/A'}`);
    }
    
    console.log('\n🎉 Teste de visualização de produto concluído!');
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

testProductDetailsChat();
