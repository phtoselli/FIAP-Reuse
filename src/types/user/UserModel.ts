export interface UserModel {
  id: string;
  nome: string;
  email: string;
  cidade: string | null;
  estado: string | null;
  avatarUrl: string | null;
  dataCriacao: Date;
  dataAtualizacao: Date;
}

export interface UserCreateModel {
  nome: string;
  email: string;
  senha: string;
  cidade?: string;
  estado?: string;
  avatarUrl?: string;
}

export interface UserUpdateModel {
  nome?: string;
  email?: string;
  senha?: string;
  cidade?: string;
  estado?: string;
  avatarUrl?: string;
}

export interface UserResponseModel {
  id: string;
  nome: string;
  email: string;
  cidade: string | null;
  estado: string | null;
  avatarUrl: string | null;
  dataCriacao: Date;
  dataAtualizacao: Date;
}
