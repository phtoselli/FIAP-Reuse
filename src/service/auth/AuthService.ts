import { UserRepository } from '@/database/repositories/user.repository';
import { LoginModel, LoginResponseModel } from '@/types/auth/AuthModel';
import bcrypt from 'bcryptjs';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Autentica um usuário com email e senha
   * @param loginData - Dados de login (email e senha)
   * @returns Dados do usuário autenticado ou erro
   */
  async login(loginData: LoginModel): Promise<LoginResponseModel> {
    try {
      const { email, senha } = loginData;

      // Buscar usuário pelo email
      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        throw new Error('Email ou senha incorretos');
      }

      // Verificar se a senha está correta
      // Para desenvolvimento: aceitar senhas em texto simples
      const isPasswordValid = senha === user.passwordHash || await bcrypt.compare(senha, user.passwordHash);
      
      if (!isPasswordValid) {
        throw new Error('Email ou senha incorretos');
      }

      // Retornar dados do usuário (sem a senha)
      return {
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          nome: user.name,
          email: user.email,
          cidade: user.city,
          estado: user.state,
          avatarUrl: user.avatarUrl,
        }
      };

    } catch (error) {
      console.error('Erro no login:', error);
      if (error instanceof Error && error.message.includes('Email ou senha incorretos')) {
        throw error;
      }
      throw new Error('Erro interno durante o login');
    }
  }

  /**
   * Verifica se um email existe no sistema
   * @param email - Email a ser verificado
   * @returns true se o email existe, false caso contrário
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findByEmail(email);
      return !!user;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return false;
    }
  }

  /**
   * Valida se uma senha atende aos critérios mínimos
   * @param senha - Senha a ser validada
   * @returns true se a senha é válida, false caso contrário
   */
  validatePassword(senha: string): boolean {
    // Mínimo 6 caracteres
    if (senha.length < 6) {
      return false;
    }
    
    // Pelo menos uma letra e um número
    const hasLetter = /[a-zA-Z]/.test(senha);
    const hasNumber = /\d/.test(senha);
    
    return hasLetter && hasNumber;
  }

  /**
   * Valida formato de email
   * @param email - Email a ser validado
   * @returns true se o email é válido, false caso contrário
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
