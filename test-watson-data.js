// Script para criar dados de teste para o Watson
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function criarDadosTeste() {
  console.log('🧪 Criando dados de teste para o Watson...\n');
  
  try {
    // 1. Criar usuário de teste
    console.log('1. Criando usuário de teste...');
    const usuario = await prisma.user.upsert({
      where: { email: 'teste@watson.com' },
      update: {},
      create: {
        name: 'Usuário Teste Watson',
        email: 'teste@watson.com',
        passwordHash: 'senha123',
        city: 'São Paulo',
        state: 'SP',
      },
    });
    console.log('✅ Usuário criado:', usuario.id);
    
    // 2. Criar produto de teste
    console.log('\n2. Criando produto de teste...');
    const produto = await prisma.post.upsert({
      where: { id: 'abc123' },
      update: {},
      create: {
        id: 'abc123',
        title: 'Smartphone Samsung Galaxy',
        description: 'Smartphone em excelente estado, pouco usado',
        imageUrl: 'https://example.com/phone.jpg',
        rating: 4.5,
        isActive: true,
        userId: usuario.id,
        categoryId: 'cat-001', // Você pode ajustar conforme suas categorias
        subcategoryId: 'sub-001', // Você pode ajustar conforme suas subcategorias
        conditionId: 'cond-001', // Você pode ajustar conforme suas condições
      },
    });
    console.log('✅ Produto criado:', produto.id);
    
    // 3. Criar endereço de teste
    console.log('\n3. Criando endereço de teste...');
    const endereco = await prisma.address.create({
      data: {
        street: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
        country: 'Brasil',
        userId: usuario.id,
      },
    });
    console.log('✅ Endereço criado:', endereco.id);
    
    // 4. Criar proposta de teste
    console.log('\n4. Criando proposta de teste...');
    const proposta = await prisma.proposal.upsert({
      where: { id: 'xyz789' },
      update: {},
      create: {
        id: 'xyz789',
        message: 'Gostaria de fazer uma proposta de troca',
        status: 'pending',
        requesterId: usuario.id,
        responderId: usuario.id, // Mesmo usuário para teste
      },
    });
    console.log('✅ Proposta criada:', proposta.id);
    
    // 5. Criar item da proposta
    console.log('\n5. Criando item da proposta...');
    const itemProposta = await prisma.proposalItem.create({
      data: {
        proposalId: proposta.id,
        postId: produto.id,
      },
    });
    console.log('✅ Item da proposta criado:', itemProposta.id);
    
    console.log('\n🎉 Dados de teste criados com sucesso!');
    console.log('\n📋 Resumo dos dados:');
    console.log(`👤 Usuário: ${usuario.id} (${usuario.email})`);
    console.log(`📦 Produto: ${produto.id} (${produto.title})`);
    console.log(`🏠 Endereço: ${endereco.id}`);
    console.log(`📋 Proposta: ${proposta.id}`);
    
    console.log('\n🧪 Agora você pode testar:');
    console.log('- "Quero ver os detalhes do produto abc123"');
    console.log('- "Mostre meus endereços"');
    console.log('- "Aceito a proposta xyz789"');
    
  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

criarDadosTeste();
