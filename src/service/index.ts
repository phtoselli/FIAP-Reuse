// Exporta o service de produtos
export { ProductService } from './products/ProductService';
export { default as productService } from './products/mockProductService';

// Exporta o service de propostas
export { ProposalService } from './proposals/ProposalService';

// Exporta o service de endereços
export { AddressService } from './addresses/AddressService';

// Exporta o service do Watson
export { WatsonService } from './watson/WatsonService';

// Exporta funções de teste
export { testarFiltrosPorCategoria, testarPerformanceFiltros } from './products/test-filtros';
export { testarPropostas, testarValidacoesSeguranca } from './proposals/test-propostas';
export { testarEnderecos, testarValidacoesSeguranca as testarValidacoesSegurancaEnderecos } from './addresses/test-enderecos';
export { testarWatsonIntegration, testarDetecaoIntencoes, executarTodosTestesWatson } from './watson/test-watson';
