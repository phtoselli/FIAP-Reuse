/**
 * Verificar quais usuários têm endereços cadastrados
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const checkAddressesUsers = async () => {
  try {
    console.log('🔍 Verificando usuários com endereços...\n');

    // Buscar todos os endereços
    const addresses = await prisma.address.findMany({
      include: {
        user: true
      }
    });

    console.log(`📊 Total de endereços encontrados: ${addresses.length}\n`);

    if (addresses.length > 0) {
      console.log('📋 Endereços por usuário:');
      const userAddresses = {};
      
      addresses.forEach((address) => {
        const userId = address.userId;
        if (!userAddresses[userId]) {
          userAddresses[userId] = {
            user: address.user,
            addresses: []
          };
        }
        userAddresses[userId].addresses.push(address);
      });

      Object.keys(userAddresses).forEach((userId) => {
        const userData = userAddresses[userId];
        console.log(`\n👤 Usuário: ${userData.user.name} (${userId})`);
        console.log(`   📍 Endereços: ${userData.addresses.length}`);
        
        userData.addresses.forEach((addr, index) => {
          console.log(`   ${index + 1}. ${addr.street}, ${addr.number || 's/n'} - ${addr.city}, ${addr.state}`);
        });
      });

      // Pegar o primeiro usuário com endereços para teste
      const firstUserWithAddresses = Object.keys(userAddresses)[0];
      const firstUserData = userAddresses[firstUserWithAddresses];
      
      console.log(`\n🎯 Usuário para teste: ${firstUserData.user.name} (${firstUserWithAddresses})`);
      console.log(`   📍 Endereços: ${firstUserData.addresses.length}`);
      
    } else {
      console.log('❌ Nenhum endereço encontrado no banco.');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar endereços:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkAddressesUsers();
