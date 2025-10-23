"use client";

import React, { useState } from 'react';
import { Card, Typography, Space } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import ContentLayout from '@/components/ContentLayout';
import WatsonChat from '@/components/WatsonChat';

const { Title, Paragraph } = Typography;

export default function ChatPage() {
  const [userId] = useState("d21d52e9-2969-428c-8aba-e5e236eca94f"); // Alice

  return (
    <ContentLayout title="Assistente Virtual">
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <RobotOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
            <Title level={2}>Assistente Virtual ReUse</Title>
            <Paragraph>
              Converse com nosso assistente para obter informações sobre produtos, 
              endereços e propostas de troca.
            </Paragraph>
          </div>
          
          <WatsonChat 
            userId={userId}
            onProductDetails={(productId) => {
              console.log('Product details requested:', productId);
            }}
            onListAddresses={(userId) => {
              console.log('Addresses requested for user:', userId);
            }}
            onAcceptProposal={(proposalId, userId) => {
              console.log('Proposal accepted:', proposalId, 'by user:', userId);
            }}
          />
        </Space>
      </Card>
    </ContentLayout>
  );
}
