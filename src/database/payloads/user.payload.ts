import { prisma } from "@/lib/prisma/prisma";

export type UserResponse = Awaited<ReturnType<typeof prisma.user.findUnique>>;

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};
