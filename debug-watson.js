/**
 * Debug do Watson - ver o que está sendo retornado
 */

const debugWatson = async () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔍 Debug do Watson - Verificando resposta completa...\n');

  try {
    const response = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Quero ver os detalhes do produto 697d00d3-10d8-4a83-b945-0af155335a14',
        userId: 'user-123',
        sessionId: 'test-session'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Resposta completa do Watson:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n🔍 Análise:');
    console.log('- Success:', data.success);
    console.log('- Is Real Watson:', data.isRealWatson);
    console.log('- Action:', data.reuseResponse.action);
    console.log('- Message:', data.reuseResponse.message);
    
    if (data.watsonResponse) {
      console.log('\n🤖 Resposta do Watson Assistant:');
      console.log('- Intents:', data.watsonResponse.intents);
      console.log('- Entities:', data.watsonResponse.entities);
      console.log('- Generic:', data.watsonResponse.generic);
    }
    
  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

// Executar debug
debugWatson().catch(console.error);
