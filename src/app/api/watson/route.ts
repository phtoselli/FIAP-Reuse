import { NextRequest, NextResponse } from 'next/server';
import WatsonService from '@/service/watson/WatsonService';
import { ProductService } from '@/service/products';
import { AddressService } from '@/service/addresses';
import { ProposalService } from '@/service/proposals';

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
    } catch (watsonError: unknown) {
      const errorMessage = watsonError instanceof Error ? watsonError.message : 'Erro desconhecido';
      console.log('Watson Assistant não disponível, usando modo demonstração:', errorMessage);
      
      // Fallback para modo demonstração
      watsonResponse = simulateWatsonResponse(message);
      isRealWatson = false;
    }

    // Processar intenções específicas do ReUse
    const reUseResponse = await processReUseIntents(watsonResponse, userId, isRealWatson, message);

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
async function processReUseIntents(watsonResponse: any, userId?: string, isRealWatson: boolean = false, originalMessage?: string) {
  const response: any = {
    action: null,
    data: null,
    message: null,
  };

  // 1. Ver detalhes de produto - Fallback para detecção por texto
  const messageText = (originalMessage || '').toLowerCase();
  const hasProductIntent = watsonService.isProductDetailsIntent(watsonResponse) || 
                          messageText.includes('detalhes do produto') || 
                          messageText.includes('ver produto') ||
                          messageText.includes('produto');
  
  if (hasProductIntent) {
    // Tentar extrair ID do Watson primeiro, depois do texto da mensagem
    let productId = watsonService.extractProductId(watsonResponse);
    
    // Fallback: extrair ID da mensagem usando regex
    if (!productId && originalMessage) {
      const idMatch = originalMessage.match(/produto\s+([a-f0-9-]{36})/i);
      if (idMatch) {
        productId = idMatch[1];
      }
    }
    
    if (productId) {
      try {
        // Buscar detalhes reais do produto
        const productService = new ProductService();
        const productDetails = await productService.getProductById(productId);
        
        response.action = 'product_details';
        response.data = productDetails;
        
        response.message = `📦 **Produto ${productId}**\n\n` +
                         `🔍 **Detalhes:** ${productDetails?.nome || 'Produto encontrado'}\n` +
                         `📝 **Descrição:** ${productDetails?.descricao || 'Descrição não disponível'}\n` +
                         `🏷️ **Categoria:** ${productDetails?.categoria?.nome || 'Não informada'}\n` +
                         `📊 **Condição:** ${productDetails?.condicao?.descricao || 'Não informada'}\n` +
                         `👤 **Ofertante:** ${productDetails?.usuario?.nome || 'Não informado'}`;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        response.action = 'error';
        response.message = `❌ Erro ao buscar produto ${productId}: ${errorMessage}`;
      }
    } else {
      response.action = 'error';
      response.message = 'Por favor, forneça o ID do produto que deseja visualizar.';
    }
  }

  // 2. Listar endereços do usuário - Fallback para detecção por texto
  else if (watsonService.isListAddressesIntent(watsonResponse) || 
           messageText.includes('endereços') || 
           messageText.includes('enderecos') ||
           messageText.includes('endereço') ||
           messageText.includes('meus endereços') ||
           messageText.includes('listar endereços')) {
    try {
      // Buscar endereços reais do usuário
      const addressService = new AddressService();
      const addresses = await addressService.getAddressesByUserId(userId || '');
      
      response.action = 'list_addresses';
      response.data = addresses;
      
      let addressList = '';
      if (addresses && addresses.length > 0) {
        addressList = addresses.map((addr: any, index: number) => 
          `${index + 1}. **${addr.street}, ${addr.number}**\n   📍 ${addr.city}, ${addr.state}\n   📮 CEP: ${addr.zipCode}`
        ).join('\n\n');
      } else {
        addressList = 'Nenhum endereço cadastrado';
      }
      
      response.message = `🏠 **Seus Endereços**\n\n` +
                       `${addressList}`;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      response.action = 'error';
      response.message = `❌ Erro ao buscar endereços: ${errorMessage}`;
    }
  }

  // 3. Aceitar proposta de troca - Fallback para detecção por texto
  else if (watsonService.isAcceptProposalIntent(watsonResponse) ||
           messageText.includes('aceitar proposta') ||
           messageText.includes('aceitar') ||
           messageText.includes('proposta')) {
    // Tentar extrair ID do Watson primeiro, depois do texto da mensagem
    let proposalId = watsonService.extractProposalId(watsonResponse);
    
    // Fallback: extrair ID da mensagem usando regex
    if (!proposalId && originalMessage) {
      const idMatch = originalMessage.match(/proposta\s+([a-f0-9-]{36})/i);
      if (idMatch) {
        proposalId = idMatch[1];
      }
    }
    
    if (proposalId) {
      try {
        // Aceitar proposta real
        const proposalService = new ProposalService();
        const result = await proposalService.acceptProposal(proposalId, userId || '');
        
        response.action = 'accept_proposal';
        response.data = result;
        
        response.message = `✅ **Proposta ${proposalId} Aceita!**\n\n` +
                         `🎉 **Status:** Proposta aceita com sucesso\n` +
                         `📋 **Detalhes:** ${result?.message || 'Proposta processada'}`;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        response.action = 'error';
        response.message = `❌ Erro ao aceitar proposta ${proposalId}: ${errorMessage}`;
      }
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
    } catch (watsonError: unknown) {
      const errorMessage = watsonError instanceof Error ? watsonError.message : 'Erro desconhecido';
      console.log('Watson Assistant não disponível, usando sessão de demonstração:', errorMessage);
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