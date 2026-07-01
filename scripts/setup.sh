#!/bin/bash
# ===========================================
# WhatsAI - Guia de Setup Pós-Deploy
# ===========================================
# Execute estes passos APÓS fazer o deploy no Railway
# ===========================================

set -e

echo ""
echo "========================================"
echo "   WhatsAI - Guia de Configuração"
echo "========================================"
echo ""
echo "Este guia ajuda a configurar os serviços externos"
echo "necessários para o funcionamento completo do WhatsAI."
echo ""

# ───────────────────────────────────────────
# PASSO 1: Configurar Banco de Dados (Supabase)
# ───────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║  PASSO 1: Configurar Banco de Dados      ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "1. Acesse o Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/plbtzopcqtberxhxktaw/sql/new"
echo ""
echo "2. Copie e cole o conteúdo do arquivo:"
echo "   supabase/migrations/001_initial_schema.sql"
echo ""
echo "3. Clique em RUN para executar o SQL"
echo ""
echo "4. Copie as credenciais do Supabase:"
echo "   - Project Settings > Database > Connection string (DATABASE_URL)"
echo "   - Project Settings > API > Project URL (SUPABASE_URL)"
echo "   - Project Settings > API > anon public key (SUPABASE_ANON_KEY)"
echo "   - Project Settings > API > service_role key (SUPABASE_SERVICE_KEY)"
echo ""

# ───────────────────────────────────────────
# PASSO 2: Configurar Variáveis de Ambiente no Railway
# ───────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║  PASSO 2: Configurar Variáveis no Railway ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "No Railway, vá em Variables e adicione:"
echo ""
echo "--- Banco & Supabase ---"
echo "DATABASE_URL=postgresql://..."
echo "SUPABASE_URL=https://..."
echo "SUPABASE_SERVICE_KEY=..."
echo "SUPABASE_ANON_KEY=..."
echo "NEXT_PUBLIC_SUPABASE_URL=https://..."
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
echo ""
echo "--- Mercado Pago ---"
echo "MERCADO_PAGO_ACCESS_TOKEN=..."
echo "MERCADO_PAGO_WEBHOOK_SECRET=..."
echo ""
echo "--- App ---"
echo "NEXT_PUBLIC_APP_URL=https://seu-app.railway.app"
echo ""
echo "--- WhatsApp (Evolution API) ---"
echo "EVOLUTION_API_URL=https://seu-evolution.railway.app"
echo "EVOLUTION_API_KEY=..."
echo ""
echo "--- IA (pelo menos UM) ---"
echo "OPENROUTER_API_KEY=sk-or-..."
echo "GROQ_API_KEY=gsk_..."
echo "CEREBRAS_API_KEY=..."
echo "MISTRAL_API_KEY=..."
echo "OPENCODE_ZEN_API_KEY=..."
echo ""

# ───────────────────────────────────────────
# PASSO 3: Configurar Webhook do Mercado Pago
# ───────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║  PASSO 3: Webhook do Mercado Pago        ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "1. Acesse: https://www.mercadopago.com.br/developers/panel"
echo ""
echo "2. Selecione sua aplicação > Webhooks"
echo ""
echo "3. Adicione a URL:"
echo "   https://seu-app.railway.app/api/webhooks/mercadopago"
echo ""
echo "4. Selecione os eventos:"
echo "   - payment.created"
echo "   - payment.updated"
echo ""
echo "5. Gere um secret (webhook_secret) e adicione no Railway"
echo "   como MERCADO_PAGO_WEBHOOK_SECRET"
echo ""
echo "6. O ACCESS_TOKEN você encontra em:"
echo "   https://www.mercadopago.com.br/settings/account/credentials"
echo ""

# ───────────────────────────────────────────
# PASSO 4: Configurar Evolution API (WhatsApp)
# ───────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║  PASSO 4: Evolution API (WhatsApp)        ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "A Evolution API é necessária para conectar WhatsApp."
echo ""
echo "Opção 1 - Deploy no Railway (recomendado):"
echo "   - Acesse: https://railway.app/new/template/evolution"
echo "   - Ou use: https://github.com/EvolutionAPI/evolution-api"
echo "   - Configure a API_KEY e a URL nos templates"
echo ""
echo "Opção 2 - Docker:"
echo "   docker run -d --name evolution-api "
echo "     -p 8080:8080 "
echo "     -e AUTHENTICATION_API_KEY=sua-chave-aqui "
echo "     -e DATABASE_ENABLED=true "
echo "     -e DATABASE_CONNECTION_URI=postgresql://... "
echo "     atendai/evolution-api"
echo ""
echo "Após instalar, configure no Railway:"
echo "   EVOLUTION_API_URL=https://seu-evolution.railway.app"
echo "   EVOLUTION_API_KEY=sua-chave-aqui"
echo ""

# ───────────────────────────────────────────
# PASSO 5: Verificar Deploy
# ───────────────────────────────────────────
echo "╔══════════════════════════════════════════╗"
echo "║  PASSO 5: Verificar Deploy               ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "1. Acesse sua aplicação em:"
echo "   https://seu-app.railway.app"
echo ""
echo "2. Teste o fluxo de login/registro"
echo ""
echo "3. Conecte um WhatsApp no dashboard"
echo ""
echo "4. Faça um teste de pagamento com PIX"
echo ""
echo "========================================"
echo "   WhatsAI pronto para vender! 🚀"
echo "========================================"
