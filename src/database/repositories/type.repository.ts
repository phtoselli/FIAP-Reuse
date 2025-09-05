import { prisma } from "../../src/lib/prisma/prisma";
import { Type } from "@prisma/client";

export class TypeRepository {
  async create(data: Omit<Type, "id">) {
    return prisma.type.create({ data });
  }

  async findById(id: string) {
    return prisma.type.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.type.findMany();
  }

  async update(id: string, data: Partial<Type>) {
    return prisma.type.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.type.delete({ where: { id } });
  }
}
