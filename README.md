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

## Como rodar o projeto

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/phtoselli/FIAP-Reuse.git
cd FIAP-Reuse

2️⃣ Instale as dependências

npm install

3️⃣ Crie o arquivo .env na raiz do projeto

Adicione o seguinte conteúdo:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/reuse_db"

4️⃣ Gere o cliente Prisma

npx prisma generate

5️⃣ Inicie o Docker

Certifique-se de que o Docker está aberto na sua máquina e execute:

docker compose up

6️⃣ Crie as tabelas no banco de dados

npx prisma db push

7️⃣ Execute o projeto

npm run dev

⚙️ Observação
	-	Caso a versão do Docker seja atual, remova a primeira linha do arquivo docker-compose.yml:

version: "3.9"

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
- ✅ **Integração completa** com a plataforma ### 🎨 Interface
