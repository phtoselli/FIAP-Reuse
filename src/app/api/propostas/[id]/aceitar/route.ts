import { NextRequest, NextResponse } from 'next/server';
import { ProposalController } from '../../ProposalController';

const proposalController = new ProposalController();

// POST /api/propostas/:id/aceitar - Aceitar proposta
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return proposalController.acceptProposal(request, { params });
}
