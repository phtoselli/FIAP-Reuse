# 📋 API de Propostas - FIAP ReUse

Sistema de gerenciamento de propostas para a plataforma ReUse, seguindo o padrão Repository-Service-Controller.

## 🏗️ **Arquitetura**

### **Padrão Repository-Service-Controller**
```
HTTP Request → Controller → Service → Repository → Database
```

- **Controller**: Gerencia requisições HTTP, validação e respostas
- **Service**: Lógica de negócio e regras de validação
- **Repository**: Acesso aos dados e operações CRUD
- **Model**: Interfaces TypeScript e tipos de dados

## 📋 **Endpoints da API**

### **1. POST /api/propostas** - Criar Nova Proposta

#### **Descrição**
Cria uma nova proposta de troca/compra entre usuários.

#### **Body da Requisição**
```json
{
  "requesterId": "uuid-usuario-solicitante",
  "responderId": "uuid-usuario-destinatario",
  "message": "Gostaria de fazer uma proposta pelos seus produtos",
  "items": [
    {
      "postId": "uuid-produto-1"
    },
    {
      "postId": "uuid-produto-2"
    }
  ]
}
```

#### **Campos**
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `requesterId` | string | ✅ | ID do usuário que está criando a proposta |
| `responderId` | string | ✅ | ID do usuário destinatário da proposta |
| `message` | string | ❌ | Mensagem da proposta |
| `items` | array | ✅ | Lista de produtos incluídos na proposta |

#### **Resposta de Sucesso (201)**
```json
{
  "id": "uuid-proposta-criada",
  "message": "Gostaria de fazer uma proposta pelos seus produtos",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "requester": {
    "id": "uuid-usuario-solicitante",
    "name": "Nome do Solicitante",
    "city": "Cidade",
    "state": "Estado",
    "avatarUrl": "url-avatar"
  },
  "responder": {
    "id": "uuid-usuario-destinatario",
    "name": "Nome do Destinatário",
    "city": "Cidade",
    "state": "Estado",
    "avatarUrl": "url-avatar"
  },
  "items": [
    {
      "id": "uuid-item-1",
      "postId": "uuid-produto-1",
      "post": {
        "id": "uuid-produto-1",
        "title": "Nome do Produto",
        "description": "Descrição do produto",
        "imageUrl": "url-da-imagem",
        "rating": 4.5,
        "isActive": true,
        "category": {
          "id": "uuid-categoria",
          "name": "Nome da Categoria",
          "description": "Descrição da categoria"
        },
        "subcategory": {
          "id": "uuid-subcategoria",
          "name": "Nome da Subcategoria",
          "description": "Descrição da subcategoria"
        },
        "condition": {
          "id": "uuid-condicao",
          "code": "NEW",
          "type": "condition",
          "description": "Produto Novo"
        }
      }
    }
  ],
  "totalItems": 2
}
```

---

### **2. GET /api/propostas** - Listar Propostas

#### **Descrição**
Lista propostas com suporte a filtros.

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `userId` | string | ❌ | Filtrar por usuário específico |
| `role` | string | ❌ | Papel do usuário (requester/responder) |
| `status` | string | ❌ | Filtrar por status (pending/accepted/rejected) |

#### **Exemplos de Uso**
```bash
# Listar todas as propostas
GET /api/propostas

# Listar propostas de um usuário específico
GET /api/propostas?userId=uuid-usuario&role=requester

# Listar propostas por status
GET /api/propostas?status=pending

# Listar propostas recebidas por um usuário
GET /api/propostas?userId=uuid-usuario&role=responder
```

