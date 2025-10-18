import AssistantV1 from 'ibm-watson/assistant/v1';
import { IamAuthenticator } from 'ibm-watson/auth';

export interface WatsonMessage {
  text: string;
  userId?: string;
  sessionId?: string;
}

export interface WatsonResponse {
  output: {
    generic: Array<{
      response_type: string;
      text?: string;
      title?: string;
      options?: Array<{
        label: string;
        value: {
          input: {
            text: string;
          };
        };
      }>;
    }>;
    intents?: Array<{
      intent: string;
      confidence: number;
    }>;
    entities?: Array<{
      entity: string;
      value: string;
      confidence: number;
    }>;
  };
  context?: {
    session_id?: string;
    user_id?: string;
    product_id?: string;
    proposal_id?: string;
  };
}

export class WatsonService {
  private assistant: AssistantV1;
  private workspaceId: string;

  constructor() {
    this.assistant = new AssistantV1({
      version: '2021-11-27',
      authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_API_KEY || 'Lom8024k7Y365OsyUsCXUmaGALnfgbBoTOqwkv12eeXm',
      }),
      serviceUrl: process.env.WATSON_URL || 'https://api.au-syd.assistant.watson.cloud.ibm.com/instances/747d821a-e028-437b-bc06-317f97112a5c',
    });
    
    // Usar o Workspace ID correto da sua habilidade
    this.workspaceId = '74e14f07-29b0-49c0-b52e-b23ea8f0bf2b';
  }

  /**
   * Cria uma nova sessão com o Watson Assistant (V1 não precisa de createSession)
   */
  async createSession(): Promise<string> {
    // Na API V1, a sessão é criada automaticamente
    return 'session-' + Date.now();
  }

  /**
   * Envia uma mensagem para o Watson Assistant
   */
  async sendMessage(message: WatsonMessage): Promise<WatsonResponse> {
    try {
      const response = await this.assistant.message({
        workspaceId: this.workspaceId,
        input: {
          text: message.text,
        },
        context: {
          user_id: message.userId,
        },
      });

      return response.result as WatsonResponse;
    } catch (error) {
      console.error('Erro ao enviar mensagem para Watson:', error);
      throw new Error('Falha ao processar mensagem no Watson Assistant');
    }
  }

  /**
   * Processa comandos específicos do ReUse
   */
  async processReUseCommand(command: string, userId?: string, sessionId?: string): Promise<WatsonResponse> {
    const message: WatsonMessage = {
      text: command,
      userId,
      sessionId,
    };

    return await this.sendMessage(message);
  }

  /**
   * Verifica se a mensagem contém intenção de ver detalhes de produto
   */
  isProductDetailsIntent(response: WatsonResponse): boolean {
    return response.output.intents?.some(
      intent => intent.intent === 'ver_detalhes_produto' && intent.confidence > 0.7
    ) || false;
  }

  /**
   * Verifica se a mensagem contém intenção de listar endereços
   */
  isListAddressesIntent(response: WatsonResponse): boolean {
    return response.output.intents?.some(
      intent => intent.intent === 'listar_enderecos' && intent.confidence > 0.7
    ) || false;
  }

  /**
   * Verifica se a mensagem contém intenção de aceitar proposta
   */
  isAcceptProposalIntent(response: WatsonResponse): boolean {
    return response.output.intents?.some(
      intent => intent.intent === 'aceitar_proposta' && intent.confidence > 0.7
    ) || false;
  }

  /**
   * Extrai ID do produto da resposta
   */
  extractProductId(response: WatsonResponse): string | null {
    const productEntity = response.output.entities?.find(
      entity => entity.entity === 'product_id'
    );
    return productEntity?.value || null;
  }

  /**
   * Extrai ID da proposta da resposta
   */
  extractProposalId(response: WatsonResponse): string | null {
    const proposalEntity = response.output.entities?.find(
      entity => entity.entity === 'proposal_id'
    );
    return proposalEntity?.value || null;
  }
}

export default WatsonService;
