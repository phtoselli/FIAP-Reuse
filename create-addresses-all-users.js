/**
 * Cadastrar endereços para todos os usuários
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createAddressesAllUsers = async () => {
  try {
    console.log('🏠 Cadastrando endereços para todos os usuários...\n');

    // Buscar todos os usuários
    const users = await prisma.user.findMany();
    console.log(`👥 Usuários encontrados: ${users.length}`);

    // Dados de endereços para cada usuário
    const addressData = {
      'Carol': [
        { street: 'Rua das Palmeiras, 100', city: 'Rio de Janeiro', state: 'RJ', zipCode: '22000-000', country: 'Brasil' },
        { street: 'Av. Atlântica, 500', city: 'Rio de Janeiro', state: 'RJ', zipCode: '22000-100', country: 'Brasil' },
        { street: 'Rua da Lapa, 200', city: 'Rio de Janeiro', state: 'RJ', zipCode: '20000-000', country: 'Brasil' }
      ],
      'Bob': [
        { street: 'Rua Augusta, 300', city: 'São Paulo', state: 'SP', zipCode: '01305-000', country: 'Brasil' },
        { street: 'Av. Paulista, 1500', city: 'São Paulo', state: 'SP', zipCode: '01310-100', country: 'Brasil' },
        { street: 'Rua Oscar Freire, 400', city: 'São Paulo', state: 'SP', zipCode: '01426-000', country: 'Brasil' }
      ]
    };

    let totalCreated = 0;

    for (const user of users) {
      console.log(`\n👤 Processando usuário: ${user.name} (${user.id})`);
      
      // Verificar se o usuário já tem endereços
      const existingAddresses = await prisma.address.findMany({
        where: { userId: user.id }
      });

      if (existingAddresses.length > 0) {
        console.log(`   ✅ Já possui ${existingAddresses.length} endereço(s)`);
        continue;
      }

      // Obter dados de endereços para este usuário
      const userAddresses = addressData[user.name] || [
        { street: `Rua ${user.name}, 123`, city: 'São Paulo', state: 'SP', zipCode: '01000-000', country: 'Brasil' },
        { street: `Av. ${user.name}, 456`, city: 'São Paulo', state: 'SP', zipCode: '01000-100', country: 'Brasil' }
      ];

      // Criar endereços para o usuário
      for (let i = 0; i < userAddresses.length; i++) {
        const addressInfo = userAddresses[i];
        
        const address = await prisma.address.create({
          data: {
            street: addressInfo.street,
            city: addressInfo.city,
            state: addressInfo.state,
            zipCode: addressInfo.zipCode,
            country: addressInfo.country,
            userId: user.id
          }
        });

        console.log(`   📍 Endereço ${i + 1} criado: ${address.street} - ${address.city}, ${address.state}`);
        totalCreated++;
      }
    }

    console.log(`\n🎉 Processo concluído!`);
    console.log(`📊 Total de endereços criados: ${totalCreated}`);

    // Verificar resultado final
    console.log(`\n📋 Resumo final por usuário:`);
    const allUsers = await prisma.user.findMany({
      include: {
        Address: true
      }
    });

    allUsers.forEach(user => {
      console.log(`👤 ${user.name}: ${user.Address.length} endereço(s)`);
      user.Address.forEach((addr, index) => {
        console.log(`   ${index + 1}. ${addr.street} - ${addr.city}, ${addr.state}`);
      });
    });

  } catch (error) {
    console.error('❌ Erro ao criar endereços:', error.message);
  } finally {
    await prisma.$disconnect();
  }
};

createAddressesAllUsers();
