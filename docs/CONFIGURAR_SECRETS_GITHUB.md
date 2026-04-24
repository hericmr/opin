# Como Configurar Secrets da API no GitHub Actions

Este guia explica como configurar as variáveis de ambiente da API como secrets no GitHub para que o build de produção funcione corretamente.

## Passo 1: Obter as Credenciais

1. **URL base da API**: `http://opin.unifesp.br` (ou o endereço configurado no servidor)
2. **Chave anônima (JWT)**: gerada junto com o PostgREST/storage

## Passo 2: Configurar Secrets no GitHub

1. Acesse seu repositório no GitHub: `https://github.com/hericmr/opin`
2. Vá em **Settings** → **Secrets and variables** → **Actions**
3. Clique em **New repository secret**
4. Adicione os seguintes secrets:

### Secret 1: `VITE_API_URL`
- **Name**: `VITE_API_URL`
- **Value**: URL base do servidor (exemplo: `http://opin.unifesp.br`)

### Secret 2: `VITE_API_ANON_KEY`
- **Name**: `VITE_API_ANON_KEY`
- **Value**: Chave JWT anônima do PostgREST

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

