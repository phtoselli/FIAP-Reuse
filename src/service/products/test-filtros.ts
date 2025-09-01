import { ProductService } from './ProductService';

const productService = new ProductService();

/**
 * Teste dos novos métodos de filtro por categoria
 */
async function testarFiltrosPorCategoria() {
  try {
    console.log('🧪 Testando filtros por categoria...\n');

    // 1. Testar listagem sem filtro de categoria (todos os produtos)
    console.log('1️⃣ Listando produtos sem filtro de categoria:');
    const todosProdutos = await productService.getProductsWithoutCategoryFilter(true, 5, 0);
    console.log(`   ✅ Total: ${todosProdutos.total} produtos`);
    console.log(`   ✅ Retornados: ${todosProdutos.produtos.length} produtos`);
    console.log(`   ✅ Tem mais: ${todosProdutos.hasMore}\n`);

    // 2. Testar listagem com filtro por categoria
    if (todosProdutos.produtos.length > 0) {
      const primeiraCategoria = todosProdutos.produtos[0].categoria.id;
      console.log(`2️⃣ Listando produtos da categoria "${todosProdutos.produtos[0].categoria.nome}":`);
      
      const produtosPorCategoria = await productService.getProductsByCategory(primeiraCategoria, true);
      console.log(`   ✅ Produtos encontrados: ${produtosPorCategoria.length}\n`);
    }

    // 3. Testar filtros avançados
    console.log('3️⃣ Testando filtros avançados:');
    const filtrosAvancados = await productService.getProductsWithFilters({
      activeOnly: true,
      limit: 3,
      offset: 0,
    });
    console.log(`   ✅ Total com filtros: ${filtrosAvancados.total} produtos`);
    console.log(`   ✅ Retornados: ${filtrosAvancados.produtos.length} produtos`);
    console.log(`   ✅ Tem mais: ${filtrosAvancados.hasMore}\n`);

    // 4. Testar filtro por categoria específica
    if (todosProdutos.produtos.length > 0) {
      const primeiraCategoria = todosProdutos.produtos[0].categoria.id;
      console.log(`4️⃣ Testando filtro por categoria específica (ID: ${primeiraCategoria}):`);
      
      const produtosFiltrados = await productService.getProductsWithFilters({
        categoryId: primeiraCategoria,
        activeOnly: true,
        limit: 2,
        offset: 0,
      });
      console.log(`   ✅ Produtos da categoria: ${produtosFiltrados.total}`);
      console.log(`   ✅ Retornados: ${produtosFiltrados.produtos.length}`);
      console.log(`   ✅ Tem mais: ${produtosFiltrados.hasMore}\n`);
    }

    console.log('🎉 Todos os testes de filtro por categoria foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao testar filtros por categoria:', error);
  }
}

/**
 * Teste de performance dos filtros
 */
async function testarPerformanceFiltros() {
  try {
    console.log('⚡ Testando performance dos filtros...\n');

    const startTime = Date.now();
    
    // Testar filtro sem categoria
    await productService.getProductsWithoutCategoryFilter(true, 10, 0);
    const tempoSemFiltro = Date.now() - startTime;
    
    // Testar filtro com categoria
    const startTimeComFiltro = Date.now();
    if (todosProdutos.produtos.length > 0) {
      const primeiraCategoria = todosProdutos.produtos[0].categoria.id;
      await productService.getProductsByCategory(primeiraCategoria, true);
    }
    const tempoComFiltro = Date.now() - startTimeComFiltro;

    console.log(`   ⏱️  Tempo sem filtro: ${tempoSemFiltro}ms`);
    console.log(`   ⏱️  Tempo com filtro: ${tempoComFiltro}ms`);
    console.log(`   📊 Diferença: ${tempoComFiltro - tempoSemFiltro}ms\n`);

  } catch (error) {
    console.error('❌ Erro ao testar performance:', error);
  }
}

// Executar testes
if (require.main === module) {
  testarFiltrosPorCategoria()
    .then(() => testarPerformanceFiltros())
    .then(() => {
      console.log('🏁 Testes concluídos!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

export { testarFiltrosPorCategoria, testarPerformanceFiltros };
