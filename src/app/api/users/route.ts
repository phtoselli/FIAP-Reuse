import { NextResponse } from "next/server";
import { UserRepository } from "../../../../database/repositories/user.repository";

const userRepository = new UserRepository();

export async function GET() {
  const newUser = await userRepository.create({
    email: "gian",
    avatarUrl: "",
    city: "cidade",
    name: "nome",
    state: "sp",
    passwordHash: "tst",
  });
  return NextResponse.json(newUser, { status: 201 });
}
