# WhatsAI - Funcionário Digital para WhatsApp

> **SaaS de atendimento inteligente via WhatsApp com IA**
> Ideal para pequenas e médias empresas brasileiras automatizarem vendas e atendimento.

---

## 📋 Sobre o Projeto

O **WhatsAI** é um funcionário digital que atende seus clientes no WhatsApp 24 horas por dia. 
Ele vende, negocia, faz orçamentos, tira dúvidas e faz pós-venda automaticamente usando Inteligência Artificial.

### 🎯 Público-Alvo
- Restaurantes, padarias e lanchonetes
- Clínicas e consultórios
- Pet shops e agropecuárias
- Lojas e e-commerces
- Oficinas e prestadores de serviço
- Imobiliárias
- Qualquer PME que usa WhatsApp

---

## 🚀 Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|-------|
| Frontend | Next.js | 16.x |
| Linguagem | TypeScript | 5.x |
| Estilização | Tailwind CSS | 4.x |
| ORM | Prisma | 7.x |
| Banco | PostgreSQL (Supabase) | 15.x |
| Auth | Supabase Auth | - |
| IA | OpenRouter + OpenCode Zen + Groq + Cerebras + Mistral | - |
| Pagamentos | Mercado Pago | - |
| WhatsApp | Evolution API | - |
| Hospedagem | Railway | - |
| Storage | Supabase Storage | - |

---

## 📦 Pré-requisitos

- **Node.js** >= 20.0.0
- **npm** ou **yarn**
- **Conta no Supabase** (gratuita: https://supabase.com)
- **Conta no Railway** (gratuita: https://railway.app)
- **Conta no Mercado Pago** (gratuita: https://mercadopago.com.br)
- **Evolution API** (self-hosted ou serviço gerenciado)
- **Chaves de API de IA** (OpenRouter, Groq, etc.)

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/pixel010dev-dotcom/-whats-ai-saas.git
cd whats-ai-saas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com as seguintes informações:

| Variável | Onde conseguir |
|----------|---------------|
| `DATABASE_URL` | Supabase > Project Settings > Database > Connection string |
| `SUPABASE_URL` | Supabase > Project Settings > API > Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase > Project Settings > API > service_role key |
| `SUPABASE_ANON_KEY` | Supabase > Project Settings > API > anon public key |
| `MERCADO_PAGO_ACCESS_TOKEN` | Mercado Pago > Developers > Credenciais |
| `EVOLUTION_API_URL` | Sua instância da Evolution API |
| `OPENROUTER_API_KEY` | https://openrouter.ai/keys |
| `GROQ_API_KEY` | https://console.groq.com/keys |

### 4. Configure o banco de dados

```bash
# Gera o Prisma Client
npx prisma generate

# Aplica as migrations no banco
npx prisma db push

# Popula o banco com dados de exemplo
npm run seed
```

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy no Railway

### 1. Conecte o repositório

1. Faça login no [Railway](https://railway.app)
2. Clique em **New Project** > **Deploy from GitHub repo**
3. Selecione o repositório do WhatsAI
4. O Railway detectará automaticamente o `railway.toml`

### 2. Configure as variáveis de ambiente

No Railway, vá em **Variables** e adicione TODAS as variáveis do `.env.example`.

### 3. Configure o banco de dados

O Railway pode provisionar um PostgreSQL automaticamente:
1. No projeto Railway, clique em **New** > **Database** > **PostgreSQL**
2. Copie a `DATABASE_URL` gerada
3. Adicione nas variáveis de ambiente
4. O comando `npx prisma db push && npm start` no `railway.toml` executará as migrations automaticamente

### 4. Deploy automático

O Railway faz deploy automático a cada push no GitHub.
Para fazer manualmente:
```bash
git push origin main
```

---

## 💰 Planos e Preços

| Plano | Preço | WhatsApps | Conversas |
|-------|-------|-----------|-----------|
| Básico | R$ 97/mês | 1 número | 500/mês |
| Profissional | R$ 197/mês | 2 números | Ilimitado |
| Premium | R$ 297/mês | 5 números | Ilimitado + API |

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/           # API Routes
│   │   ├── auth/      # Login, registro, perfil
│   │   ├── chat/      # Processamento de mensagens com IA
│   │   ├── conversations/  # Conversas do WhatsApp
│   │   ├── customers/      # CRM de clientes
│   │   ├── dashboard/      # Métricas e timeline
│   │   ├── products/       # CRUD de produtos
│   │   ├── categories/     # CRUD de categorias
│   │   ├── knowledge/      # Base de conhecimento
│   │   ├── payments/       # Mercado Pago
│   │   ├── subscriptions/  # Assinaturas
│   │   └── whatsapp/       # Conexão WhatsApp
│   ├── dashboard/     # Páginas do dashboard
│   ├── login/         # Página de login
│   └── register/      # Página de cadastro
├── components/
│   ├── dashboard/     # Componentes do dashboard
│   ├── landing/       # Componentes da landing page
│   └── ui/            # Componentes base
├── lib/
│   ├── ai/            # Cliente de IA com fallback
│   ├── prisma.ts      # PrismaClient singleton
│   ├── supabase.ts    # Clientes Supabase
│   ├── mercadopago.ts # Integração Mercado Pago
│   ├── whatsapp/      # Evolution API
│   ├── utils.ts       # Utilitários
│   └── validations.ts # Schemas Zod
└── types/             # Tipos TypeScript
```

---

## 🧠 Sistema de IA

O WhatsAI utiliza fallback automático entre múltiplos provedores de IA:

1. **OpenCode Zen** (DeepSeek V4 Flash) - Prioritário (gratuito)
2. **OpenRouter** (Gemini Flash) - Fallback 1
3. **Groq** (Llama 3.3 70B) - Fallback 2
4. **Cerebras** (Llama 3.1 8B) - Fallback 3
5. **Mistral** (Mistral Small) - Fallback 4

Cada empresa pode configurar:
- **Tom de voz**: formal, casual, técnico
- **Regras**: não vender fiado, não dar desconto
- **Mensagem de boas-vindas** personalizada
- **Limites**: horário de funcionamento

---

## 📄 Licença

Este projeto é proprietário. Todos os direitos reservados.

---

## 🤝 Suporte

Para suporte, entre em contato pelo email: pixel010dev@gmail.com
