import { prisma } from "../../src/lib/prisma/prisma";
import { Subcategory } from "@prisma/client";

export class SubcategoryRepository {
  async create(data: Omit<Subcategory, "id">) {
    return prisma.subcategory.create({ data });
  }

  async findById(id: string) {
    return prisma.subcategory.findUnique({
      where: { id },
      include: { category: true, posts: true },
    });
  }

  async findAll() {
    return prisma.subcategory.findMany({ include: { category: true } });
  }

  async update(id: string, data: Partial<Subcategory>) {
    return prisma.subcategory.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.subcategory.delete({ where: { id } });
  }
}
