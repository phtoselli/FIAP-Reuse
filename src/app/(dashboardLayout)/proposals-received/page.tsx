"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Flex,
  Space,
  Typography,
  message,
  Spin,
  Tag,
  Avatar,
  Divider,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  MessageOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import ContentLayout from "@/components/ContentLayout";
import { ProposalService } from "@/service/proposals/ProposalService";
import { getUser } from "@/utils/auth";
import axios from "axios";

const { Text, Title } = Typography;

interface Proposal {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  requesterId: string;
  responderId: string;
  requester: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  responder: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  items: any[];
}

export default function ProposalsReceivedPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getUser();
  const userId = currentUser?.id;

  useEffect(() => {
    fetchProposals();
  }, []);

  // Recarrega propostas quando a página ganha foco (após aceite via chat)
  useEffect(() => {
    const handleFocus = () => {
      fetchProposals();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/propostas?userId=${userId}&role=responder`);
      setProposals(response.data.propostas || []);
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      message.error('Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      setLoading(true);
      await axios.post(`/api/propostas/${proposalId}/aceitar`, {
        responderId: userId,
      });
      message.success('Proposta aceita com sucesso!');
      fetchProposals();
    } catch (error) {
      console.error('Erro ao aceitar proposta:', error);
      message.error('Erro ao aceitar proposta');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectProposal = async (proposalId: string) => {
    try {
      setLoading(true);
      await axios.post(`/api/propostas/${proposalId}/recusar`, {
        responderId: userId,
      });
      message.success('Proposta recusada');
      fetchProposals();
    } catch (error) {
      console.error('Erro ao recusar proposta:', error);
      message.error('Erro ao recusar proposta');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'accepted': return 'Aceita';
      case 'rejected': return 'Recusada';
      default: return status;
    }
  };

  if (loading) {
    return (
      <ContentLayout>
        <Flex justify="center" align="center" style={{ height: '400px' }}>
          <Spin size="large" />
        </Flex>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <Flex vertical gap={24}>
        <div>
          <Title level={2}>Propostas Recebidas</Title>
          <Text type="secondary">
            Gerencie as propostas de troca que você recebeu
          </Text>
        </div>

        {proposals.length === 0 ? (
          <Card>
            <Flex vertical align="center" gap={16} style={{ padding: '40px 0' }}>
              <MessageOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <Text type="secondary">Nenhuma proposta recebida</Text>
            </Flex>
          </Card>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {proposals.map((proposal) => (
              <Card key={proposal.id} hoverable>
                <Flex vertical gap={16}>
                  {/* Header com status */}
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={12}>
                      <Avatar 
                        src={proposal.requester.avatarUrl} 
                        icon={<UserOutlined />}
                      />
                      <div>
                        <Text strong>{proposal.requester.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {proposal.requester.email}
                        </Text>
                      </div>
                    </Flex>
                    <Tag color={getStatusColor(proposal.status)}>
                      {getStatusText(proposal.status)}
                    </Tag>
                  </Flex>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Mensagem da proposta */}
                  <div>
                    <Text strong>Mensagem:</Text>
                    <br />
                    <Text>{proposal.message}</Text>
                  </div>

                  {/* ID da Proposta */}
                  <div>
                    <Text strong>ID da Proposta:</Text>
                    <br />
                    <Text 
                      code 
                      copyable 
                      style={{ 
                        fontSize: '12px', 
                        backgroundColor: '#f5f5f5', 
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {proposal.id}
                    </Text>
                  </div>

                  {/* Data */}
                  <Flex align="center" gap={8}>
                    <CalendarOutlined />
                    <Text type="secondary">
                      {new Date(proposal.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </Flex>

                  {/* Ações */}
                  {proposal.status === 'pending' && (
                    <Flex gap={12}>
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleAcceptProposal(proposal.id)}
                        loading={loading}
                      >
                        Aceitar
                      </Button>
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => handleRejectProposal(proposal.id)}
                        loading={loading}
                      >
                        Recusar
                      </Button>
                    </Flex>
                  )}
                </Flex>
              </Card>
            ))}
          </Space>
        )}
      </Flex>
    </ContentLayout>
  );
}
