/**
 * Teste para verificar produtos reais no banco
 */

const testRealProducts = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Verificando produtos reais no banco...\n');

  try {
    // Primeiro, vamos listar produtos para ver se há algum cadastrado
    console.log('📋 Listando produtos disponíveis...');
    const listResponse = await fetch(`${baseUrl}/api/produtos`);
    const products = await listResponse.json();
    
    console.log('📊 Total de produtos encontrados:', products.length);
    
    if (products.length > 0) {
      console.log('\n📦 Produtos disponíveis:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ID: ${product.id} - Nome: ${product.nome}`);
      });
      
      // Testar com o primeiro produto
      const firstProduct = products[0];
      console.log(`\n🧪 Testando detalhes do produto: ${firstProduct.id}`);
      
      const testResponse = await fetch(`${baseUrl}/api/watson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Quero ver os detalhes do produto ${firstProduct.id}`,
          userId: 'user-123',
          sessionId: 'test-session'
        }),
      });

      const testData = await testResponse.json();
      console.log('\n✅ Resposta do Watson:');
      console.log(testData.reuseResponse.message);
      
      if (testData.reuseResponse.data) {
        console.log('\n📋 Dados do produto:');
        console.log('- Nome:', testData.reuseResponse.data.nome);
        console.log('- Descrição:', testData.reuseResponse.data.descricao);
        console.log('- Categoria:', testData.reuseResponse.data.categoria?.nome);
        console.log('- Ofertante:', testData.reuseResponse.data.usuario?.nome);
      }
    } else {
      console.log('❌ Nenhum produto encontrado no banco');
      console.log('💡 Dica: Cadastre alguns produtos primeiro para testar');
    }
    
  } catch (error) {
    console.log('❌ Erro ao verificar produtos:', error.message);
  }
};

// Executar teste
testRealProducts().catch(console.error);
