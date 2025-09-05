<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '../AuthController';

const authController = new AuthController();

export async function POST(request: NextRequest) {
  return authController.login(request);
=======
import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserRepository } from "@/database/repositories/user.repository";

const userRepo = new UserRepository();

if (!process.env.JWT_SECRET) {
  throw new Error(
    "⚠️ JWT_SECRET não encontrado! Verifique se você possui o arquivo .env com a chave JWT_SECRET definida."
  );
}

const JWT_SECRET: string = process.env.JWT_SECRET;

export async function DoLogin(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const user = await userRepo.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Senha inválida" }, { status: 401 });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "60m",
    });

    const res = NextResponse.json({ message: "Login realizado" });
    res.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 60 minutos
      sameSite: "lax",
    });

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro no login" }, { status: 500 });
  }
>>>>>>> 864a5468cf34c0ade672fbdb3bf39ca09be1bddb
}
