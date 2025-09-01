import { prisma } from "../../src/lib/prisma/prisma";
import { Post } from "@prisma/client";

export class PostRepository {
  async create(data: Omit<Post, "id" | "createdAt" | "updatedAt">) {
    return prisma.post.create({ data });
  }

  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
        subcategory: true,
        condition: true,
      },
    });
  }

  async findAll() {
    return prisma.post.findMany({
      include: {
        user: true,
        category: true,
        subcategory: true,
        condition: true,
      },
    });
  }

  async update(id: string, data: Partial<Post>) {
    return prisma.post.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.post.delete({ where: { id } });
  }
}
