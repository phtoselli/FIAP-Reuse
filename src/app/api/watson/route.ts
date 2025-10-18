import { NextRequest, NextResponse } from 'next/server';
import WatsonService from '@/service/watson/WatsonService';

const watsonService = new WatsonService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    let watsonResponse;
    let isRealWatson = false;

    try {
      // Tentar usar o Watson Assistant real
      watsonResponse = await watsonService.sendMessage({
        text: message,
        userId,
        sessionId,
      });
      isRealWatson = true;
    } catch (watsonError) {
      console.log('Watson Assistant não disponível, usando modo demonstração:', watsonError.message);
      
      // Fallback para modo demonstração
      watsonResponse = simulateWatsonResponse(message);
      isRealWatson = false;
    }

    // Processar intenções específicas do ReUse
    const reUseResponse = await processReUseIntents(watsonResponse, userId, isRealWatson);

    return NextResponse.json({
      success: true,
      watsonResponse: watsonResponse.output,
      reuseResponse: reUseResponse,
      sessionId: sessionId || 'demo-session-123',
      isRealWatson: isRealWatson,
    });

  } catch (error) {
    console.error('Erro no endpoint do Watson:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Função para simular resposta do Watson (fallback)
function simulateWatsonResponse(message: string) {
  const lowerMessage = message.toLowerCase();
  
  // Simular detecção de intenções baseada em palavras-chave
  if (lowerMessage.includes('produto') || lowerMessage.includes('item') || lowerMessage.includes('detalhes')) {
    return {
      output: {
        generic: [{ response_type: 'text', text: 'Vou buscar os detalhes do produto para você!' }],
        intents: [{ intent: 'ver_detalhes_produto', confidence: 0.9 }],
        entities: [{ entity: 'product_id', value: 'abc123', confidence: 0.8 }]
      }
    };
  }
  
  if (lowerMessage.includes('endereço') || lowerMessage.includes('enderecos')) {
    return {
      output: {
        generic: [{ response_type: 'text', text: 'Vou listar seus endereços!' }],
        intents: [{ intent: 'listar_enderecos', confidence: 0.9 }],
        entities: []
      }
    };
  }
  
  if (lowerMessage.includes('aceitar') || lowerMessage.includes('proposta')) {
    return {
      output: {
        generic: [{ response_type: 'text', text: 'Vou aceitar a proposta para você!' }],
        intents: [{ intent: 'aceitar_proposta', confidence: 0.9 }],
        entities: [{ entity: 'proposal_id', value: 'prop456', confidence: 0.8 }]
      }
    };
  }
  
  // Resposta padrão
  return {
    output: {
      generic: [{ response_type: 'text', text: 'Olá! Como posso ajudá-lo hoje?' }],
      intents: [],
      entities: []
    }
  };
}


/**
 * Processa as intenções específicas do ReUse
 */
async function processReUseIntents(watsonResponse: any, userId?: string, isRealWatson: boolean = false) {
  const response: any = {
    action: null,
    data: null,
    message: null,
  };

  // 1. Ver detalhes de produto
  if (watsonService.isProductDetailsIntent(watsonResponse)) {
    const productId = watsonService.extractProductId(watsonResponse);
    
    if (productId) {
      response.action = 'product_details';
      response.data = { id: productId };
      const statusMessage = isRealWatson 
        ? '🔗 **Status:** Conectado ao Watson Assistant real' 
        : '📝 **Status:** Modo demonstração (Watson não disponível)';
      
      response.message = `📦 **Produto ${productId}**\n\n` +
                       `🔍 **Detalhes:** Produto identificado com sucesso!\n` +
                       `${statusMessage}\n` +
                       `💡 **Próximo passo:** Conectar banco de dados para buscar informações completas\n\n` +
                       `**Funcionalidade implementada:** ✅\n` +
                       `**Watson detectou:** Intenção de ver produto\n` +
                       `**ID extraído:** ${productId}`;
    } else {
      response.action = 'error';
      response.message = 'Por favor, forneça o ID do produto que deseja visualizar.';
    }
  }

  // 2. Listar endereços do usuário
  else if (watsonService.isListAddressesIntent(watsonResponse)) {
    response.action = 'list_addresses';
    response.data = [];
    const statusMessage = isRealWatson 
      ? '🔗 **Status:** Conectado ao Watson Assistant real' 
      : '📝 **Status:** Modo demonstração (Watson não disponível)';
    
    response.message = `🏠 **Seus Endereços**\n\n` +
                     `${statusMessage}\n` +
                     `💡 **Próximo passo:** Conectar banco de dados para buscar endereços\n\n` +
                     `**Funcionalidade implementada:** ✅\n` +
                     `**Watson detectou:** Intenção de listar endereços\n` +
                     `**Usuário:** ${userId || 'Não informado'}`;
  }

  // 3. Aceitar proposta de troca
  else if (watsonService.isAcceptProposalIntent(watsonResponse)) {
    const proposalId = watsonService.extractProposalId(watsonResponse);
    
    if (proposalId) {
      response.action = 'accept_proposal';
      response.data = { id: proposalId };
      const statusMessage = isRealWatson 
        ? '🔗 **Status:** Conectado ao Watson Assistant real' 
        : '📝 **Status:** Modo demonstração (Watson não disponível)';
      
      response.message = `✅ **Proposta ${proposalId}**\n\n` +
                       `${statusMessage}\n` +
                       `💡 **Próximo passo:** Conectar banco de dados para aceitar proposta\n\n` +
                       `**Funcionalidade implementada:** ✅\n` +
                       `**Watson detectou:** Intenção de aceitar proposta\n` +
                       `**ID extraído:** ${proposalId}\n` +
                       `**Usuário:** ${userId || 'Não informado'}`;
    } else {
      response.action = 'error';
      response.message = 'Por favor, forneça o ID da proposta que deseja aceitar.';
    }
  }

  // Resposta padrão do Watson
  else {
    response.action = 'chat';
    response.message = watsonResponse.output.generic?.[0]?.text || 'Como posso ajudá-lo hoje?';
  }

  return response;
}


/**
 * Endpoint para criar nova sessão
 */
export async function GET(request: NextRequest) {
  try {
    let sessionId;
    let isRealWatson = false;
    
    try {
      // Tentar criar sessão real do Watson
      sessionId = await watsonService.createSession();
      isRealWatson = true;
    } catch (watsonError) {
      console.log('Watson Assistant não disponível, usando sessão de demonstração:', watsonError.message);
      // Fallback para sessão de demonstração
      sessionId = 'demo-session-' + Date.now();
      isRealWatson = false;
    }
    
    return NextResponse.json({
      success: true,
      sessionId,
      message: isRealWatson ? 'Sessão do Watson criada com sucesso' : 'Sessão de demonstração criada',
      isRealWatson,
    });

  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    return NextResponse.json(
      { error: 'Erro ao criar sessão do Watson' },
      { status: 500 }
    );
  }
}