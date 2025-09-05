// Exporta o service de produtos baseado em dados mockados (para compatibilidade)
export { default as productService } from './mockProductService';

// Exporta o novo service baseado em Prisma
export { ProductService } from './ProductService';

// Exporta os tipos
export type { ProductModel, ProductCreateModel, ProductUpdateModel } from '@/types/product/ProductModel';

// Exporta funções de teste
export { testarFiltrosPorCategoria, testarPerformanceFiltros } from './test-filtros';
