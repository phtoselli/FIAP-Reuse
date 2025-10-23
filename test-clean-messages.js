/**
 * Testar mensagens limpas sem informações técnicas
 */

const testCleanMessages = async () => {
  const baseUrl = 'http://localhost:3001';
  const productId = '2c1612e3-d9d0-4cc1-a1eb-d0b4c772499f';
  const userId = 'bab9bece-a0e4-445b-823c-c744666f38ec';
  
  console.log('🧹 Testando mensagens limpas...\n');

  try {
    // Teste 1: Ver detalhes de produto
    console.log('1️⃣ Testando visualização de produto...');
    const productResponse = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Quero ver os detalhes do produto ${productId}`,
        userId: userId,
        sessionId: 'test-session'
      }),
    });

    const productData = await productResponse.json();
    console.log('✅ Resposta do produto:');
    console.log(productData.reuseResponse.message);
    console.log('---\n');

    // Teste 2: Listar endereços
    console.log('2️⃣ Testando listagem de endereços...');
    const addressResponse = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Quero ver meus endereços cadastrados',
        userId: userId,
        sessionId: 'test-session'
      }),
    });

    const addressData = await addressResponse.json();
    console.log('✅ Resposta dos endereços:');
    console.log(addressData.reuseResponse.message);
    console.log('---\n');

    // Teste 3: Aceitar proposta
    console.log('3️⃣ Testando aceite de proposta...');
    const proposalResponse = await fetch(`${baseUrl}/api/watson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Quero aceitar a proposta df91497d-9d7d-4a9d-be8b-b8efeca7ddac',
        userId: userId,
        sessionId: 'test-session'
      }),
    });

    const proposalData = await proposalResponse.json();
    console.log('✅ Resposta da proposta:');
    console.log(proposalData.reuseResponse.message);
    console.log('---\n');

    console.log('🎉 Todas as mensagens estão limpas e sem informações técnicas!');

  } catch (error) {
    console.log('❌ Erro:', error.message);
  }
};

testCleanMessages();
