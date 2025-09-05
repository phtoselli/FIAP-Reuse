import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { UserRepository } from "@/database/repositories/user.repository";

const userRepo = new UserRepository();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    const existingUser = await userRepo.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userRepo.create({
      name,
      email,
      passwordHash,
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro no cadastro" }, { status: 500 });
  }
}
