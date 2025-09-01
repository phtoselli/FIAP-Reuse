import { NextRequest, NextResponse } from 'next/server';
import { ProposalController } from './ProposalController';

const proposalController = new ProposalController();

// POST /api/propostas - Criar nova proposta
export async function POST(request: NextRequest) {
  return proposalController.createProposal(request);
}

// GET /api/propostas - Listar propostas
export async function GET(request: NextRequest) {
  return proposalController.getProposals(request);
}
