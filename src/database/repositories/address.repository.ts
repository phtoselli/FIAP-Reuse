import { prisma } from "../../src/lib/prisma/prisma";
import { Address } from "@prisma/client";

export class AddressRepository {
  async create(data: Omit<Address, "id" | "createdAt">) {
    return prisma.address.create({ data });
  }

  async findById(id: string) {
    return prisma.address.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findAll() {
    return prisma.address.findMany({ include: { user: true } });
  }

  async update(id: string, data: Partial<Address>) {
    return prisma.address.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.address.delete({ where: { id } });
  }
}
