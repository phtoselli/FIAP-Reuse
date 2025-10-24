import { NextRequest, NextResponse } from 'next/server';
import { AddressController } from '../AddressController';

const addressController = new AddressController();

// GET /api/enderecos/:id - Buscar endereço por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return addressController.getAddressById(request, { params });
}

// PUT /api/enderecos/:id - Atualizar endereço
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return addressController.updateAddress(request, { params });
}

// DELETE /api/enderecos/:id - Deletar endereço
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return addressController.deleteAddress(request, { params });
}
