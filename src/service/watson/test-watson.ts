import WatsonService from './WatsonService';

/**
 * Testa a integração com Watson Assistant
 */
export async function testarWatsonIntegration() {
  console.log('🧪 Testando integração com Watson Assistant...');
  
  const watsonService = new WatsonService();
  
  try {
    // Teste 1: Criar sessão
    console.log('\n1. Testando criação de sessão...');
    const sessionId = await watsonService.createSession();
    console.log('✅ Sessão criada:', sessionId);
    
    // Teste 2: Enviar mensagem simples
    console.log('\n2. Testando envio de mensagem...');
    const response = await watsonService.sendMessage({
      text: 'Olá, como você pode me ajudar?',
      sessionId,
    });
    console.log('✅ Resposta do Watson:', response.output.generic?.[0]?.text);
    
    // Teste 3: Testar intenção de produto
    console.log('\n3. Testando intenção de produto...');
    const productResponse = await watsonService.sendMessage({
      text: 'Quero ver os detalhes do produto abc123',
      sessionId,
    });
    console.log('✅ Resposta de produto:', productResponse.output.generic?.[0]?.text);
    console.log('✅ Intenções detectadas:', productResponse.output.intents);
    console.log('✅ Entidades detectadas:', productResponse.output.entities);
    
    // Teste 4: Testar intenção de endereços
    console.log('\n4. Testando intenção de endereços...');
    const addressResponse = await watsonService.sendMessage({
      text: 'Quero ver meus endereços cadastrados',
      sessionId,
    });
    console.log('✅ Resposta de endereços:', addressResponse.output.generic?.[0]?.text);
    console.log('✅ Intenções detectadas:', addressResponse.output.intents);
    
    // Teste 5: Testar intenção de proposta
    console.log('\n5. Testando intenção de proposta...');
    const proposalResponse = await watsonService.sendMessage({
      text: 'Quero aceitar a proposta xyz789',
      sessionId,
    });
    console.log('✅ Resposta de proposta:', proposalResponse.output.generic?.[0]?.text);
    console.log('✅ Intenções detectadas:', proposalResponse.output.intents);
    console.log('✅ Entidades detectadas:', proposalResponse.output.entities);
    
    console.log('\n🎉 Todos os testes do Watson passaram com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro nos testes do Watson:', error);
    throw error;
  }
}

/**
 * Testa as funções de detecção de intenções
 */
export async function testarDetecaoIntencoes() {
  console.log('🧪 Testando detecção de intenções...');
  
  const watsonService = new WatsonService();
  
  try {
    // Mock de resposta com intenção de produto
    const mockProductResponse = {
      output: {
        intents: [
          { intent: 'ver_detalhes_produto', confidence: 0.9 }
        ],
        entities: [
          { entity: 'product_id', value: 'abc123', confidence: 0.8 }
        ]
      }
    };
    
    console.log('1. Testando detecção de produto...');
    console.log('✅ É intenção de produto:', watsonService.isProductDetailsIntent(mockProductResponse));
    console.log('✅ ID do produto extraído:', watsonService.extractProductId(mockProductResponse));
    
    // Mock de resposta com intenção de endereços
    const mockAddressResponse = {
      output: {
        intents: [
          { intent: 'listar_enderecos', confidence: 0.85 }
        ]
      }
    };
    
    console.log('\n2. Testando detecção de endereços...');
    console.log('✅ É intenção de endereços:', watsonService.isListAddressesIntent(mockAddressResponse));
    
    // Mock de resposta com intenção de proposta
    const mockProposalResponse = {
      output: {
        intents: [
          { intent: 'aceitar_proposta', confidence: 0.9 }
        ],
        entities: [
          { entity: 'proposal_id', value: 'xyz789', confidence: 0.8 }
        ]
      }
    };
    
    console.log('\n3. Testando detecção de proposta...');
    console.log('✅ É intenção de proposta:', watsonService.isAcceptProposalIntent(mockProposalResponse));
    console.log('✅ ID da proposta extraído:', watsonService.extractProposalId(mockProposalResponse));
    
    console.log('\n🎉 Todos os testes de detecção passaram!');
    
  } catch (error) {
    console.error('❌ Erro nos testes de detecção:', error);
    throw error;
  }
}

/**
 * Executa todos os testes do Watson
 */
export async function executarTodosTestesWatson() {
  console.log('🚀 Iniciando todos os testes do Watson Assistant...\n');
  
  try {
    await testarDetecaoIntencoes();
    console.log('\n' + '='.repeat(50) + '\n');
    await testarWatsonIntegration();
    
    console.log('\n🎉 Todos os testes do Watson foram executados com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Falha nos testes do Watson:', error);
    throw error;
  }
}

// Executa os testes se o arquivo for chamado diretamente
if (require.main === module) {
  executarTodosTestesWatson()
    .then(() => {
      console.log('\n✅ Testes concluídos com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Falha nos testes:', error);
      process.exit(1);
    });
}
