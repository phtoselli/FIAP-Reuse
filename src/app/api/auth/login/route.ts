import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '../AuthController';

const authController = new AuthController();

export async function POST(request: NextRequest) {
  return authController.login(request);
}
