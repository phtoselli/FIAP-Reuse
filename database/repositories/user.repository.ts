import { User } from "@prisma/client";
import { prisma } from "../lib/prisma";

export class UserRepository {
  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        posts: true,
        tradesRequested: true,
        tradesReceived: true,
        tradeItems: true,
        Address: true,
        Proposal: true,
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
