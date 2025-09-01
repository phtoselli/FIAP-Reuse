// Exporta o service de produtos
export { ProductService } from './products/ProductService';
export { default as productService } from './products/mockProductService';

// Exporta o service de propostas
export { ProposalService } from './proposals/ProposalService';

// Exporta o service de endereços
export { AddressService } from './addresses/AddressService';

// Exporta funções de teste
export { testarFiltrosPorCategoria, testarPerformanceFiltros } from './products/test-filtros';
export { testarPropostas, testarValidacoesSeguranca } from './proposals/test-propostas';
export { testarEnderecos, testarValidacoesSeguranca as testarValidacoesSegurancaEnderecos } from './addresses/test-enderecos';
