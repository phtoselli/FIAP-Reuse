<<<<<<< HEAD
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
      where: { id }
    });
  }

  /**
   * Busca um usuário por email
   */
  async findByEmail(email: string): Promise<any> {
    return prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Lista todos os usuários
   */
  async findAll(): Promise<any[]> {
    return prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
=======
import { User } from "@prisma/client";
import { prisma } from "@/lib/prisma/prisma";

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
>>>>>>> 864a5468cf34c0ade672fbdb3bf39ca09be1bddb
      },
    });
  }

<<<<<<< HEAD
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
        ...(cidade && { city: { contains: cidade, mode: 'insensitive' } }),
        ...(estado && { state: { contains: estado, mode: 'insensitive' } }),
      },
      orderBy: {
        createdAt: 'desc',
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
        ...(cidade && { city: { contains: cidade, mode: 'insensitive' } }),
        ...(estado && { state: { contains: estado, mode: 'insensitive' } }),
      },
    });
  }

  /**
   * Atualiza um usuário
   */
  async update(id: string, data: any): Promise<any> {
    return prisma.user.update({
      where: { id },
      data
    });
  }

  /**
   * Deleta um usuário
   */
  async delete(id: string): Promise<any> {
    return prisma.user.delete({
      where: { id }
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
=======
  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
>>>>>>> 864a5468cf34c0ade672fbdb3bf39ca09be1bddb
  }
}
