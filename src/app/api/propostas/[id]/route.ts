import { NextRequest, NextResponse } from 'next/server';
import { ProposalController } from '../ProposalController';

const proposalController = new ProposalController();

// GET /api/propostas/:id - Buscar proposta por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return proposalController.getProposalById(request, { params });
}

// PUT /api/propostas/:id - Atualizar proposta
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return proposalController.updateProposal(request, { params });
}

// DELETE /api/propostas/:id - Deletar proposta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return proposalController.deleteProposal(request, { params });
}
