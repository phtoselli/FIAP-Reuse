## 🤖 Assistente Virtual com Watson Assistant

O projeto ReUse integra o IBM Watson Assistant para proporcionar uma experiência de usuário mais intuitiva e eficiente através de automações inteligentes.

### 🎯 Automações Disponíveis

#### 📦 Ver Detalhes de Produto
- **Comando:** "Quero ver os detalhes do produto [ID]"
- **Funcionalidade:** Exibe informações completas do produto, incluindo descrição, condição, fotos e dados do ofertante
- **Exemplo:** "Quero ver os detalhes do produto abc123"

#### 🏠 Listar Endereços do Usuário
- **Comando:** "Quero ver meus endereços" ou "Listar endereços"
- **Funcionalidade:** Lista todos os endereços cadastrados do usuário para seleção em processos de envio
- **Exemplo:** "Mostre meus endereços cadastrados"

#### ✅ Aceitar Proposta de Troca
- **Comando:** "Quero aceitar a proposta [ID]"
- **Funcionalidade:** Aceita propostas de troca pendentes diretamente pelo chat, agilizando o processo de negociação
- **Exemplo:** "Aceito a proposta prop456"

### 🚀 Como Usar

1. **Acesse a página do chat:** `/chat`
2. **Digite comandos naturais** em português
3. **Use as ações rápidas** para comandos comuns
4. **Siga as instruções** exibidas na interface

### 🛠️ Tecnologias

- **IBM Watson Assistant V1 API**
- **Next.js 15** (App Router)
- **React 18** com TypeScript
- **Ant Design** para interface
- **Sistema de Fallback** para garantia de funcionamento

### 📁 Estrutura de Arquivos
src/
├── app/
│ ├── api/watson/ # API do Watson Assistant
│ └── (dashboardLayout)/chat/ # Página do chat
├── components/
│ └── WatsonChat/ # Componente do chat
├── hooks/
│ └── useWatson/ # Hook personalizado
└── service/
└── watson/ # Serviços do Watson


### 🔧 Configuração

O Watson Assistant está configurado com:
- **Intents:** `ver_detalhes_produto`, `listar_enderecos`, `aceitar_proposta`
- **Entities:** `product_id`, `proposal_id`
- **Dialog Nodes:** Respostas personalizadas para cada automação

### 📊 Status

- ✅ **3 automações** funcionando perfeitamente
- ✅ **Interface responsiva** e intuitiva
- ✅ **Sistema de fallback** para garantia de funcionamento
- ✅ **Integração completa** com a plataforma ReUse

### 🎨 Interface

O assistente virtual segue o design system do projeto, utilizando:
- **Cores padrão** do Ant Design
- **Layout consistente** com outras páginas
- **Componentes reutilizáveis**
- **Experiência de usuário** otimizada

---

*Para mais detalhes técnicos, consulte a documentação em `src/app/api/watson/README.md`*


# 🚀 FIAP ReUse - API Completa

Sistema completo de gerenciamento para a plataforma ReUse, desenvolvido com Next.js 15, Prisma ORM e PostgreSQL.

## 🏗️ **Arquitetura**

### **Padrão Repository-Service-Controller**
```
HTTP Request → Controller → Service → Repository → Database
```

- **Controller**: Gerencia requisições HTTP, validação e respostas
- **Service**: Lógica de negócio e regras de validação
- **Repository**: Acesso aos dados e operações CRUD
- **Model**: Interfaces TypeScript e tipos de dados

## 🛠️ **Tecnologias**

- **Next.js 15** (App Router)
- **Prisma ORM** (PostgreSQL)
- **TypeScript**
- **Docker** (PostgreSQL)

## 📋 **Endpoints da API**

---

## 🔐 **API de Autenticação**

### **1. POST /api/auth/login** - Fazer Login

#### **Descrição**
Autentica um usuário verificando se o email e senha existem no banco de dados.

#### **Campos da Requisição**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `email` | string | ✅ | Email do usuário |
| `senha` | string | ✅ | Senha do usuário |

