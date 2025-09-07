export interface Product {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  avaliacao: number;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
  usuario: {
    id: string;
    nome: string;
    cidade: string;
    estado: string;
    avatarUrl: string;
  };
  categoria: {
    id: string;
    nome: string;
    descricao: string;
  };
  subcategoria?: {
    id: string;
    nome: string;
    descricao: string;
  };
  condicao?: {
    id: string;
    codigo: string;
    tipo: string;
    descricao: string;
  };
}
