import { NextRequest, NextResponse } from 'next/server';
import { AddressController } from './AddressController';

const addressController = new AddressController();

// POST /api/enderecos - Criar novo endereço
export async function POST(request: NextRequest) {
  return addressController.createAddress(request);
}

// GET /api/enderecos - Listar endereços
export async function GET(request: NextRequest) {
  return addressController.getAddresses(request);
}
