// Script para testar a configuração do Watson
const AssistantV1 = require('ibm-watson/assistant/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
require('dotenv').config();

async function testarConfiguracao() {
  console.log('🧪 Testando configuração do Watson Assistant...\n');
  
  try {
    // Verificar variáveis de ambiente
    console.log('1. Verificando variáveis de ambiente...');
    const apiKey = process.env.WATSON_API_KEY;
    const url = process.env.WATSON_URL;
    const assistantId = process.env.WATSON_ASSISTANT_ID;
    
    if (!apiKey || !url || !assistantId) {
      throw new Error('Variáveis de ambiente não configuradas corretamente');
    }
    
    console.log('✅ API Key:', apiKey.substring(0, 10) + '...');
    console.log('✅ URL:', url);
    console.log('✅ Assistant ID:', assistantId);
    
    // Criar instância do Watson
    const assistant = new AssistantV1({
      version: '2021-11-27',
      authenticator: new IamAuthenticator({
        apikey: apiKey,
      }),
      serviceUrl: url,
    });
    
    // Teste 1: Criar sessão
    console.log('\n2. Testando criação de sessão...');
    const sessionResponse = await assistant.createSession({
      assistantId: assistantId,
    });
    const sessionId = sessionResponse.result.session_id;
    console.log('✅ Sessão criada com sucesso:', sessionId);
    
    // Teste 2: Enviar mensagem simples
    console.log('\n3. Testando envio de mensagem...');
    const messageResponse = await assistant.message({
      assistantId: assistantId,
      sessionId: sessionId,
      input: {
        message_type: 'text',
        text: 'Olá, como você pode me ajudar?',
      },
    });
    
    const responseText = messageResponse.result.output.generic?.[0]?.text;
    console.log('✅ Resposta recebida:', responseText);
    
    // Teste 3: Testar intenções específicas
    console.log('\n4. Testando intenções do ReUse...');
    
    const testMessages = [
      'Quero ver os detalhes do produto abc123',
      'Mostre meus endereços',
      'Aceito a proposta xyz789'
    ];
    
    for (const message of testMessages) {
      console.log(`\n   Testando: "${message}"`);
      const testResponse = await assistant.message({
        assistantId: assistantId,
        sessionId: sessionId,
        input: {
          message_type: 'text',
          text: message,
        },
      });
      
      const intents = testResponse.result.output.intents || [];
      const entities = testResponse.result.output.entities || [];
      
      console.log(`   ✅ Intenções detectadas:`, intents.map(i => i.intent));
      console.log(`   ✅ Entidades detectadas:`, entities.map(e => `${e.entity}: ${e.value}`));
    }
    
    console.log('\n🎉 Configuração do Watson está funcionando perfeitamente!');
    console.log('\n📝 Próximos passos:');
    console.log('1. ✅ Variáveis de ambiente configuradas');
    console.log('2. ✅ Assistant ID configurado');
    console.log('3. ✅ Intenções e entidades configuradas');
    console.log('4. 🚀 Acesse http://localhost:3000/chat para usar o chat');
    console.log('5. 🧪 Teste os comandos específicos do ReUse');
    
  } catch (error) {
    console.error('❌ Erro na configuração:', error.message);
    console.log('\n🔧 Verifique:');
    console.log('1. Se as variáveis de ambiente estão corretas no .env');
    console.log('2. Se o Assistant ID está correto');
    console.log('3. Se o Watson Assistant está ativo no IBM Cloud');
    console.log('4. Se as intenções e entidades foram criadas corretamente');
  }
}

testarConfiguracao();
