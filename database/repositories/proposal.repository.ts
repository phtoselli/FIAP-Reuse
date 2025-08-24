import { prisma } from "../lib/prisma";
import { Proposal } from "@prisma/client";

export class ProposalRepository {
  async create(data: Omit<Proposal, "id" | "createdAt" | "updatedAt">) {
    return prisma.proposal.create({ data });
  }

  async findById(id: string) {
    return prisma.proposal.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async findAll() {
    return prisma.proposal.findMany({ include: { items: true } });
  }

  async update(id: string, data: Partial<Proposal>) {
    return prisma.proposal.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.proposal.delete({ where: { id } });
  }
}
