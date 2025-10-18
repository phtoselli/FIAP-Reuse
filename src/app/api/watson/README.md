# 🤖 Watson Assistant - Automações ReUse

Sistema de automação com IBM Watson Assistant para a plataforma ReUse, integrando 3 funcionalidades principais via chat.

## 🎯 **Automações Implementadas**

### 1. **Ver Detalhes de Produto** 📦
- **Endpoint:** `GET /api/produtos/:id`
- **Comando no chat:** "Quero ver os detalhes do produto [ID]"
- **Benefício:** O chat traz descrição, condição, fotos e dados do ofertante
- **Exemplo:** "Quero ver os detalhes do produto abc123"

### 2. **Listar Endereços do Usuário** 🏠
- **Endpoint:** `GET /api/enderecos?userId=...`
- **Comando no chat:** "Quero ver meus endereços"
- **Benefício:** Usuário confirma/seleciona endereço para etapas de envio
- **Exemplo:** "Mostre meus endereços cadastrados"

### 3. **Aceitar Proposta de Troca** ✅
- **Endpoint:** `POST /api/propostas/:id/aceitar`
- **Comando no chat:** "Quero aceitar a proposta [ID]"
- **Benefício:** Agiliza a negociação já pendente, direto pelo chat
- **Exemplo:** "Aceito a proposta xyz789"

## 🏗️ **Arquitetura**

```
Chat Interface → Watson Assistant → API ReUse → Controllers Existentes
```

### **Fluxo de Processamento:**
1. **Usuário envia mensagem** no chat
2. **Watson Assistant** processa e identifica intenções
3. **API ReUse** chama controllers existentes
4. **Resposta formatada** é retornada ao chat

## 📋 **Endpoints da API**

### **POST /api/watson** - Processar Mensagem
Processa mensagens do chat e executa automações.

#### **Body da Requisição**
```json
{
  "message": "Quero ver os detalhes do produto abc123",
  "userId": "uuid-usuario",
  "sessionId": "uuid-sessao"
}
```

#### **Resposta de Sucesso**
```json
{
  "success": true,
  "watsonResponse": {
    "output": {
      "generic": [...],
      "intents": [...],
      "entities": [...]
    }
  },
  "reuseResponse": {
    "action": "product_details",
    "data": { ... },
    "message": "📦 **Nome do Produto**\n\n📝 **Descrição:** ..."
  },
  "sessionId": "uuid-sessao"
}
```

### **GET /api/watson** - Criar Sessão
Cria uma nova sessão com o Watson Assistant.

#### **Resposta de Sucesso**
```json
{
  "success": true,
  "sessionId": "uuid-sessao",
  "message": "Sessão criada com sucesso"
}
```

## 🔧 **Configuração**

### **Variáveis de Ambiente**
```env
WATSON_API_KEY="Lom8024k7Y365OsyUsCXUmaGALnfgbBoTOqwkv12eeXm"
WATSON_URL="https://api.au-syd.assistant.watson.cloud.ibm.com/instances/747d821a-e028-437b-bc06-317f97112a5c"
WATSON_ASSISTANT_ID="your-assistant-id"
```

### **Dependências**
```json
{
  "ibm-watson": "^7.0.0"
}
```

## 🎨 **Componentes React**

### **WatsonChat**
Componente principal do chat integrado.

```tsx
import WatsonChat from '@/components/WatsonChat';

<WatsonChat 
  userId="uuid-usuario"
  onProductDetails={(productId) => console.log('Produto:', productId)}
  onListAddresses={(userId) => console.log('Endereços:', userId)}
  onAcceptProposal={(proposalId, userId) => console.log('Proposta aceita')}
/>
```

### **useWatson Hook**
Hook personalizado para integração.

```tsx
import { useWatson, useWatsonActions } from '@/hooks/useWatson';

const { sendMessage, isLoading } = useWatson();
const { getProductDetails, listUserAddresses, acceptProposal } = useWatsonActions();
```

## 🧪 **Como Testar**

### **1. Teste de Produto**
```bash
curl -X POST http://localhost:3000/api/watson \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quero ver os detalhes do produto abc123",
    "userId": "user-uuid"
  }'
```

### **2. Teste de Endereços**
```bash
curl -X POST http://localhost:3000/api/watson \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quero ver meus endereços",
    "userId": "user-uuid"
  }'
```

### **3. Teste de Proposta**
```bash
curl -X POST http://localhost:3000/api/watson \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Quero aceitar a proposta xyz789",
    "userId": "user-uuid"
  }'
```

## 🎯 **Intenções do Watson**

### **Configuração no Watson Assistant**
Configure as seguintes intenções no seu workspace:

1. **ver_detalhes_produto**
   - Exemplos: "ver produto", "detalhes do produto", "mostrar produto"
   - Entidade: `product_id`

2. **listar_enderecos**
   - Exemplos: "meus endereços", "listar endereços", "endereços cadastrados"

3. **aceitar_proposta**
   - Exemplos: "aceitar proposta", "aceito a proposta", "confirmar proposta"
   - Entidade: `proposal_id`

## 🔒 **Segurança**

- ✅ Validação de usuário em todas as operações
- ✅ Verificação de permissões para aceitar propostas
- ✅ Tratamento de erros padronizado
- ✅ Logs de auditoria para todas as ações

## 📝 **Logs e Monitoramento**

- ✅ Logs de interação com Watson
- ✅ Logs de chamadas para controllers
- ✅ Logs de erros detalhados
- ✅ Métricas de uso das automações

## 🚀 **Próximos Passos**

1. **Configurar Assistant ID** no Watson Assistant
2. **Treinar intenções** com exemplos reais
3. **Testar integração** com dados reais
4. **Implementar interface** de chat na aplicação
5. **Adicionar mais automações** conforme necessário

---

**Desenvolvido com ❤️ pela equipe FIAP ReUse**
