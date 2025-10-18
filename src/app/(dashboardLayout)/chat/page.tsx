"use client";

import React, { useState } from 'react';
import { Card, Typography, Space, Button, message } from 'antd';
import { RobotOutlined, MessageOutlined } from '@ant-design/icons';
import WatsonChat from '@/components/WatsonChat';
import ContentLayout from '@/components/ContentLayout';

const { Title, Text } = Typography;

export default function ChatPage() {
  const [userId] = useState('user-123'); // Em produção, viria do contexto de autenticação

  const handleProductDetails = (productId: string) => {
    message.success(`Detalhes do produto ${productId} carregados!`);
    // Aqui você pode navegar para a página do produto ou abrir um modal
  };

  const handleListAddresses = (userId: string) => {
    message.success(`Endereços do usuário ${userId} listados!`);
    // Aqui você pode abrir um modal com os endereços ou navegar para a página de endereços
  };

  const handleAcceptProposal = (proposalId: string, userId: string) => {
    message.success(`Proposta ${proposalId} aceita com sucesso!`);
    // Aqui você pode atualizar a lista de propostas ou navegar para a página de propostas
  };

  return (
    <ContentLayout title="Assistente Virtual">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Chat Interface */}
        <WatsonChat
          userId={userId}
          onProductDetails={handleProductDetails}
          onListAddresses={handleListAddresses}
          onAcceptProposal={handleAcceptProposal}
        />

        {/* Instructions */}
        <Card title="Instruções de Uso">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Title level={4}>📦 Ver Detalhes de Produto</Title>
              <Text>
                Digite: <Text code>"Quero ver os detalhes do produto [ID]"</Text>
                <br />
                Exemplo: "Quero ver os detalhes do produto abc123"
              </Text>
            </div>
            
            <div>
              <Title level={4}>🏠 Listar Endereços</Title>
              <Text>
                Digite: <Text code>"Quero ver meus endereços"</Text>
                <br />
                Exemplo: "Mostre meus endereços cadastrados"
              </Text>
            </div>
            
            <div>
              <Title level={4}>✅ Aceitar Proposta</Title>
              <Text>
                Digite: <Text code>"Quero aceitar a proposta [ID]"</Text>
                <br />
                Exemplo: "Aceito a proposta xyz789"
              </Text>
            </div>
          </Space>
        </Card>
      </Space>
    </ContentLayout>
  );
}