#### **Resposta de Sucesso (200)**
```json
{
  "propostas": [
    {
      "id": "uuid-proposta",
      "message": "Mensagem da proposta",
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

---

### **3. GET /api/propostas/:id** - Buscar Proposta por ID

#### **Descrição**
Retorna os detalhes de uma proposta específica.

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `id` | string | ✅ | ID único da proposta (UUID) |

#### **Exemplo de Uso**
```bash
GET /api/propostas/123e4567-e89b-12d3-a456-426614174000
```

#### **Resposta de Sucesso (200)**
```json
{
  "id": "uuid-proposta",
  "message": "Mensagem da proposta",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "requester": { ... },
  "responder": { ... },
  "items": [ ... ],
  "totalItems": 2
}
```

---

### **4. PUT /api/propostas/:id** - Atualizar Proposta

#### **Descrição**
Atualiza uma proposta existente (apenas o criador pode editar).

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `id` | string | ✅ | ID da proposta a ser atualizada |

#### **Body da Requisição**
```json
{
  "requesterId": "uuid-usuario-solicitante",
  "message": "Nova mensagem da proposta"
}
```

#### **Campos Atualizáveis**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `message` | string | Nova mensagem da proposta |

#### **Resposta de Sucesso (200)**
```json
{
  "id": "uuid-proposta",
  "message": "Nova mensagem da proposta",
  "status": "pending",
  // ... outros campos atualizados
}
```

---

### **5. DELETE /api/propostas/:id** - Deletar Proposta

#### **Descrição**
Deleta uma proposta (apenas o criador pode deletar).

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `id` | string | ✅ | ID da proposta a ser deletada |

#### **Parâmetros de Query**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `requesterId` | string | ✅ | ID do usuário solicitante |

#### **Exemplo de Uso**
```bash
DELETE /api/propostas/123e4567-e89b-12d3-a456-426614174000?requesterId=uuid-usuario
```

#### **Resposta de Sucesso (200)**
```json
{
  "message": "Proposta deletada com sucesso"
}
```

---

### **6. POST /api/propostas/:id/aceitar** - Aceitar Proposta

#### **Descrição**
Aceita uma proposta (apenas o destinatário pode aceitar).

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `id` | string | ✅ | ID da proposta a ser aceita |

#### **Body da Requisição**
```json
{
  "responderId": "uuid-usuario-destinatario"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "message": "Proposta aceita com sucesso",
  "proposta": {
    "id": "uuid-proposta",
    "status": "accepted",
    // ... outros campos da proposta
  }
}
```

---

### **7. POST /api/propostas/:id/recusar** - Recusar Proposta

#### **Descrição**
Recusa uma proposta (apenas o destinatário pode recusar).

#### **Parâmetros da URL**
| Parâmetro | Tipo | Obrigatório | Descrição |
|------------|------|-------------|-----------|
| `id` | string | ✅ | ID da proposta a ser recusada |

#### **Body da Requisição**
```json
{
  "responderId": "uuid-usuario-destinatario"
}
```

#### **Resposta de Sucesso (200)**
```json
{
  "message": "Proposta recusada com sucesso",
  "proposta": {
    "id": "uuid-proposta",
    "status": "rejected",
    // ... outros campos da proposta
  }
}
```

---

## 🗄️ **Estrutura do Banco de Dados**

### **Tabelas Principais**

#### **Proposal (Propostas)**
- `id`: UUID (chave primária)
- `message`: Mensagem da proposta
- `status`: Status (pending/accepted/rejected)
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização
- `requesterId`: ID do usuário solicitante
- `responderId`: ID do usuário destinatário

#### **ProposalItem (Itens da Proposta)**
- `id`: UUID (chave primária)
- `proposalId`: ID da proposta
- `postId`: ID do produto

#### **User (Usuários)**
- `id`: UUID (chave primária)
- `name`: Nome do usuário
- `email`: Email único
- `city`: Cidade
- `state`: Estado
- `avatarUrl`: URL do avatar

#### **Post (Produtos)**
- `id`: UUID (chave primária)
- `title`: Título do produto
- `description`: Descrição
- `imageUrl`: URL da imagem
- `rating`: Avaliação (0-5)
- `isActive`: Status ativo/inativo

---

## 🧪 **Como Testar**

### **Via Postman/Insomnia**

1. **Configurar variáveis de ambiente:**
   - `base_url`: `http://localhost:3000`

