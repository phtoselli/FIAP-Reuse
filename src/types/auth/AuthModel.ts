export interface LoginModel {
  email: string;
  senha: string;
}

export interface LoginResponseModel {
  success: boolean;
  message: string;
  user: {
    id: string;
    nome: string;
    email: string;
    cidade: string | null;
    estado: string | null;
    avatarUrl: string | null;
  };
  token?: string; // Para futuras implementações de JWT
}
