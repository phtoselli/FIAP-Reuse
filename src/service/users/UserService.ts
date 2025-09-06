import { PostRepository } from "@/database/repositories/post.repository";
import { UserRepository } from "@/database/repositories/user.repository";
import {
  UserModel,
  UserCreateModel,
  UserUpdateModel,
  UserResponseModel,
} from "@/types/user/UserModel";
import bcrypt from "bcryptjs";

export class UserService {
  private userRepository: UserRepository;
  private postRepository: PostRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
  }

  /**
   * Busca um usuário por ID
   * @param id - ID único do usuário
   * @returns Usuário encontrado ou null se não existir
   */
  async getUserById(id: string): Promise<UserResponseModel | null> {
    try {
      const user = await this.userRepository.findById(id);

      if (!user) {
        return null;
      }

      return this.mapUserToResponseModel(user);
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw new Error("Erro interno ao buscar usuário");
    }
  }

  /**
   * Lista todos os usuários
   * @returns Lista de todos os usuários
   */
  async getAllUsers(): Promise<UserResponseModel[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map((user: any) => this.mapUserToResponseModel(user));
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw new Error("Erro interno ao listar usuários");
    }
  }

  /**
   * Lista usuários com filtros avançados
   * @param filters - Filtros aplicados
   * @returns Lista de usuários filtrados com informações de paginação
   */
  async getUsersWithFilters(filters: {
    cidade?: string;
    estado?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    usuarios: UserResponseModel[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }> {
    try {
      const { limit, offset, ...countFilters } = filters;

      // Buscar usuários com filtros
      const users = await this.userRepository.findWithFilters(filters);

      // Contar total de usuários que atendem aos filtros
      const total = await this.userRepository.countWithFilters(countFilters);

      // Calcular se há mais usuários
      const currentLimit = limit || users.length;
      const currentOffset = offset || 0;
      const hasMore = currentOffset + currentLimit < total;

      return {
        usuarios: users.map((user: any) => this.mapUserToResponseModel(user)),
        total,
        limit: currentLimit,
        offset: currentOffset,
        hasMore,
      };
    } catch (error) {
      console.error("Erro ao listar usuários com filtros:", error);
      throw new Error("Erro interno ao listar usuários com filtros");
    }
  }

  /**
   * Cria um novo usuário
   * @param userData - Dados do usuário a ser criado
   * @returns Usuário criado
   */
  async createUser(userData: UserCreateModel): Promise<UserResponseModel> {
    try {
      // Verificar se o email já existe
      const emailExists = await this.userRepository.emailExists(userData.email);
      if (emailExists) {
        throw new Error("Email já está em uso");
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(userData.senha, 10);

      // Criar o usuário
      const user = await this.userRepository.create({
        name: userData.nome,
        email: userData.email,
        passwordHash: hashedPassword,
        city: userData.cidade,
        state: userData.estado,
        avatarUrl: userData.avatarUrl,
      });

      return this.mapUserToResponseModel(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      if (
        error instanceof Error &&
        error.message.includes("Email já está em uso")
      ) {
        throw error;
      }
      throw new Error("Erro interno ao criar usuário");
    }
  }

  /**
   * Atualiza um usuário existente
   * @param id - ID do usuário
   * @param userData - Dados a serem atualizados
   * @returns Usuário atualizado
   */
  async updateUser(
    id: string,
    userData: UserUpdateModel
  ): Promise<UserResponseModel> {
    try {
      // Verificar se o usuário existe
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error("Usuário não encontrado");
      }

      // Verificar se o email já existe (se estiver sendo alterado)
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await this.userRepository.emailExists(
          userData.email,
          id
        );
        if (emailExists) {
          throw new Error("Email já está em uso");
        }
      }

      // Preparar dados para atualização
      const updateData: any = {};
      if (userData.nome) updateData.name = userData.nome;
      if (userData.email) updateData.email = userData.email;
      if (userData.cidade !== undefined) updateData.city = userData.cidade;
      if (userData.estado !== undefined) updateData.state = userData.estado;
      if (userData.avatarUrl !== undefined)
        updateData.avatarUrl = userData.avatarUrl;

      // Criptografar nova senha se fornecida
      if (userData.senha) {
        updateData.passwordHash = await bcrypt.hash(userData.senha, 10);
      }

      // Atualizar o usuário
      await this.userRepository.update(id, updateData);

      // Buscar o usuário atualizado
      const updatedUser = await this.userRepository.findById(id);

      if (!updatedUser) {
        throw new Error("Erro ao atualizar usuário");
      }

      return this.mapUserToResponseModel(updatedUser);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      if (
        error instanceof Error &&
        (error.message.includes("não encontrado") ||
          error.message.includes("Email já está em uso"))
      ) {
        throw error;
      }
      throw new Error("Erro interno ao atualizar usuário");
    }
  }

  /**
   * Deleta um usuário
   * @param id - ID do usuário
   * @returns true se deletado com sucesso
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error("Usuário não encontrado");
      }

      await this.postRepository.deletebyuserid(id);

      await this.userRepository.delete(id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      if (error instanceof Error && error.message.includes("não encontrado")) {
        throw error;
      }
      throw new Error("Erro interno ao deletar usuário");
    }
  }

  /**
   * Mapeia um User do Prisma para UserResponseModel
   * @param user - User do Prisma
   * @returns UserResponseModel mapeado
   */
  private mapUserToResponseModel(user: any): UserResponseModel {
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      cidade: user.city,
      estado: user.state,
      avatarUrl: user.avatarUrl,
      dataCriacao: user.createdAt,
      dataAtualizacao: user.updatedAt,
    };
  }
}
