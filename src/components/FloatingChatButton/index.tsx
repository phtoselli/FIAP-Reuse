"use client";

import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';
import WatsonChat from '@/components/WatsonChat';

interface FloatingChatButtonProps {
  userId?: string;
  onProductDetails?: (productId: string) => void;
  onListAddresses?: (userId: string) => void;
  onAcceptProposal?: (proposalId: string, userId: string) => void;
}

export default function FloatingChatButton({ 
  userId, 
  onProductDetails, 
  onListAddresses, 
  onAcceptProposal 
}: FloatingChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão flutuante */}
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<MessageOutlined />}
        onClick={handleOpen}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: 'none',
          background: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="floating-chat-button"
      />

      {/* Drawer do chat */}
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageOutlined />
            <span>Assistente ReUse</span>
          </div>
        }
        placement="right"
        onClose={handleClose}
        open={isOpen}
        width={400}
        styles={{
          body: { padding: 0 },
          header: { 
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px'
          }
        }}
        extra={
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={handleClose}
            style={{ border: 'none' }}
          />
        }
      >
        <WatsonChat
          userId={userId}
          onProductDetails={onProductDetails}
          onListAddresses={onListAddresses}
          onAcceptProposal={onAcceptProposal}
        />
      </Drawer>
    </>
  );
}
