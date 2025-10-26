import { NextRequest, NextResponse } from 'next/server';
import WatsonService from '@/service/watson/WatsonService';
import { AddressService } from '@/service/addresses';
import { ProposalService } from '@/service/proposals/ProposalService';

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
  if (lowerMessage.includes('endereço') || lowerMessage.includes('enderecos')) {
    return {
      output: {
        generic: [{ response_type: 'text', text: 'Vou listar seus endereços!' }],
        intents: [{ intent: 'listar_enderecos', confidence: 0.9 }],
        entities: []
      }
    };
  }
  
  if (lowerMessage.includes('cadastrar') || lowerMessage.includes('cadastro')) {
    return {
      output: {
        generic: [{ response_type: 'text', text: 'Vou te ajudar a cadastrar um item!' }],
        intents: [{ intent: 'help_cadastro', confidence: 0.9 }],
        entities: []
      }
    };
  }
  
  if (lowerMessage.includes('proposta') || lowerMessage.includes('negociar')) {
    return {
      output: {
        generic: [{ response_type: 'text', text: 'Vou te orientar sobre propostas!' }],
        intents: [{ intent: 'help_propostas', confidence: 0.9 }],
        entities: []
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
 * Processa as intenções específicas do ReUse - Foco em orientação
 */
async function processReUseIntents(watsonResponse: any, userId?: string, isRealWatson: boolean = false, originalMessage?: string) {
  const response: any = {
    action: null,
    data: null,
    message: null,
  };

  const messageText = (originalMessage || '').toLowerCase();

  // PRIORIDADE 1: Se o Watson retornou uma resposta válida, usar ela (sempre priorizar Watson)
  // MAS: Se for comando específico do ReUse, processar primeiro
  const isReUseCommand = messageText.includes('aceitar proposta') || 
                        messageText.includes('propostas recebidas') ||
                        messageText.includes('propostas pendentes') ||
                        messageText.includes('propostas') ||
                        messageText.includes('minhas propostas') ||
                        messageText.includes('aceitar a proposta') ||
                        messageText.includes('meus endereços') ||
                        messageText.includes('endereços') ||
                        messageText.includes('listar endereços') ||
                        messageText.includes('detalhes de endereço') ||
                        messageText.includes('detalhes endereço') ||
                        messageText.includes('endereço');
  
  if (isRealWatson && watsonResponse?.output?.generic?.[0]?.text && !isReUseCommand) {
    response.action = 'chat';
    response.message = watsonResponse.output.generic[0].text;
    return response;
  }

  // PRIORIDADE 2: Automações específicas do ReUse
  // 1. Listar endereços do usuário
  if (watsonService.isListAddressesIntent(watsonResponse) || 
      messageText.includes('endereços') || 
      messageText.includes('enderecos') ||
      messageText.includes('endereço') ||
      messageText.includes('meus endereços') ||
      messageText.includes('listar endereços')) {
    try {
      const addressService = new AddressService();
      const addresses = await addressService.getAddressesByUserId(userId || '');
      
      response.action = 'list_addresses';
      response.data = addresses;
      
      let addressList = '';
      const addressArray = addresses?.enderecos || addresses || [];
      if (addressArray && addressArray.length > 0) {
        addressList = addressArray.map((addr: any, index: number) => 
          `${index + 1}. **${addr.street}**\n   📍 ${addr.city}, ${addr.state}\n   📮 CEP: ${addr.zipCode}`
        ).join('\n\n');
      } else {
        addressList = 'Nenhum endereço cadastrado';
      }
      
      response.message = `🏠 **Seus Endereços**\n\n${addressList}`;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      response.action = 'error';
      response.message = `❌ Erro ao buscar endereços: ${errorMessage}`;
    }
  }

         // 2. Listar propostas recebidas
         else if (messageText.includes('propostas recebidas') ||
                  messageText.includes('propostas') ||
                  messageText.includes('minhas propostas') ||
                  messageText.includes('propostas pendentes')) {
           try {
             const proposalService = new ProposalService();
             const proposals = await proposalService.getProposalsByUserId(userId || '', 'responder');

             response.action = 'list_proposals';
             response.data = proposals;

             // Filtrar apenas propostas pendentes
             const pendingProposals = proposals?.filter((prop: any) => prop.status === 'pending') || [];

             let proposalList = '';
             if (pendingProposals && pendingProposals.length > 0) {
               proposalList = pendingProposals.map((prop: any, index: number) => {
                 return `**${index + 1}. ${prop.requester.name}**\n   "${prop.message.substring(0, 40)}..."\n   📅 ${new Date(prop.createdAt).toLocaleDateString('pt-BR')}\n   ⏳ **Status:** Pendente\n   🆔 **ID:** \`${prop.id}\``;
               }).join('\n\n');
             } else {
               proposalList = 'Nenhuma proposta pendente';
             }

             response.message = `⏳ **Propostas Pendentes**\n\n${proposalList}\n\n💬 **Para aceitar uma proposta, digite:** "aceitar proposta [ID]"`;
           } catch (error: unknown) {
             const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
             response.action = 'error';
             response.message = `❌ Erro ao buscar propostas: ${errorMessage}`;
           }
         }

  // 3. Aceitar proposta via chat
  else if (messageText.includes('aceitar proposta') || 
           messageText.includes('aceitar a proposta')) {
    try {
      // Extrair ID da proposta da mensagem
      const idMatch = messageText.match(/aceitar (?:a )?proposta\s+([a-f0-9-]+)/i);
      if (!idMatch) {
        response.action = 'error';
        response.message = '❌ **ID da proposta não encontrado.**\n\n💡 **Formato correto:** "aceitar proposta [ID]"';
        return response;
      }
      
      const proposalId = idMatch[1];
      const proposalService = new ProposalService();
      
      // Aceitar a proposta
      await proposalService.acceptProposal(proposalId, userId || '');
      
      response.action = 'accept_proposal';
      response.data = { 
        proposalId,
        redirectTo: `/trades/finalize_exchange?proposalId=${proposalId}`
      };
      response.message = `✅ **Proposta aceita com sucesso!**\n\n🔄 A proposta foi aceita e o usuário será notificado.\n\n🚀 **Redirecionando para finalização da troca...**`;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      response.action = 'error';
      response.message = `❌ Erro ao aceitar proposta: ${errorMessage}`;
    }
  }

  // 4. Orientação sobre cadastro de itens
  else if (messageText.includes('cadastrar') || 
           messageText.includes('cadastro') ||
           messageText.includes('como cadastrar') ||
           messageText.includes('novo item') ||
           messageText.includes('adicionar produto')) {
    response.action = 'help';
    response.message = `📝 **Como Cadastrar um Novo Item para Troca**\n\n` +
                      `1️⃣ **Acesse "Minhas Publicações"** no menu\n\n` +
                      `2️⃣ **Clique em "Nova Publicação"**\n\n` +
                      `3️⃣ **Preencha os dados:**\n` +
                      `   • Título do item\n` +
                      `   • Descrição detalhada\n` +
                      `   • Categoria e subcategoria\n` +
                      `   • Condição do item\n` +
                      `   • Foto do produto\n\n` +
                      `4️⃣ **Clique em "Publicar"**\n\n` +
                      `💡 **Dica:** Seja específico na descrição para atrair mais interessados!`;
  }

  // 3. Orientação sobre como fazer propostas
  else if (messageText.includes('proposta') ||
           messageText.includes('como fazer proposta') ||
           messageText.includes('negociar') ||
           messageText.includes('trocar')) {
    response.action = 'help';
    response.message = `🤝 **Como Fazer uma Proposta de Troca**\n\n` +
                      `1️⃣ **Navegue pelos produtos** na página "Publicações"\n\n` +
                      `2️⃣ **Clique no item** que te interessa\n\n` +
                      `3️⃣ **Clique em "Fazer Proposta"**\n\n` +
                      `4️⃣ **Descreva sua oferta:**\n` +
                      `   • O que você tem para trocar\n` +
                      `   • Por que a troca seria interessante\n` +
                      `   • Seu interesse no item\n\n` +
                      `5️⃣ **Envie a proposta** e aguarde resposta\n\n` +
                      `💡 **Dica:** Seja educado e específico sobre sua oferta!`;
  }

  // 4. Orientação sobre navegação na plataforma
  else if (messageText.includes('navegar') ||
           messageText.includes('como usar') ||
           messageText.includes('funcionalidades') ||
           messageText.includes('ajuda')) {
    response.action = 'help';
    response.message = `🧭 **Como Navegar na Plataforma ReUse**\n\n` +
                      `📋 **Menu Principal:**\n` +
                      `• **Publicações** - Veja todos os itens disponíveis\n` +
                      `• **Minhas Publicações** - Gerencie seus itens\n` +
                      `• **Propostas** - Veja suas negociações\n` +
                      `• **Usuários** - Perfil e configurações\n\n` +
                      `🎯 **Principais Funcionalidades:**\n` +
                      `• Cadastrar itens para troca\n` +
                      `• Fazer propostas de troca\n` +
                      `• Gerenciar endereços\n` +
                      `• Acompanhar negociações\n\n` +
                      `❓ **Precisa de ajuda específica?** Digite sua dúvida!`;
  }

  // 5. Orientação sobre endereços
  else if (messageText.includes('endereço') ||
           messageText.includes('enderecos') ||
           messageText.includes('cadastrar endereço')) {
    response.action = 'help';
    response.message = `🏠 **Como Gerenciar Endereços**\n\n` +
                      `1️⃣ **Acesse "Usuários"** no menu\n\n` +
                      `2️⃣ **Vá para "Endereços"**\n\n` +
                      `3️⃣ **Clique em "Adicionar Endereço"**\n\n` +
                      `4️⃣ **Preencha os dados:**\n` +
                      `   • Rua e número\n` +
                      `   • Cidade e estado\n` +
                      `   • CEP\n` +
                      `   • Complemento (opcional)\n\n` +
                      `5️⃣ **Salve o endereço**\n\n` +
                      `💡 **Dica:** Cadastre endereços para facilitar as trocas!`;
  }

  // 6. Orientação sobre segurança
  else if (messageText.includes('segurança') ||
           messageText.includes('seguro') ||
           messageText.includes('confiança') ||
           messageText.includes('fraude')) {
    response.action = 'help';
    response.message = `🔒 **Dicas de Segurança na ReUse**\n\n` +
                      `✅ **Sempre:**\n` +
                      `• Conheça a pessoa antes de trocar\n` +
                      `• Combine encontros em locais públicos\n` +
                      `• Verifique o estado real do item\n` +
                      `• Tire fotos antes e depois da troca\n\n` +
                      `❌ **Nunca:**\n` +
                      `• Envie dinheiro antecipadamente\n` +
                      `• Troque sem ver o item pessoalmente\n` +
                      `• Forneça dados bancários\n` +
                      `• Aceite propostas suspeitas\n\n` +
                      `🆘 **Em caso de problemas:**\n` +
                      `Entre em contato com o suporte!`;
  }

  // Resposta padrão do ReUse (fallback apenas quando Watson não responde)
  else {
    response.action = 'chat';
    response.message = `👋 **Olá! Sou o assistente da ReUse**\n\n` +
                      `Posso te ajudar com:\n` +
                      `• 📝 Como cadastrar itens\n` +
                      `• 🤝 Como fazer propostas\n` +
                      `• 🏠 Gerenciar endereços\n` +
                      `• 🧭 Navegar na plataforma\n` +
                      `• 🔒 Dicas de segurança\n\n` +
                      `**O que você gostaria de saber?**`;
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