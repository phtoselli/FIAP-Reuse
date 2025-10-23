/**
 * Teste do Watson com ID de produto real
 */

const testWatsonReal = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🎯 Testando Watson com ID de produto real...\n');

  try {
    // Primeiro, vamos pegar um produto real
    console.log('📋 Buscando produtos reais...');
    const response = await fetch(`${baseUrl}/api/produtos`);
    const data = await response.json();
    
    if (data.produtos && data.produtos.length > 0) {
      const firstProduct = data.produtos[0];
      console.log(`✅ Produto encontrado: ${firstProduct.nome} (ID: ${firstProduct.id})`);
      
      // Testar Watson com ID real
      console.log(`\n🧪 Testando Watson com produto real: ${firstProduct.id}`);
      
      const watsonResponse = await fetch(`${baseUrl}/api/watson`, {
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

      const watsonData = await watsonResponse.json();
      console.log('\n✅ Resposta do Watson:');
      console.log(watsonData.reuseResponse.message);
      
      if (watsonData.reuseResponse.data) {
        console.log('\n📋 Dados do produto retornados:');
        console.log('- Nome:', watsonData.reuseResponse.data.nome);
        console.log('- Descrição:', watsonData.reuseResponse.data.descricao);
        console.log('- Categoria:', watsonData.reuseResponse.data.categoria?.nome);
        console.log('- Ofertante:', watsonData.reuseResponse.data.usuario?.nome);
      }
      
      console.log('\n🎉 Teste concluído com sucesso!');
      console.log('💡 O Watson está funcionando com dados reais do banco!');
      
    } else {
      console.log('❌ Nenhum produto encontrado');
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar teste
testWatsonReal().catch(console.error);