#### **Corpo da Requisição**
```json
{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "uuid-do-usuario",
    "nome": "João Silva",
    "email": "joao@email.com",
    "cidade": "São Paulo",
    "estado": "SP",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

#### **Resposta de Erro (401)**
```json
{
  "error": "Email ou senha incorretos"
}
```

#### **Resposta de Erro (400)**
```json
{
  "error": "Email é obrigatório e deve ser uma string"
}
```

```json
{
  "error": "Senha é obrigatória e deve ser uma string"
}
```

### **2. POST /api/auth/check-email** - Verificar Email

#### **Descrição**
Verifica se um email já está cadastrado no sistema.

#### **Campos da Requisição**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `email` | string | ✅ | Email a ser verificado |

#### **Corpo da Requisição**
```json
{
  "email": "joao@email.com"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "success": true,
  "email": "joao@email.com",
  "exists": true,
  "message": "Email já está cadastrado"
}
```

### **3. POST /api/auth/validate-password** - Validar Senha

#### **Descrição**
Valida se uma senha atende aos critérios de segurança.

#### **Campos da Requisição**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `senha` | string | ✅ | Senha a ser validada |

#### **Corpo da Requisição**
```json
{
  "senha": "senha123"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "success": true,
  "isValid": true,
  "message": "Senha válida"
}
```

#### **Resposta de Erro (200)**
```json
{
  "success": true,
  "isValid": false,
  "message": "Senha deve ter pelo menos 6 caracteres, uma letra e um número"
}
```

---

## 👥 **API de Usuários**

### **1. GET /api/usuarios** - Listar Usuários

#### **Descrição**
Lista todos os usuários com suporte a filtros e paginação.

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `cidade` | string | ❌ | Filtrar por cidade |
| `estado` | string | ❌ | Filtrar por estado |
| `limit` | number | ❌ | Número máximo de usuários por página |
| `offset` | number | ❌ | Número de usuários para pular |

#### **Exemplos de Uso**
```bash
# Lista básica (todos os usuários)
GET /api/usuarios

# Com filtro por cidade
GET /api/usuarios?cidade=São Paulo

# Com filtro por estado
GET /api/usuarios?estado=SP

# Com paginação
GET /api/usuarios?limit=10&offset=0

# Combinação de filtros
GET /api/usuarios?cidade=São Paulo&estado=SP&limit=5&offset=0
```

#### **Resposta de Sucesso (200)**
```json
{
  "usuarios": [
    {
      "id": "uuid-do-usuario",
      "nome": "João Silva",
      "email": "joao@email.com",
      "cidade": "São Paulo",
      "estado": "SP",
      "avatarUrl": "https://example.com/avatar.jpg",
      "dataCriacao": "2024-01-01T00:00:00.000Z",
      "dataAtualizacao": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0,
  "hasMore": false
}
```

### **2. GET /api/usuarios/:id** - Buscar Usuário por ID

#### **Descrição**
Busca um usuário específico pelo ID.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do usuário (UUID) |

#### **Exemplo de Uso**
```bash
GET /api/usuarios/uuid-do-usuario
```

#### **Resposta de Sucesso (200)**
```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva",
  "email": "joao@email.com",
  "cidade": "São Paulo",
  "estado": "SP",
  "avatarUrl": "https://example.com/avatar.jpg",
  "dataCriacao": "2024-01-01T00:00:00.000Z",
  "dataAtualizacao": "2024-01-01T00:00:00.000Z"
}
```

#### **Resposta de Erro (404)**
```json
{
  "error": "Usuário não encontrado"
}
```

### **3. POST /api/usuarios** - Criar Novo Usuário

#### **Descrição**
Cria um novo usuário no sistema.

#### **Campos da Requisição**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | ✅ | Nome completo do usuário |
| `email` | string | ✅ | Email único do usuário |
| `senha` | string | ✅ | Senha do usuário (será criptografada) |
| `cidade` | string | ❌ | Cidade do usuário |
| `estado` | string | ❌ | Estado do usuário |
| `avatarUrl` | string | ❌ | URL do avatar do usuário |

#### **Corpo da Requisição**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "cidade": "São Paulo",
  "estado": "SP",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

#### **Resposta de Sucesso (201)**
```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva",
  "email": "joao@email.com",
  "cidade": "São Paulo",
  "estado": "SP",
  "avatarUrl": "https://example.com/avatar.jpg",
  "dataCriacao": "2024-01-01T00:00:00.000Z",
  "dataAtualizacao": "2024-01-01T00:00:00.000Z"
}
```

#### **Resposta de Erro (400)**
```json
{
  "error": "Email já está em uso"
}
```

### **4. PUT /api/usuarios/:id** - Atualizar Usuário

#### **Descrição**
Atualiza os dados de um usuário existente.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do usuário (UUID) |

#### **Campos da Requisição**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `nome` | string | ❌ | Nome completo do usuário |
| `email` | string | ❌ | Email único do usuário |
| `senha` | string | ❌ | Nova senha (será criptografada) |
| `cidade` | string | ❌ | Cidade do usuário |
| `estado` | string | ❌ | Estado do usuário |
| `avatarUrl` | string | ❌ | URL do avatar do usuário |

#### **Corpo da Requisição**
```json
{
  "nome": "João Silva Atualizado",
  "email": "joao.novo@email.com",
  "cidade": "Rio de Janeiro",
  "estado": "RJ"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva Atualizado",
  "email": "joao.novo@email.com",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "avatarUrl": "https://example.com/avatar.jpg",
  "dataCriacao": "2024-01-01T00:00:00.000Z",
  "dataAtualizacao": "2024-01-01T00:00:00.000Z"
}
```

### **5. DELETE /api/usuarios/:id** - Deletar Usuário

#### **Descrição**
Remove um usuário do sistema.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do usuário (UUID) |

#### **Exemplo de Uso**
```bash
DELETE /api/usuarios/uuid-do-usuario
```

#### **Resposta de Sucesso (200)**
```json
{
  "message": "Usuário deletado com sucesso"
}
```

#### **Resposta de Erro (404)**
```json
{
  "error": "Usuário não encontrado"
}
```

---

## 🛍️ **API de Produtos**

### **1. GET /api/produtos** - Listar Todos os Produtos

#### **Descrição**
Lista todos os produtos com suporte a filtros avançados e paginação.

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `limit` | number | ❌ | Número máximo de produtos por página |
| `offset` | number | ❌ | Número de produtos para pular |
| `categoryId` | string | ❌ | Filtrar por ID da categoria |
| `subcategoryId` | string | ❌ | Filtrar por ID da subcategoria |
| `active` | boolean | ❌ | Filtrar por status ativo/inativo (padrão: true) |

#### **Exemplos de Uso**
```bash
# Lista básica (todos os produtos ativos)
GET /api/produtos

