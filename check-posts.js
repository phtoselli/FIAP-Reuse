/**
 * Verificar posts existentes
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkPosts = async () => {
  try {
    console.log('🔍 Verificando posts no banco...\n');

    // Buscar todos os posts
    const posts = await prisma.post.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Total de posts encontrados: ${posts.length}\n`);

    if (posts.length > 0) {
      console.log('📋 Detalhes dos posts:');
      posts.forEach((post, index) => {
        console.log(`\n${index + 1}. Post ID: ${post.id}`);
        console.log(`   📝 Título: ${post.title}`);
        console.log(`   👤 Usuário: ${post.user?.name || 'N/A'}`);
        console.log(`   📅 Criado em: ${post.createdAt}`);
        console.log(`   ✅ Ativo: ${post.isActive ? 'Sim' : 'Não'}`);
      });
    } else {
      console.log('❌ Nenhum post encontrado no banco.');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar posts:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkPosts();
