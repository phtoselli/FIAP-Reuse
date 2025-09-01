import { prisma } from "../lib/prisma";
import { TradeItem } from "@prisma/client";

export class TradeItemRepository {
  async create(data: Omit<TradeItem, "id">) {
    return prisma.tradeItem.create({ data });
  }

  async findById(id: string) {
    return prisma.tradeItem.findUnique({
      where: { id },
      include: { trade: true, post: true, owner: true },
    });
  }

  async findAll() {
    return prisma.tradeItem.findMany({
      include: { trade: true, post: true, owner: true },
    });
  }

  async update(id: string, data: Partial<TradeItem>) {
    return prisma.tradeItem.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.tradeItem.delete({ where: { id } });
  }
}