# Com paginação
GET /api/produtos?limit=10&offset=0

# Com filtro por categoria
GET /api/produtos?categoryId=uuid-categoria&limit=5

# Com filtro por subcategoria
GET /api/produtos?categoryId=uuid-categoria&subcategoryId=uuid-subcategoria

# Produtos inativos
GET /api/produtos?active=false

# Combinação completa
GET /api/produtos?categoryId=uuid-categoria&limit=5&offset=0&active=true
```

#### **Resposta de Sucesso (200)**
```json
{
  "produtos": [
    {
      "id": "uuid-do-produto",
      "nome": "Nome do Produto",
      "descricao": "Descrição do produto",
      "imagem": "url-da-imagem",
      "avaliacao": 4.5,
      "ativo": true,
      "dataCriacao": "2024-01-01T00:00:00.000Z",
      "dataAtualizacao": "2024-01-01T00:00:00.000Z",
      "usuario": {
        "id": "uuid-usuario",
        "nome": "Nome do Usuário",
        "cidade": "Cidade",
        "estado": "Estado",
        "avatarUrl": "url-avatar"
      },
      "categoria": {
        "id": "uuid-categoria",
        "nome": "Nome da Categoria",
        "descricao": "Descrição da categoria"
      },
      "subcategoria": {
        "id": "uuid-subcategoria",
        "nome": "Nome da Subcategoria",
        "descricao": "Descrição da subcategoria"
      },
      "condicao": {
        "id": "uuid-condicao",
        "codigo": "NEW",
        "tipo": "condition",
        "descricao": "Produto Novo"
      }
    }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

### **2. GET /api/produtos/:id** - Buscar Produto por ID

#### **Descrição**
Retorna os detalhes completos de um produto específico.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do produto (UUID) |

#### **Exemplo de Uso**
```bash
GET /api/produtos/123e4567-e89b-12d3-a456-426614174000
```

#### **Resposta de Sucesso (200)**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "nome": "Smartphone Samsung Galaxy",
  "descricao": "Smartphone em excelente estado, pouco usado",
  "imagem": "https://example.com/image.jpg",
  "avaliacao": 4.8,
  "ativo": true,
  "dataCriacao": "2024-01-01T00:00:00.000Z",
  "dataAtualizacao": "2024-01-01T00:00:00.000Z",
  "usuario": {
    "id": "user-123",
    "nome": "João Silva",
    "cidade": "São Paulo",
    "estado": "SP",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "categoria": {
    "id": "cat-123",
    "nome": "Eletrônicos",
    "descricao": "Produtos eletrônicos"
  },
  "subcategoria": {
    "id": "sub-123",
    "nome": "Smartphones",
    "descricao": "Telefones celulares"
  },
  "condicao": {
    "id": "cond-123",
    "codigo": "USED",
    "tipo": "condition",
    "descricao": "Usado"
  }
}
```

### **3. POST /api/produtos** - Criar Novo Produto

#### **Descrição**
Cria um novo produto no sistema.

#### **Campos da Requisição**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `titulo` | string | ✅ | Nome do produto |
| `descricao` | string | ❌ | Descrição detalhada |
| `imagemUrl` | string | ❌ | URL da imagem |
| `categoriaId` | string | ✅ | ID da categoria |
| `subcategoriaId` | string | ✅ | ID da subcategoria |
| `condicaoId` | string | ❌ | ID da condição |
| `usuarioId` | string | ✅ | ID do usuário |
| `avaliacao` | number | ❌ | Avaliação do produto (0-5) |

#### **Corpo da Requisição**
```json
{
  "titulo": "Nome do Produto",
  "descricao": "Descrição detalhada do produto",
  "imagemUrl": "https://example.com/image.jpg",
  "categoriaId": "uuid-categoria",
  "subcategoriaId": "uuid-subcategoria",
  "condicaoId": "uuid-condicao",
  "usuarioId": "uuid-usuario",
  "avaliacao": 4.5
}
```

#### **Exemplo de Uso**
```bash
POST /api/produtos
Content-Type: application/json

{
  "titulo": "Notebook Dell Inspiron",
  "descricao": "Notebook em ótimo estado, ideal para trabalho",
  "imagemUrl": "https://example.com/notebook.jpg",
  "categoriaId": "cat-123",
  "subcategoriaId": "sub-456",
  "condicaoId": "cond-789",
  "usuarioId": "user-123",
  "avaliacao": 4.5
}
```

#### **Resposta de Sucesso (201)**
```json
{
  "id": "new-product-uuid",
  "titulo": "Notebook Dell Inspiron",
  "descricao": "Notebook em ótimo estado, ideal para trabalho",
  "imagemUrl": "https://example.com/notebook.jpg",
  "ativo": true,
  "dataCriacao": "2024-01-01T00:00:00.000Z",
  "dataAtualizacao": "2024-01-01T00:00:00.000Z",
  "usuario": { ... },
  "categoria": { ... },
  "subcategoria": { ... },
  "condicao": { ... }
}
```

### **4. PUT /api/produtos/:id** - Atualizar Produto

#### **Descrição**
Atualiza um produto existente.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do produto (UUID) |

#### **Campos da Requisição**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `titulo` | string | ❌ | Nome do produto |
| `descricao` | string | ❌ | Descrição detalhada |
| `imagemUrl` | string | ❌ | URL da imagem |
| `categoriaId` | string | ❌ | ID da categoria |
| `subcategoriaId` | string | ❌ | ID da subcategoria |
| `condicaoId` | string | ❌ | ID da condição |
| `ativo` | boolean | ❌ | Status ativo/inativo |
| `avaliacao` | number | ❌ | Avaliação do produto (0-5) |

#### **Corpo da Requisição**
```json
{
  "titulo": "Novo Nome do Produto",
  "descricao": "Nova descrição",
  "imagemUrl": "https://example.com/new-image.jpg",
  "categoriaId": "uuid-nova-categoria",
  "subcategoriaId": "uuid-nova-subcategoria",
  "condicaoId": "uuid-nova-condicao",
  "ativo": true,
  "avaliacao": 4.8
}
```

#### **Exemplo de Uso**
```bash
PUT /api/produtos/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "titulo": "Notebook Dell Inspiron Atualizado",
  "descricao": "Descrição atualizada do notebook",
  "avaliacao": 4.8
}
```

### **5. DELETE /api/produtos/:id** - Desativar Produto

#### **Descrição**
Desativa um produto (soft delete).

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do produto (UUID) |

#### **Exemplo de Uso**
```bash
DELETE /api/produtos/123e4567-e89b-12d3-a456-426614174000
```

#### **Resposta de Sucesso (200)**
```json
{
  "message": "Produto desativado com sucesso"
}
```

### **6. GET /api/produtos/categoria/:categoryId** - Listar Produtos por Categoria

#### **Descrição**
Lista produtos de uma categoria específica com filtros adicionais.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `categoryId` | string | ✅ | ID da categoria |

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `limit` | number | ❌ | Número máximo de produtos |
| `offset` | number | ❌ | Número de produtos para pular |
| `active` | boolean | ❌ | Filtrar por status ativo |
| `subcategoryId` | string | ❌ | Filtrar por subcategoria |

#### **Exemplo de Uso**
```bash
GET /api/produtos/categoria/cat-123?limit=10&offset=0&active=true
```

---

## 📋 **API de Propostas**

### **1. POST /api/propostas** - Criar Nova Proposta

#### **Descrição**
Cria uma nova proposta de troca/compra.

#### **Corpo da Requisição**
```json
{
  "message": "Gostaria de fazer uma proposta pelos seus produtos",
  "responderId": "uuid-usuario-destinatario",
  "requesterId": "uuid-usuario-solicitante",
  "items": [
    {
      "postId": "uuid-produto-1"
    }
  ]
}
```

#### **Exemplo de Uso**
```bash
POST /api/propostas
Content-Type: application/json

{
  "message": "Interessado nos seus produtos",
  "responderId": "user-456",
  "requesterId": "user-123",
  "items": [
    { "postId": "post-1" }
  ]
}
```

#### **Resposta de Sucesso (201)**
```json
{
  "id": "proposal-uuid",
  "message": "Interessado nos seus produtos",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "requester": {
    "id": "user-123",
    "name": "João Silva",
    "email": "joao@email.com",
    "city": "São Paulo",
    "state": "SP",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "responder": {
    "id": "user-456",
    "name": "Maria Santos",
    "email": "maria@email.com",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "avatarUrl": "https://example.com/avatar2.jpg"
  },
  "items": [
    {
      "id": "item-1",
      "postId": "post-1",
      "post": {
        "id": "post-1",
        "title": "Smartphone Samsung",
        "description": "Smartphone em ótimo estado",
        "imageUrl": "https://example.com/phone.jpg",
        "rating": 4.5,
        "isActive": true,
        "category": { ... },
        "subcategory": { ... },
        "condition": { ... }
      }
    }
  ],
  "totalItems": 1
}
```

### **2. GET /api/propostas** - Listar Propostas

#### **Descrição**
Lista propostas com filtros opcionais.

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `userId` | string | ❌ | Filtrar por usuário |
| `role` | string | ❌ | Papel do usuário (requester/responder) |
| `status` | string | ❌ | Filtrar por status |

#### **Exemplos de Uso**
```bash
# Listar todas as propostas
GET /api/propostas

# Propostas de um usuário específico
GET /api/propostas?userId=user-123&role=requester

# Propostas por status
GET /api/propostas?status=pending
```

#### **Resposta de Sucesso (200)**
```json
{
  "propostas": [
    {
      "id": "proposal-uuid",
      "message": "Interessado nos seus produtos",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "requester": { ... },
      "responder": { ... },
      "items": [ ... ],
      "totalItems": 2
    }
  ],
  "total": 5
}
```

### **3. GET /api/propostas/:id** - Buscar Proposta por ID

#### **Descrição**
Retorna os detalhes de uma proposta específica.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único da proposta (UUID) |

#### **Exemplo de Uso**
```bash
GET /api/propostas/123e4567-e89b-12d3-a456-426614174000
```

### **4. POST /api/propostas/:id/aceitar** - Aceitar Proposta

#### **Descrição**
Aceita uma proposta pendente, para aceitar a proposta o responderId tem que ser o mesmo que esta cadastrado na proposta .

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único da proposta (UUID) |

#### **Corpo da Requisição**
```json
{
  "responderId": "uuid-usuario-destinatario"
}
```

#### **Exemplo de Uso**
```bash
POST /api/propostas/123e4567-e89b-12d3-a456-426614174000/aceitar
Content-Type: application/json

{
  "responderId": "user-456"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "message": "Proposta aceita com sucesso",
  "proposta": {
    "id": "proposal-uuid",
    "status": "accepted",
    "message": "Interessado nos seus produtos",
    "requester": { ... },
    "responder": { ... },
    "items": [ ... ],
    "totalItems": 2
  }
}
```

### **5. POST /api/propostas/:id/recusar** - Recusar Proposta

#### **Descrição**
Recusa uma proposta pendente.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único da proposta (UUID) |

#### **Corpo da Requisição**
```json
{
  "responderId": "uuid-usuario-destinatario"
}
```

#### **Exemplo de Uso**
```bash
POST /api/propostas/123e4567-e89b-12d3-a456-426614174000/recusar
Content-Type: application/json

{
  "responderId": "user-456"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "message": "Proposta recusada com sucesso",
  "proposta": {
    "id": "proposal-uuid",
    "status": "rejected",
    "message": "Interessado nos seus produtos",
    "requester": { ... },
    "responder": { ... },
    "items": [ ... ],
    "totalItems": 2
  }
}
```

### **6. PUT /api/propostas/:id** - Atualizar Proposta

#### **Descrição**
Atualiza uma proposta pendente.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único da proposta (UUID) |

#### **Corpo da Requisição**
```json
{
  "message": "Nova mensagem da proposta",
  "requesterId": "uuid-usuario-solicitante"
}
```

### **7. DELETE /api/propostas/:id** - Deletar Proposta

#### **Descrição**
Deleta uma proposta pendente.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único da proposta (UUID) |

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `requesterId` | string | ✅ | ID do usuário solicitante |

#### **Exemplo de Uso**
```bash
DELETE /api/propostas/123e4567-e89b-12d3-a456-426614174000?requesterId=user-123
```

---

## 🏠 **API de Endereços**

### **1. POST /api/enderecos** - Criar Novo Endereço

#### **Descrição**
Cria um novo endereço para um usuário.

#### **Corpo da Requisição**
```json
{
  "street": "Rua das Flores, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "country": "Brasil",
  "userId": "uuid-usuario"
}
```

#### **Exemplo de Uso**
```bash
POST /api/enderecos
Content-Type: application/json

{
  "street": "Avenida Paulista, 1000",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01310-100",
  "country": "Brasil",
  "userId": "user-123"
}
```

#### **Resposta de Sucesso (201)**
```json
{
  "id": "address-uuid",
  "street": "Avenida Paulista, 1000",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01310-100",
  "country": "Brasil",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": "user-123",
  "user": {
    "id": "user-123",
    "name": "João Silva",
    "email": "joao@email.com",
    "city": "São Paulo",
    "state": "SP",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "fullAddress": "Avenida Paulista, 1000, São Paulo, SP 01310-100, Brasil"
}
```

### **2. GET /api/enderecos** - Listar Endereços

#### **Descrição**
Lista endereços com filtros opcionais.

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `userId` | string | ❌ | Filtrar por usuário |
| `city` | string | ❌ | Filtrar por cidade |
| `state` | string | ❌ | Filtrar por estado |
| `country` | string | ❌ | Filtrar por país |
| `limit` | number | ❌ | Número máximo de endereços |
| `offset` | number | ❌ | Número de endereços para pular |

#### **Exemplos de Uso**
```bash
# Listar todos os endereços
GET /api/enderecos

# Endereços de um usuário específico
GET /api/enderecos?userId=user-123

# Endereços por cidade
GET /api/enderecos?city=São Paulo

# Endereços por estado
GET /api/enderecos?state=SP

# Com paginação
GET /api/enderecos?limit=10&offset=0
```

#### **Resposta de Sucesso (200)**
```json
{
  "enderecos": [
    {
      "id": "address-uuid",
      "street": "Avenida Paulista, 1000",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01310-100",
      "country": "Brasil",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "userId": "user-123",
      "user": { ... },
      "fullAddress": "Avenida Paulista, 1000, São Paulo, SP 01310-100, Brasil"
    }
  ],
  "total": 5
}
```

### **3. GET /api/enderecos/:id** - Buscar Endereço por ID

#### **Descrição**
Retorna os detalhes de um endereço específico.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do endereço (UUID) |

#### **Exemplo de Uso**
```bash
GET /api/enderecos/123e4567-e89b-12d3-a456-426614174000
```

### **4. PUT /api/enderecos/:id** - Atualizar Endereço

#### **Descrição**
Atualiza um endereço existente.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do endereço (UUID) |

#### **Corpo da Requisição**
```json
{
  "street": "Nova Rua, 456",
  "city": "Rio de Janeiro",
  "state": "RJ",
  "zipCode": "20000-000",
  "country": "Brasil",
  "userId": "uuid-usuario"
}
```

### **5. DELETE /api/enderecos/:id** - Deletar Endereço

#### **Descrição**
Deleta um endereço.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | ✅ | ID único do endereço (UUID) |

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `userId` | string | ✅ | ID do usuário proprietário |

#### **Exemplo de Uso**
```bash
DELETE /api/enderecos/123e4567-e89b-12d3-a456-426614174000?userId=user-123
```

### **6. GET /api/enderecos/contar/:tipo** - Contar Endereços

#### **Descrição**
Conta endereços por tipo específico.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `tipo` | string | ✅ | Tipo de contagem (usuario/cidade/estado) |

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `valor` | string | ✅ | Valor para contagem |

#### **Exemplos de Uso**
```bash
# Contar endereços de um usuário
GET /api/enderecos/contar/usuario?valor=user-123

# Contar endereços por cidade
GET /api/enderecos/contar/cidade?valor=São Paulo

# Contar endereços por estado
GET /api/enderecos/contar/estado?valor=SP
```

#### **Resposta de Sucesso (200)**
```json
{
  "tipo": "usuario",
  "valor": "user-123",
  "total": 3
}
```

---

## 🔧 **Configuração e Instalação**

### **Pré-requisitos**
- Node.js 18+
- Docker
- PostgreSQL

### **1. Clone o repositório**
```bash
git clone <repository-url>
cd FIAP-Reuse
```

### **2. Instale as dependências**
```bash
npm install
```

### **3. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/application"
```

### **4. Execute as migrações do banco**
```bash
npx prisma migrate dev
```

### **5. Gere o cliente Prisma**
```bash
npx prisma generate
```

### **6. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

---

## 🧪 **Testando a API**

### **Com cURL**

#### **Autenticação**
```bash
# Fazer login
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# Verificar email
curl -X POST "http://localhost:3000/api/auth/check-email" \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com"}'

# Validar senha
curl -X POST "http://localhost:3000/api/auth/validate-password" \
  -H "Content-Type: application/json" \
  -d '{"senha": "senha123"}'
```

#### **Usuários**
```bash
# Listar usuários
curl -X GET "http://localhost:3000/api/usuarios"

# Buscar usuário por ID
curl -X GET "http://localhost:3000/api/usuarios/uuid-do-usuario"

# Criar usuário
curl -X POST "http://localhost:3000/api/usuarios" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123",
    "cidade": "São Paulo",
    "estado": "SP"
  }'

# Atualizar usuário
curl -X PUT "http://localhost:3000/api/usuarios/uuid-do-usuario" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Atualizado",
    "cidade": "Rio de Janeiro"
  }'

# Deletar usuário
curl -X DELETE "http://localhost:3000/api/usuarios/uuid-do-usuario"
```

#### **Produtos**
```bash
# Listar produtos
curl -X GET "http://localhost:3000/api/produtos"

# Buscar produto por ID
curl -X GET "http://localhost:3000/api/produtos/uuid-do-produto"

# Criar produto
curl -X POST "http://localhost:3000/api/produtos" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Produto Teste",
    "descricao": "Descrição do produto",
    "categoriaId": "uuid-categoria",
    "subcategoriaId": "uuid-subcategoria",
    "usuarioId": "uuid-usuario"
  }'
```

#### **Propostas**
```bash
# Criar proposta
curl -X POST "http://localhost:3000/api/propostas" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Interessado nos seus produtos",
    "responderId": "user-456",
    "requesterId": "user-123",
    "items": [{"postId": "post-1"}]
  }'

# Aceitar proposta
curl -X POST "http://localhost:3000/api/propostas/uuid-proposta/aceitar" \
  -H "Content-Type: application/json" \
  -d '{"responderId": "user-456"}'

# Recusar proposta
curl -X POST "http://localhost:3000/api/propostas/uuid-proposta/recusar" \
  -H "Content-Type: application/json" \
  -d '{"responderId": "user-456"}'

# Buscar proposta por ID
curl -X GET "http://localhost:3000/api/propostas/uuid-proposta"

# Atualizar proposta
curl -X PUT "http://localhost:3000/api/propostas/uuid-proposta" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Nova mensagem da proposta",
    "requesterId": "user-123"
  }'

# Deletar proposta
curl -X DELETE "http://localhost:3000/api/propostas/uuid-proposta?requesterId=user-123"
```

#### **Endereços**
```bash
# Criar endereço
curl -X POST "http://localhost:3000/api/enderecos" \
  -H "Content-Type: application/json" \
  -d '{
    "street": "Rua Teste, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567",
    "country": "Brasil",
    "userId": "user-123"
  }'

# Listar endereços
curl -X GET "http://localhost:3000/api/enderecos"

# Buscar endereço por ID
curl -X GET "http://localhost:3000/api/enderecos/uuid-endereco"

# Atualizar endereço
curl -X PUT "http://localhost:3000/api/enderecos/uuid-endereco" \
  -H "Content-Type: application/json" \
  -d '{
    "street": "Nova Rua, 456",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "zipCode": "20000-000",
    "country": "Brasil",
    "userId": "user-123"
  }'

# Deletar endereço
curl -X DELETE "http://localhost:3000/api/enderecos/uuid-endereco?userId=user-123"

# Contar endereços
curl -X GET "http://localhost:3000/api/enderecos/contar/usuario?valor=user-123"

### **Com Postman**

1. Importe a coleção de endpoints
2. Configure as variáveis de ambiente
3. Execute os testes

### **Scripts de Teste Automatizados**

#### **Executar Testes de Autenticação**
```bash
node test-auth.js
```

#### **Executar Testes de Usuários**
```bash
node test-usuarios.js
```

#### **Executar Testes de Produtos**
```bash
node test-produtos.js
```

#### **Executar Testes de Propostas**
```bash
node test-propostas.js
```

#### **Executar Testes de Endereços**
```bash
node test-enderecos.js
```

---

## 📊 **Estrutura do Banco de Dados**

### **Principais Tabelas**

#### **User**
- `id`: UUID (chave primária)
- `name`: String
- `email`: String (único)
- `passwordHash`: String (criptografado)
- `city`: String (opcional)
- `state`: String (opcional)
- `avatarUrl`: String (opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### **Post (Produtos)**
- `id`: UUID (chave primária)
- `title`: String
- `description`: String (opcional)
- `imageUrl`: String (opcional)
- `rating`: Float (opcional, 0-5)
- `isActive`: Boolean (padrão: true)
- `userId`: UUID (chave estrangeira para User)
- `categoryId`: UUID (chave estrangeira para Category)
- `subcategoryId`: UUID (chave estrangeira para Subcategory)
- `conditionId`: UUID (chave estrangeira para Type, opcional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### **Proposal**
- `id`: UUID (chave primária)
- `message`: String (opcional)
- `status`: String (padrão: "pending", valores: "pending", "accepted", "rejected")
- `requesterId`: UUID (chave estrangeira para User)
- `responderId`: UUID (chave estrangeira para User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

#### **ProposalItem**
- `id`: UUID (chave primária)
- `proposalId`: UUID (chave estrangeira para Proposal)
- `postId`: UUID (chave estrangeira para Post)
- `createdAt`: DateTime

#### **Address**
- `id`: UUID (chave primária)
- `street`: String
- `city`: String
- `state`: String
- `zipCode`: String
- `country`: String
- `userId`: UUID (chave estrangeira para User)
- `createdAt`: DateTime
- `updatedAt`: DateTime

---

## 🔒 **Segurança e Validações**

### **Validações Implementadas**

#### **Autenticação**
- ✅ Validação de campos obrigatórios (email e senha)
- ✅ Verificação de existência do usuário no banco
- ✅ Criptografia de senha com bcryptjs
- ✅ Verificação de credenciais segura
- ✅ Mensagens genéricas para credenciais inválidas

#### **Usuários**
- ✅ Validação de email único
- ✅ Criptografia de senha
- ✅ Validação de formato de email
- ✅ Validação de força da senha
- ✅ Filtros de segurança

#### **Produtos**
- ✅ Campos obrigatórios validados
- ✅ Relacionamentos verificados
- ✅ Soft delete implementado
- ✅ Filtros de segurança
- ✅ Validação de avaliação (0-5)

#### **Propostas**
- ✅ Apenas o destinatário pode aceitar/recusar
- ✅ Apenas propostas pendentes podem ser alteradas
- ✅ Validação de permissões rigorosa
- ✅ Estados bem definidos
- ✅ Validação de item único por proposta

#### **Endereços**
- ✅ Apenas o proprietário pode editar/deletar
- ✅ Campos obrigatórios validados
- ✅ Filtros de localização
- ✅ Validação de propriedade

### **Códigos de Status HTTP**

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Bad Request (dados inválidos)
- **403**: Forbidden (sem permissão)
- **404**: Not Found (recurso não encontrado)
- **500**: Internal Server Error (erro interno)

---

## 📝 **Logs e Monitoramento**

### **Logs Implementados**
- ✅ Logs de criação, atualização e exclusão
- ✅ Logs de erros detalhados
- ✅ Logs de auditoria para propostas
- ✅ Logs de validação de permissões

### **Monitoramento**
- ✅ Tratamento de erros centralizado
- ✅ Respostas padronizadas
- ✅ Códigos de status apropriados
- ✅ Mensagens de erro descritivas

---

## 🚀 **Deploy**

### **Ambiente de Produção**
1. Configure as variáveis de ambiente
2. Execute as migrações
3. Gere o cliente Prisma
4. Build da aplicação
5. Deploy no servidor

### **Docker**
```bash
# Build da imagem
docker build -t fiap-reuse .

# Executar container
docker run -p 3000:3000 fiap-reuse
```

---

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

## 📄 **Licença**

Este projeto está sob a licença MIT.

---

## 📞 **Suporte**

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

---

## 🎯 **Status do Projeto**

- ✅ **API de Autenticação**: Completa e funcional
- ✅ **API de Usuários**: Completa e funcional
- ✅ **API de Produtos**: Completa e funcional
- ✅ **API de Propostas**: Completa e funcional
- ✅ **API de Endereços**: Completa e funcional
- ✅ **Validações**: Implementadas
- ✅ **Testes**: Disponíveis
- ✅ **Documentação**: Completa
- ✅ **Scripts de Teste**: Automatizados

**Sistema 100% funcional e pronto para uso!** 🚀
