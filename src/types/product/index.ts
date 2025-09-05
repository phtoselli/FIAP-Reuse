import { CategoryCode } from "../type/category";
import { ConditionCode } from "../type/condition";

export interface Product {
  id: string;
  nome: string;
  descricao: string;
  imagem: string;
  avaliacao: number;
  ativo: boolean;
  dataCriacao: string; // Date vindo como ISO string
  dataAtualizacao: string; // idem

  usuario: {
    id: string;
    nome: string;
    cidade: string;
    estado: string;
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
  categoryCode: CategoryCode;
  conditionCode: ConditionCode;
}
