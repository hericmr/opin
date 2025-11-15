# Como Configurar Secrets do Supabase no GitHub Actions

Este guia explica como configurar as variáveis de ambiente do Supabase como secrets no GitHub para que o build de produção funcione corretamente.

## Passo 1: Obter as Credenciais do Supabase

1. Acesse o [Painel do Supabase](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie os seguintes valores:
   - **Project URL** (exemplo: `https://xxxxx.supabase.co`)
   - **anon public key** (uma chave longa que começa com `eyJ...`)

## Passo 2: Configurar Secrets no GitHub

1. Acesse seu repositório no GitHub: `https://github.com/hericmr/opin`
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Adicione os seguintes secrets:

### Secret 1: `VITE_SUPABASE_URL`
- **Name**: `VITE_SUPABASE_URL`
- **Value**: Cole a **Project URL** do Supabase (exemplo: `https://xxxxx.supabase.co`)

### Secret 2: `VITE_SUPABASE_ANON_KEY`
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Cole a **anon public key** do Supabase

## Passo 3: Verificar a Configuração

Após adicionar os secrets:

1. Vá em **Actions** no seu repositório
2. Execute manualmente o workflow "Build and Deploy to GitHub Pages" (se necessário)
3. Verifique os logs do build para confirmar que as variáveis estão sendo usadas

## Importante

- ⚠️ **Nunca** commite as credenciais do Supabase diretamente no código
- ✅ Use sempre **Secrets** do GitHub para variáveis sensíveis
- ✅ As variáveis são injetadas apenas durante o build, não ficam expostas no código final
- ✅ O arquivo `.env.local` é apenas para desenvolvimento local e não deve ser commitado

## Troubleshooting

Se o build ainda falhar após configurar os secrets:

1. Verifique se os nomes dos secrets estão exatamente como especificado acima
2. Verifique se os valores foram copiados corretamente (sem espaços extras)
3. Execute o workflow manualmente e verifique os logs
4. Certifique-se de que o repositório tem permissões para usar secrets

## Referências

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Supabase API Settings](https://app.supabase.com/project/_/settings/api)