2. **Testar endpoints:**
   - **POST**: `{{base_url}}/api/propostas` (criar proposta)
   - **GET**: `{{base_url}}/api/propostas` (listar propostas)
   - **GET**: `{{base_url}}/api/propostas/{ID}` (buscar proposta)
   - **PUT**: `{{base_url}}/api/propostas/{ID}` (atualizar proposta)
   - **DELETE**: `{{base_url}}/api/propostas/{ID}` (deletar proposta)
   - **POST**: `{{base_url}}/api/propostas/{ID}/aceitar` (aceitar proposta)
   - **POST**: `{{base_url}}/api/propostas/{ID}/recusar` (recusar proposta)

### **Via cURL**

```bash
# Criar proposta
curl -X POST http://localhost:3000/api/propostas \
  -H "Content-Type: application/json" \
  -d '{"requesterId":"uuid-solicitante","responderId":"uuid-destinatario","message":"Proposta teste","items":[{"postId":"uuid-produto"}]}'

# Listar propostas
curl -X GET "http://localhost:3000/api/propostas?status=pending"

# Buscar proposta por ID
curl -X GET http://localhost:3000/api/propostas/{ID}

# Aceitar proposta
curl -X POST http://localhost:3000/api/propostas/{ID}/aceitar \
  -H "Content-Type: application/json" \
  -d '{"responderId":"uuid-destinatario"}'

# Recusar proposta
curl -X POST http://localhost:3000/api/propostas/{ID}/recusar \
  -H "Content-Type: application/json" \
  -d '{"responderId":"uuid-destinatario"}'
```

---

## 🔒 **Validações de Segurança**

### **Regras de Negócio**
1. **Apenas o criador** pode editar/deletar uma proposta
2. **Apenas o destinatário** pode aceitar/recusar uma proposta
3. **Apenas propostas pendentes** podem ser editadas/aceitas/recusadas
4. **Validação de usuários** em todas as operações
5. **Logs de auditoria** para todas as ações

### **Status das Propostas**
- **`pending`**: Proposta aguardando resposta
- **`accepted`**: Proposta aceita pelo destinatário
- **`rejected`**: Proposta recusada pelo destinatário

---

## 📁 **Estrutura do Projeto**

```
src/
├── app/api/propostas/
│   ├── route.ts                    # Endpoint principal
│   ├── [id]/
│   │   ├── route.ts                # Operações por ID
│   │   ├── aceitar/
│   │   │   └── route.ts            # Aceitar proposta
│   │   └── recusar/
│   │       └── route.ts            # Recusar proposta
│   ├── ProposalController.ts        # Controller
│   └── README.md                   # Documentação
├── database/repositories/
│   └── proposal.repository.ts      # Repository
├── service/proposals/
│   ├── ProposalService.ts          # Service
│   ├── test-propostas.ts          # Testes
│   └── index.ts                    # Exportações
└── types/proposal/
    └── ProposalModel.ts            # Tipos TypeScript
```

---

## 🚀 **Funcionalidades Implementadas**

✅ **Criação de proposta** com validações  
✅ **Busca por ID** com relacionamentos completos  
✅ **Listagem com filtros** (usuário, status, papel)  
✅ **Atualização** com validações de permissão  
✅ **Exclusão** com validações de permissão  
✅ **Aceitar proposta** com validações de segurança  
✅ **Recusar proposta** com validações de segurança  
✅ **Validações de negócio** completas  
✅ **Tratamento de erros** padronizado  
✅ **Logs de auditoria** para todas as operações  

---

## 📝 **Logs e Monitoramento**

### **Tratamento de Erros**
Todos os endpoints incluem:
- Validação de entrada
- Verificação de permissões
- Validação de regras de negócio
- Logs de erro detalhados
- Respostas HTTP padronizadas

### **Códigos de Status**
- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **403**: Acesso negado
- **404**: Proposta não encontrada
- **500**: Erro interno do servidor

---

**Desenvolvido com ❤️ pela equipe FIAP ReUse**
