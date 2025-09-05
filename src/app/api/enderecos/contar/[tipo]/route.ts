import { NextRequest, NextResponse } from 'next/server';
import { AddressController } from '../../AddressController';

const addressController = new AddressController();

// GET /api/enderecos/contar/:tipo - Contar endereços por tipo
export async function GET(
  request: NextRequest,
  { params }: { params: { tipo: string } }
) {
  return addressController.countAddresses(request, { params });
}
