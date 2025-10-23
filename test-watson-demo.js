/**
 * Demonstração do Watson com dados simulados
 * Mostra como funciona quando há produtos cadastrados
 */

const testWatsonDemo = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🎭 Demonstração do Watson Assistant com dados simulados\n');

  // Simular produtos que estariam no banco
  const mockProducts = [
    {
      id: 'prod-001',
      nome: 'iPhone 12 Pro',
      descricao: 'Smartphone em excelente estado, sem arranhões',
      categoria: { nome: 'Eletrônicos' },
      condicao: { descricao: 'Excelente' },
      usuario: { nome: 'João Silva' }
    },
    {
      id: 'prod-002', 
      nome: 'Livro: Clean Code',
      descricao: 'Livro sobre programação, usado mas em bom estado',
      categoria: { nome: 'Livros' },
      condicao: { descricao: 'Bom' },
      usuario: { nome: 'Maria Santos' }
    }
  ];

  console.log('📦 Produtos simulados disponíveis:');
  mockProducts.forEach((product, index) => {
    console.log(`${index + 1}. ID: ${product.id} - Nome: ${product.nome}`);
  });

  console.log('\n' + '='.repeat(60) + '\n');

  // Teste 1: Ver detalhes do iPhone
  console.log('📱 Teste 1: Detalhes do iPhone 12 Pro');
  try {
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Quero ver os detalhes do produto prod-001',
        userId: 'user-123',
        sessionId: 'demo-session'
      }),
    });

    const data = await response.json();
    console.log('✅ Resposta do Watson:');
    console.log(data.reuseResponse.message);
    
    if (data.reuseResponse.action === 'product_details') {
      console.log('\n🎯 Funcionalidade detectada: Ver detalhes de produto');
      console.log('📋 ID extraído:', data.reuseResponse.data?.id || 'N/A');
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Teste 2: Ver detalhes do livro
  console.log('📚 Teste 2: Detalhes do livro Clean Code');
  try {
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Quero ver os detalhes do produto prod-002',
        userId: 'user-123',
        sessionId: 'demo-session'
      }),
    });

    const data = await response.json();
    console.log('✅ Resposta do Watson:');
    console.log(data.reuseResponse.message);
    
    if (data.reuseResponse.action === 'product_details') {
      console.log('\n🎯 Funcionalidade detectada: Ver detalhes de produto');
      console.log('📋 ID extraído:', data.reuseResponse.data?.id || 'N/A');
    }
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Teste 3: Produto inexistente
  console.log('❓ Teste 3: Produto inexistente');
  try {
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Quero ver os detalhes do produto prod-999',
        userId: 'user-123',
        sessionId: 'demo-session'
      }),
    });

    const data = await response.json();
    console.log('✅ Resposta do Watson:');
    console.log(data.reuseResponse.message);
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  console.log('🎉 Demonstração concluída!');
  console.log('\n📝 Como usar na prática:');
  console.log('1. Cadastre produtos no sistema');
  console.log('2. Acesse o chat em /chat');
  console.log('3. Digite: "Quero ver os detalhes do produto [ID]"');
  console.log('4. O Watson buscará as informações reais no banco!');
  console.log('\n💡 Exemplo de uso:');
  console.log('   Usuário: "Quero ver os detalhes do produto abc123"');
  console.log('   Watson: "📦 Produto abc123 - Nome: iPhone 12 Pro..."');
};

// Executar demonstração
testWatsonDemo().catch(console.error);
