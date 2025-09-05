import { prisma } from "@/lib/prisma";
import { Address } from "@prisma/client";

export class AddressRepository {
  /**
   * Cria um novo endereço
   */
  async create(data: Omit<Address, "id" | "createdAt">): Promise<Address> {
    return prisma.address.create({ data });
  }

  /**
   * Busca um endereço por ID com relacionamentos
   */
  async findById(id: string) {
    return prisma.address.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  /**
   * Lista todos os endereços com relacionamentos
   */
  async findAll() {
    return prisma.address.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca endereços por usuário
   */
  async findByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca endereços por cidade
   */
  async findByCity(city: string) {
    return prisma.address.findMany({
      where: { 
        city: {
          contains: city,
          mode: 'insensitive',
        }
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca endereços por estado
   */
  async findByState(state: string) {
    return prisma.address.findMany({
      where: { 
        state: {
          contains: state,
          mode: 'insensitive',
        }
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca endereços por país
   */
  async findByCountry(country: string) {
    return prisma.address.findMany({
      where: { 
        country: {
          contains: country,
          mode: 'insensitive',
        }
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Busca endereços com filtros avançados
   */
  async findWithFilters(filters: {
    userId?: string;
    city?: string;
    state?: string;
    country?: string;
    limit?: number;
    offset?: number;
  }) {
    const { userId, city, state, country, limit, offset } = filters;

    const where: any = {};
    
    if (userId) where.userId = userId;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };

    return prisma.address.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      ...(limit && { take: limit }),
      ...(offset && { skip: offset }),
    });
  }

  /**
   * Conta endereços com filtros
   */
  async countWithFilters(filters: {
    userId?: string;
    city?: string;
    state?: string;
    country?: string;
  }) {
    const { userId, city, state, country } = filters;

    const where: any = {};
    
    if (userId) where.userId = userId;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (state) where.state = { contains: state, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };

    return prisma.address.count({ where });
  }

  /**
   * Atualiza um endereço
   */
  async update(id: string, data: Partial<Address>): Promise<Address> {
    return prisma.address.update({ where: { id }, data });
  }

  /**
   * Deleta um endereço
   */
  async delete(id: string): Promise<Address> {
    return prisma.address.delete({ where: { id } });
  }

  /**
   * Conta endereços por usuário
   */
  async countByUserId(userId: string): Promise<number> {
    return prisma.address.count({ where: { userId } });
  }

  /**
   * Conta endereços por cidade
   */
  async countByCity(city: string): Promise<number> {
    return prisma.address.count({
      where: {
        city: {
          contains: city,
          mode: 'insensitive',
        }
      }
    });
  }

  /**
   * Conta endereços por estado
   */
  async countByState(state: string): Promise<number> {
    return prisma.address.count({
      where: {
        state: {
          contains: state,
          mode: 'insensitive',
        }
      }
    });
  }
}
