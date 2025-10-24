import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/service/users/UserService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/usuarios - Listar usuários
   */
  async getUsers(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const cidade = searchParams.get('cidade');
      const estado = searchParams.get('estado');
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
      const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

      if (cidade || estado || limit || offset) {
        // Listar usuários com filtros
        const result = await this.userService.getUsersWithFilters({
          cidade: cidade || undefined,
          estado: estado || undefined,
          limit,
          offset,
        });

        return NextResponse.json(result);
      } else {
        // Listar todos os usuários
        const users = await this.userService.getAllUsers();
        return NextResponse.json({
          usuarios: users,
          total: users.length
        });
      }
    } catch (error) {
      console.error('Erro no controller ao listar usuários:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  /**
   * GET /api/usuarios/:id - Buscar usuário por ID
   */
  async getUserById(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
      const { id } = await params;

      if (!id || typeof id !== 'string') {
        return NextResponse.json(
          { error: 'ID do usuário é obrigatório' },
          { status: 400 }
        );
      }

      const user = await this.userService.getUserById(id);

      if (!user) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    } catch (error) {
      console.error('Erro no controller ao buscar usuário:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          return NextResponse.json(
            { error: error.message },
            { status: 404 }
          );
        }
      }
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/usuarios - Criar novo usuário
   */
  async createUser(request: NextRequest) {
    try {
      const body = await request.json();
      const { nome, email, senha, cidade, estado, avatarUrl } = body;

      // Validações básicas
      if (!nome || typeof nome !== 'string') {
        return NextResponse.json(
          { error: 'Nome é obrigatório e deve ser uma string' },
          { status: 400 }
        );
      }

      if (!email || typeof email !== 'string') {
        return NextResponse.json(
          { error: 'Email é obrigatório e deve ser uma string' },
          { status: 400 }
        );
      }

      if (!senha || typeof senha !== 'string') {
        return NextResponse.json(
          { error: 'Senha é obrigatória e deve ser uma string' },
          { status: 400 }
        );
      }

      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Formato de email inválido' },
          { status: 400 }
        );
      }

      const novoUsuario = await this.userService.createUser({
        nome,
        email,
        senha,
        cidade,
        estado,
        avatarUrl,
      });

      return NextResponse.json(novoUsuario, { status: 201 });
    } catch (error) {
      console.error('Erro no controller ao criar usuário:', error);
      if (error instanceof Error) {
        if (error.message.includes('Email já está em uso')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
      }
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  /**
   * PUT /api/usuarios/:id - Atualizar usuário
   */
  async updateUser(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;
      const body = await request.json();
      const { nome, email, senha, cidade, estado, avatarUrl } = body;

      if (!id || typeof id !== 'string') {
        return NextResponse.json(
          { error: 'ID do usuário é obrigatório' },
          { status: 400 }
        );
      }

      // Validar formato do email se fornecido
      if (email && typeof email === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { error: 'Formato de email inválido' },
            { status: 400 }
          );
        }
      }

      const usuarioAtualizado = await this.userService.updateUser(id, {
        nome,
        email,
        senha,
        cidade,
        estado,
        avatarUrl,
      });

      return NextResponse.json(usuarioAtualizado);
    } catch (error) {
      console.error('Erro no controller ao atualizar usuário:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          return NextResponse.json(
            { error: error.message },
            { status: 404 }
          );
        }
        if (error.message.includes('Email já está em uso')) {
          return NextResponse.json(
            { error: error.message },
            { status: 400 }
          );
        }
      }
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  /**
   * DELETE /api/usuarios/:id - Deletar usuário
   */
  async deleteUser(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = await params;

      if (!id || typeof id !== 'string') {
        return NextResponse.json(
          { error: 'ID do usuário é obrigatório' },
          { status: 400 }
        );
      }

      await this.userService.deleteUser(id);

      return NextResponse.json(
        { message: 'Usuário deletado com sucesso' }
      );
    } catch (error) {
      console.error('Erro no controller ao deletar usuário:', error);
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          return NextResponse.json(
            { error: error.message },
            { status: 404 }
          );
        }
      }
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }
}
