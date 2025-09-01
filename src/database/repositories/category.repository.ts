import { prisma } from "../../src/lib/prisma/prisma";
import { Category } from "@prisma/client";

export class CategoryRepository {
  async create(data: Omit<Category, "id">) {
    return prisma.category.create({ data });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: { subcategories: true, posts: true },
    });
  }

  async findAll() {
    return prisma.category.findMany({ include: { subcategories: true } });
  }

  async update(id: string, data: Partial<Category>) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
