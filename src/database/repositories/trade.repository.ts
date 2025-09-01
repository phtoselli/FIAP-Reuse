import { prisma } from "../../src/lib/prisma/prisma";
import { Trade } from "@prisma/client";

export class TradeRepository {
  async create(data: Omit<Trade, "id" | "createdAt" | "updatedAt">) {
    return prisma.trade.create({ data });
  }

  async findById(id: string) {
    return prisma.trade.findUnique({
      where: { id },
      include: {
        requester: true,
        responder: true,
        status: true,
        tradeItems: true,
      },
    });
  }

  async findAll() {
    return prisma.trade.findMany({
      include: { requester: true, responder: true, status: true },
    });
  }

  async update(id: string, data: Partial<Trade>) {
    return prisma.trade.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.trade.delete({ where: { id } });
  }
}
