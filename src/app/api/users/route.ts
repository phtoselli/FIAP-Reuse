import { NextResponse } from "next/server";
import { UserService } from "@/service/users/UserService"; // ajuste o path

const userService = new UserService();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const cidade = searchParams.get("cidade") || undefined;
  const estado = searchParams.get("estado") || undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;
  const offset = searchParams.get("offset")
    ? Number(searchParams.get("offset"))
    : undefined;

  const users = await userService.getUsersWithFilters({
    cidade,
    estado,
    limit,
    offset,
  });

  return NextResponse.json(users, { status: 200 });
}
