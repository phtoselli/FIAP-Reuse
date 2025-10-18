"use client";

import { useState, useCallback } from 'react';
import { message } from 'antd';

interface WatsonResponse {
  success: boolean;
  watsonResponse?: any;
  reuseResponse?: {
    action: string;
    data: any;
    message: string;
  };
  sessionId?: string;
  error?: string;
}

interface UseWatsonReturn {
  sendMessage: (text: string, userId?: string) => Promise<WatsonResponse>;
  isLoading: boolean;
  sessionId: string | null;
  createSession: () => Promise<void>;
}

export function useWatson(): UseWatsonReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const createSession = useCallback(async () => {
    try {
      const response = await fetch('/api/watson', {
        method: 'GET',
      });
      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.sessionId);
        return data.sessionId;
      } else {
        throw new Error(data.error || 'Erro ao criar sessão');
      }
    } catch (error) {
      console.error('Erro ao criar sessão do Watson:', error);
      message.error('Erro ao conectar com o assistente');
      throw error;
    }
  }, []);

  const sendMessage = useCallback(async (
    text: string, 
    userId?: string
  ): Promise<WatsonResponse> => {
    if (!text.trim()) {
      return {
        success: false,
        error: 'Mensagem não pode estar vazia',
      };
    }

    setIsLoading(true);

    try {
      // Cria sessão se não existir
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await createSession();
      }

      const response = await fetch('/api/watson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          userId,
          sessionId: currentSessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          watsonResponse: data.watsonResponse,
          reuseResponse: data.reuseResponse,
          sessionId: data.sessionId,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Erro ao processar mensagem',
        };
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem para Watson:', error);
      return {
        success: false,
        error: 'Erro de conexão com o assistente',
      };
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, createSession]);

  return {
    sendMessage,
    isLoading,
    sessionId,
    createSession,
  };
}

// Hook específico para ações do ReUse
export function useWatsonActions() {
  const { sendMessage, isLoading } = useWatson();

  const getProductDetails = useCallback(async (productId: string, userId?: string) => {
    const response = await sendMessage(`Quero ver os detalhes do produto ${productId}`, userId);
    
    if (response.success && response.reuseResponse?.action === 'product_details') {
      return response.reuseResponse.data;
    }
    
    throw new Error(response.error || 'Erro ao buscar detalhes do produto');
  }, [sendMessage]);

  const listUserAddresses = useCallback(async (userId: string) => {
    const response = await sendMessage('Quero ver meus endereços cadastrados', userId);
    
    if (response.success && response.reuseResponse?.action === 'list_addresses') {
      return response.reuseResponse.data;
    }
    
    throw new Error(response.error || 'Erro ao buscar endereços');
  }, [sendMessage]);

  const acceptProposal = useCallback(async (proposalId: string, userId: string) => {
    const response = await sendMessage(`Quero aceitar a proposta ${proposalId}`, userId);
    
    if (response.success && response.reuseResponse?.action === 'accept_proposal') {
      return response.reuseResponse.data;
    }
    
    throw new Error(response.error || 'Erro ao aceitar proposta');
  }, [sendMessage]);

  return {
    getProductDetails,
    listUserAddresses,
    acceptProposal,
    isLoading,
  };
}

export default useWatson;
