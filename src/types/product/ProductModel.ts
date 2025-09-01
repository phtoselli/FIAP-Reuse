export interface ProductModel {
  id: string;
  nome: string;
  descricao: string | null;
  imagem: string | null;
  avaliacao: number | null;
  ativo: boolean;
  dataCriacao: Date;
  dataAtualizacao: Date;
  usuario: {
    id: string;
    nome: string;
    cidade: string | null;
    estado: string | null;
    avatarUrl: string | null;
  };
  categoria: {
    id: string;
    nome: string;
    descricao: string | null;
  };
  subcategoria: {
    id: string;
    nome: string;
    descricao: string | null;
  };
  condicao: {
    id: string;
    codigo: string;
    tipo: string;
    descricao: string | null;
  } | null;
}

export interface ProductCreateModel {
  titulo: string;
  descricao?: string;
  imagemUrl?: string;
  categoriaId: string;
  subcategoriaId: string;
  condicaoId?: string;
  usuarioId: string;
  avaliacao?: number;
}

export interface ProductUpdateModel {
  titulo?: string;
  descricao?: string;
  imagemUrl?: string;
  categoriaId?: string;
  subcategoriaId?: string;
  condicaoId?: string;
  ativo?: boolean;
  avaliacao?: number;
}
