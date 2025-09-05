import { prisma } from "@/lib/prisma";

export class UserRepository {
  /**
   * Cria um novo usuário
   */
  async create(data: any): Promise<any> {
    return prisma.user.create({ data });
  }

  /**
   * Busca um usuário por ID
   */
  async findById(id: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email: string): Promise<any> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Lista todos os usuários
   */
  async findAll(): Promise<any[]> {
    return prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Busca usuários com filtros
   */
  async findWithFilters(filters: {
    cidade?: string;
    estado?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const { cidade, estado, limit, offset } = filters;

    return prisma.user.findMany({
      where: {
        ...(cidade && { city: { contains: cidade, mode: "insensitive" } }),
        ...(estado && { state: { contains: estado, mode: "insensitive" } }),
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  /**
   * Conta usuários com filtros
   */
  async countWithFilters(filters: {
    cidade?: string;
    estado?: string;
  }): Promise<number> {
    const { cidade, estado } = filters;

    return prisma.user.count({
      where: {
        ...(cidade && { city: { contains: cidade, mode: "insensitive" } }),
        ...(estado && { state: { contains: estado, mode: "insensitive" } }),
      },
    });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: string, data: any): Promise<any> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um usuário
   */
  async delete(id: string): Promise<any> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Verifica se um email já existe
   */
  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    const where: any = { email };
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const user = await prisma.user.findFirst({ where });
    return !!user;
  }
}
