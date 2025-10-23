/**
 * Verificar produtos existentes no banco
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkProducts = async () => {
  try {
    console.log('🔍 Verificando produtos no banco...\n');

    // Buscar todos os produtos
    const products = await prisma.post.findMany({
      include: {
        user: true,
        tradeItems: true,
      },
    });

    console.log(`📊 Total de produtos encontrados: ${products.length}\n`);

    if (products.length > 0) {
      console.log('📋 Detalhes dos produtos:');
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. Produto ID: ${product.id}`);
        console.log(`   📝 Nome: ${product.title}`);
        console.log(`   📝 Descrição: ${product.description || 'N/A'}`);
        console.log(`   🏷️ Categoria ID: ${product.categoryId || 'N/A'}`);
        console.log(`   📊 Subcategoria ID: ${product.subcategoryId || 'N/A'}`);
        console.log(`   📊 Condição ID: ${product.conditionId || 'N/A'}`);
        console.log(`   👤 Ofertante: ${product.user?.name || 'N/A'}`);
        console.log(`   📅 Criado em: ${product.createdAt}`);
        console.log(`   ✅ Ativo: ${product.isActive ? 'Sim' : 'Não'}`);
      });
    } else {
      console.log('❌ Nenhum produto cadastrado no momento.');
    }
  } catch (error) {
    console.error('❌ Erro ao verificar produtos:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkProducts();
