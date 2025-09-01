import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/service/auth/AuthService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/login - Fazer login
   */
  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const { email, senha } = body;

      // Validações básicas
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

      // Tentar fazer login
      const loginResult = await this.authService.login({ email, senha });

      return NextResponse.json(loginResult, { status: 200 });

    } catch (error) {
      console.error('Erro no controller de login:', error);
      if (error instanceof Error) {
        if (error.message.includes('Email ou senha incorretos')) {
          return NextResponse.json(
            { error: error.message },
            { status: 401 }
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
   * POST /api/auth/check-email - Verificar se email existe
   */
  async checkEmail(request: NextRequest) {
    try {
      const body = await request.json();
      const { email } = body;

      if (!email || typeof email !== 'string') {
        return NextResponse.json(
          { error: 'Email é obrigatório e deve ser uma string' },
          { status: 400 }
        );
      }

      // Validar formato do email
      if (!this.authService.validateEmail(email)) {
        return NextResponse.json(
          { error: 'Formato de email inválido' },
          { status: 400 }
        );
      }

      // Verificar se o email existe
      const emailExists = await this.authService.checkEmailExists(email);

      return NextResponse.json({
        success: true,
        email,
        exists: emailExists,
        message: emailExists ? 'Email já está cadastrado' : 'Email disponível'
      });

    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }

  /**
   * POST /api/auth/validate-password - Validar força da senha
   */
  async validatePassword(request: NextRequest) {
    try {
      const body = await request.json();
      const { senha } = body;

      if (!senha || typeof senha !== 'string') {
        return NextResponse.json(
          { error: 'Senha é obrigatória e deve ser uma string' },
          { status: 400 }
        );
      }

      // Validar força da senha
      const isValid = this.authService.validatePassword(senha);

      return NextResponse.json({
        success: true,
        isValid,
        message: isValid ? 'Senha válida' : 'Senha deve ter pelo menos 6 caracteres, uma letra e um número'
      });

    } catch (error) {
      console.error('Erro ao validar senha:', error);
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      );
    }
  }
}
