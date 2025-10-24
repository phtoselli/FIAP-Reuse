"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Avatar, Typography, Space, message } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  action?: string;
  data?: any;
}

interface WatsonChatProps {
  userId?: string;
  onListAddresses?: (userId: string) => void;
}

export default function WatsonChat({ 
  userId, 
  onListAddresses 
}: WatsonChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do ReUse. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cria sessão inicial
  useEffect(() => {
    createSession();
  }, []);

  const createSession = async () => {
    try {
      const response = await fetch('/api/watson', {
        method: 'GET',
      });
      const data = await response.json();
      
      if (data.success) {
        setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/watson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId,
          sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.reuseResponse.message || 'Como posso ajudá-lo?',
          isUser: false,
          timestamp: new Date(),
          action: data.reuseResponse.action,
          data: data.reuseResponse.data,
        };

        setMessages(prev => [...prev, botMessage]);

        // Processa ações específicas
        if (data.reuseResponse.action === 'list_addresses' && onListAddresses) {
          onListAddresses(userId || '');
        }
      } else {
        message.error('Erro ao processar mensagem');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      message.error('Erro de conexão com o assistente');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    {
      label: 'Meus endereços',
      action: () => {
        setInputMessage('Quero ver meus endereços cadastrados');
      }
    },
    {
      label: 'Como cadastrar item',
      action: () => {
        setInputMessage('Como cadastrar um item?');
      }
    },
    {
      label: 'Dicas de segurança',
      action: () => {
        setInputMessage('Dicas de segurança');
      }
    }
  ];

  return (
    <Card 
      title={
        <Space>
          <RobotOutlined />
          <span>Assistente ReUse</span>
        </Space>
      }
      style={{ height: '600px', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0 }}
    >
      {/* Área de mensagens */}
      <div 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <Avatar
              icon={msg.isUser ? <UserOutlined /> : <RobotOutlined />}
              style={{
                backgroundColor: msg.isUser ? '#1890ff' : '#52c41a',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                maxWidth: '70%',
                backgroundColor: msg.isUser ? '#1890ff' : '#f5f5f5',
                color: msg.isUser ? 'white' : 'black',
                padding: '8px 12px',
                borderRadius: '12px',
                wordBreak: 'break-word',
              }}
            >
              <Text style={{ color: msg.isUser ? 'white' : 'black' }}>
                {msg.text}
              </Text>
              {msg.data && (
                <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
                  {msg.action === 'product_details' && (
                    <Text style={{ color: msg.isUser ? 'white' : 'black' }}>
                      📦 Produto: {msg.data.title}
                    </Text>
                  )}
                  {msg.action === 'list_addresses' && (
                    <Text style={{ color: msg.isUser ? 'white' : 'black' }}>
                      🏠 {msg.data.length} endereço(s) encontrado(s)
                    </Text>
                  )}
                  {msg.action === 'accept_proposal' && (
                    <Text style={{ color: msg.isUser ? 'white' : 'black' }}>
                      ✅ Proposta aceita com sucesso!
                    </Text>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}>
            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
            <div style={{ backgroundColor: '#f5f5f5', padding: '8px 12px', borderRadius: '12px' }}>
              <Text>Digitando...</Text>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Ações rápidas */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0' }}>
        <Space wrap>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              size="small"
              onClick={action.action}
              disabled={isLoading}
            >
              {action.label}
            </Button>
          ))}
        </Space>
      </div>

      {/* Área de input */}
      <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            disabled={isLoading}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            loading={isLoading}
            disabled={!inputMessage.trim()}
          >
            Enviar
          </Button>
        </Space.Compact>
      </div>
    </Card>
  );
}
