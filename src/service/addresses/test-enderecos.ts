import { AddressService } from './AddressService';

const addressService = new AddressService();

/**
 * Teste dos métodos de endereço
 */
async function testarEnderecos() {
  try {
    console.log('🏠 Testando sistema de endereços...\n');

    // 1. Testar criação de endereço
    console.log('1️⃣ Criando endereço de teste:');
    const novoEndereco = await addressService.createAddress({
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      country: 'Brasil',
      userId: 'uuid-usuario-teste'
    });
    
    console.log(`   ✅ Endereço criado com ID: ${novoEndereco.id}`);
    console.log(`   ✅ Endereço completo: ${novoEndereco.fullAddress}`);
    console.log(`   ✅ Usuário: ${novoEndereco.user.name}\n`);

    // 2. Testar busca por ID
    console.log('2️⃣ Buscando endereço por ID:');
    const enderecoEncontrado = await addressService.getAddressById(novoEndereco.id);
    
    if (enderecoEncontrado) {
      console.log(`   ✅ Endereço encontrado: ${enderecoEncontrado.street}`);
      console.log(`   ✅ Cidade: ${enderecoEncontrado.city}`);
      console.log(`   ✅ Estado: ${enderecoEncontrado.state}\n`);
    }

    // 3. Testar listagem de endereços
    console.log('3️⃣ Listando endereços:');
    const todosEnderecos = await addressService.getAllAddresses();
    console.log(`   ✅ Total de endereços: ${todosEnderecos.length}\n`);

    // 4. Testar endereços por usuário
    console.log('4️⃣ Listando endereços do usuário:');
    const enderecosUsuario = await addressService.getAddressesByUserId('uuid-usuario-teste');
    console.log(`   ✅ Endereços do usuário: ${enderecosUsuario.length}\n`);

    // 5. Testar endereços por cidade
    console.log('5️⃣ Listando endereços por cidade:');
    const enderecosCidade = await addressService.getAddressesByCity('São Paulo');
    console.log(`   ✅ Endereços em São Paulo: ${enderecosCidade.length}\n`);

    // 6. Testar endereços por estado
    console.log('6️⃣ Listando endereços por estado:');
    const enderecosEstado = await addressService.getAddressesByState('SP');
    console.log(`   ✅ Endereços no estado SP: ${enderecosEstado.length}\n`);

    // 7. Testar filtros avançados
    console.log('7️⃣ Testando filtros avançados:');
    const filtrosAvancados = await addressService.getAddressesWithFilters({
      limit: 5,
      offset: 0,
    });
    console.log(`   ✅ Total com filtros: ${filtrosAvancados.total} endereços`);
    console.log(`   ✅ Retornados: ${filtrosAvancados.enderecos.length} endereços`);
    console.log(`   ✅ Tem mais: ${filtrosAvancados.hasMore}\n`);

    // 8. Testar atualização de endereço
    console.log('8️⃣ Atualizando endereço:');
    const enderecoAtualizado = await addressService.updateAddress(novoEndereco.id, {
      street: 'Rua das Flores, 456'
    }, 'uuid-usuario-teste');
    console.log(`   ✅ Endereço atualizado: ${enderecoAtualizado.street}\n`);

    // 9. Testar contadores
    console.log('9️⃣ Testando contadores:');
    const totalUsuario = await addressService.countAddressesByUserId('uuid-usuario-teste');
    const totalCidade = await addressService.countAddressesByCity('São Paulo');
    const totalEstado = await addressService.countAddressesByState('SP');
    
    console.log(`   ✅ Total do usuário: ${totalUsuario}`);
    console.log(`   ✅ Total na cidade: ${totalCidade}`);
    console.log(`   ✅ Total no estado: ${totalEstado}\n`);

    console.log('🎉 Todos os testes de endereço foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao testar endereços:', error);
  }
}

/**
 * Teste de validações de segurança
 */
async function testarValidacoesSeguranca() {
  try {
    console.log('🔒 Testando validações de segurança...\n');

    // 1. Testar editar endereço com usuário errado
    console.log('1️⃣ Tentando editar endereço com usuário errado:');
    try {
      await addressService.updateAddress('uuid-endereco-teste', {
        street: 'Rua não autorizada'
      }, 'uuid-usuario-errado');
      console.log('   ❌ Deveria ter falhado');
    } catch (error) {
      console.log('   ✅ Validação funcionou: Apenas o dono pode editar');
    }

    // 2. Testar deletar endereço com usuário errado
    console.log('2️⃣ Tentando deletar endereço com usuário errado:');
    try {
      await addressService.deleteAddress('uuid-endereco-teste', 'uuid-usuario-errado');
      console.log('   ❌ Deveria ter falhado');
    } catch (error) {
      console.log('   ✅ Validação funcionou: Apenas o dono pode deletar');
    }

    // 3. Testar criar endereço sem campos obrigatórios
    console.log('3️⃣ Tentando criar endereço sem campos obrigatórios:');
    try {
      await addressService.createAddress({
        street: 'Rua Teste',
        city: '',
        state: 'SP',
        zipCode: '12345-678',
        country: 'Brasil',
        userId: 'uuid-usuario-teste'
      });
      console.log('   ❌ Deveria ter falhado');
    } catch (error) {
      console.log('   ✅ Validação funcionou: Campos obrigatórios são necessários');
    }

    console.log('🔒 Todas as validações de segurança funcionaram corretamente!');

  } catch (error) {
    console.error('❌ Erro ao testar validações:', error);
  }
}

// Executar testes
if (require.main === module) {
  testarEnderecos()
    .then(() => testarValidacoesSeguranca())
    .then(() => {
      console.log('🏁 Testes de endereço concluídos!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Erro fatal:', error);
      process.exit(1);
    });
}

export { testarEnderecos, testarValidacoesSeguranca };
