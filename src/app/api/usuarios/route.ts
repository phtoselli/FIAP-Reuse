import { NextRequest, NextResponse } from 'next/server';
import { UserController } from './UserController';

const userController = new UserController();

export async function GET(request: NextRequest) {
  return userController.getUsers(request);
}

export async function POST(request: NextRequest) {
  return userController.createUser(request);
}
