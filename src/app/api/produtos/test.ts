// Arquivo de teste para o endpoint de produtos
// Este arquivo pode ser usado para testar a funcionalidade

import { ProductService } from '@/service/products/ProductService';

const productService = new ProductService();

// Função para testar a busca de um produto
export async function testBuscarProduto(id: string) {
  try {
    const produto = await productService.getProductById(id);

    if (!produto) {
      console.log('Produto não encontrado');
      return null;
    }

    console.log('Produto encontrado:', JSON.stringify(produto, null, 2));
    return produto;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

// Função para listar todos os produtos (útil para testes)
export async function listarTodosProdutos() {
  try {
    const produtos = await productService.getAllActiveProducts();
    
    // Limitar a 5 produtos para teste
    const produtosLimitados = produtos.slice(0, 5);

    console.log('Produtos disponíveis:', produtosLimitados);
    return produtosLimitados;
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return [];
  }
}

// Função para testar a criação de um produto
export async function testCriarProduto() {
  try {
    const novoProduto = await productService.createProduct({
      titulo: 'Produto de Teste',
      descricao: 'Este é um produto criado para teste',
      categoriaId: 'categoria-id-exemplo',
      subcategoriaId: 'subcategoria-id-exemplo',
      usuarioId: 'usuario-id-exemplo'
    });

    console.log('Produto criado:', JSON.stringify(novoProduto, null, 2));
    return novoProduto;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return null;
  }
}
