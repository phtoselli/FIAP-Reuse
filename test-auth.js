const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Função para testar os endpoints de autenticação
async function testAuthEndpoints() {
  console.log('🔐 Iniciando testes dos endpoints de autenticação...\n');

  let testUserId = null;

  try {
    // 1. Primeiro, criar um usuário para testar o login
    console.log('1️⃣ Criando usuário para teste...');
    const newUser = {
      nome: 'Teste Login',
      email: 'teste.login@email.com',
      senha: 'senha123',
      cidade: 'São Paulo',
      estado: 'SP'
    };

    const createResponse = await axios.post(`${BASE_URL}/usuarios`, newUser);
    console.log('✅ Usuário criado:', createResponse.data.id);
    testUserId = createResponse.data.id;
    console.log('');

    // 2. Teste: Validar senha forte
    console.log('2️⃣ Testando POST /api/auth/validate-password (senha válida)');
    const validPasswordResponse = await axios.post(`${BASE_URL}/auth/validate-password`, {
      senha: 'senha123'
    });
    console.log('✅ Validação de senha válida:', validPasswordResponse.data);
    console.log('');

    // 3. Teste: Validar senha fraca
    console.log('3️⃣ Testando POST /api/auth/validate-password (senha fraca)');
    const weakPasswordResponse = await axios.post(`${BASE_URL}/auth/validate-password`, {
      senha: '123'
    });
    console.log('✅ Validação de senha fraca:', weakPasswordResponse.data);
    console.log('');

    // 4. Teste: Verificar email existente
    console.log('4️⃣ Testando POST /api/auth/check-email (email existente)');
    const existingEmailResponse = await axios.post(`${BASE_URL}/auth/check-email`, {
      email: 'teste.login@email.com'
    });
    console.log('✅ Verificação de email existente:', existingEmailResponse.data);
    console.log('');

    // 5. Teste: Verificar email inexistente
    console.log('5️⃣ Testando POST /api/auth/check-email (email inexistente)');
    const nonExistingEmailResponse = await axios.post(`${BASE_URL}/auth/check-email`, {
      email: 'nao.existe@email.com'
    });
    console.log('✅ Verificação de email inexistente:', nonExistingEmailResponse.data);
    console.log('');

    // 6. Teste: Login com credenciais corretas
    console.log('6️⃣ Testando POST /api/auth/login (credenciais corretas)');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'teste.login@email.com',
      senha: 'senha123'
    });
    console.log('✅ Login bem-sucedido:', loginResponse.data);
    console.log('');

    // 7. Teste: Login com senha incorreta
    console.log('7️⃣ Testando POST /api/auth/login (senha incorreta)');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'teste.login@email.com',
        senha: 'senhaerrada'
      });
    } catch (error) {
      console.log('✅ Erro esperado (senha incorreta):', error.response.data);
    }
    console.log('');

    // 8. Teste: Login com email inexistente
    console.log('8️⃣ Testando POST /api/auth/login (email inexistente)');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'nao.existe@email.com',
        senha: 'senha123'
      });
    } catch (error) {
      console.log('✅ Erro esperado (email inexistente):', error.response.data);
    }
    console.log('');

    // 9. Teste: Login com formato de email inválido
    console.log('9️⃣ Testando POST /api/auth/login (email inválido)');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'email-invalido',
        senha: 'senha123'
      });
    } catch (error) {
      console.log('✅ Erro esperado (email inválido):', error.response.data);
    }
    console.log('');

    // 10. Teste: Login com senha fraca
    console.log('🔟 Testando POST /api/auth/login (senha fraca)');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'teste.login@email.com',
        senha: '123'
      });
    } catch (error) {
      console.log('✅ Erro esperado (senha fraca):', error.response.data);
    }
    console.log('');

    // 11. Limpeza: Deletar usuário de teste
    console.log('1️⃣1️⃣ Deletando usuário de teste...');
    await axios.delete(`${BASE_URL}/usuarios/${testUserId}`);
    console.log('✅ Usuário de teste deletado');
    console.log('');

    console.log('🎉 Todos os testes dos endpoints de autenticação foram executados com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.response?.data || error.message);
    
    // Tentar limpar o usuário de teste em caso de erro
    if (testUserId) {
      try {
        await axios.delete(`${BASE_URL}/usuarios/${testUserId}`);
        console.log('🧹 Usuário de teste deletado durante limpeza');
      } catch (cleanupError) {
        console.log('⚠️ Erro ao deletar usuário de teste durante limpeza');
      }
    }
  }
}

// Executar os testes
testAuthEndpoints();
