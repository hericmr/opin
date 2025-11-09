#!/bin/bash

# Script para fazer deploy da branch feature/versionamento-metadados
# OPIN - Sistema de Versionamento de Metadados

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy da branch feature/versionamento-metadados..."
echo ""

# Verificar se está na branch correta
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "feature/versionamento-metadados" ]; then
    echo "❌ Erro: Você não está na branch feature/versionamento-metadados"
    echo "   Branch atual: $CURRENT_BRANCH"
    echo "   Execute: git checkout feature/versionamento-metadados"
    exit 1
fi

echo "✅ Branch correta: $CURRENT_BRANCH"
echo ""

# Verificar status
echo "📊 Verificando status do Git..."
git status --short
echo ""

# Perguntar se deseja continuar
read -p "Deseja continuar? (s/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
    echo "❌ Operação cancelada"
    exit 1
fi

# Adicionar arquivos
echo ""
echo "📦 Adicionando arquivos ao Git..."
git add Planning.md
git add migrations/
git add src/services/versionamentoService.js
git add src/components/AdminPanel/components/MetadadosForm.js
git add src/components/AdminPanel/hooks/useEscolas.js
git add src/components/AdminPanel/index.js
git add DEPLOY_GUIDE.md
git add deploy-feature.sh

echo "✅ Arquivos adicionados"
echo ""

# Criar commit
echo "💾 Criando commit..."
git commit -m "feat: implementa sistema de versionamento de metadados

- Adiciona tabelas fontes_dados e versoes_dados no banco
- Cria serviço de versionamento (versionamentoService.js)
- Adiciona formulário de metadados no painel admin
- Integra versionamento automático em criações/edições de escolas
- Adiciona migrações SQL e documentação completa
- Formulário de metadados é opcional e não bloqueia salvamento"

echo "✅ Commit criado"
echo ""

# Push para GitHub
echo "🚀 Fazendo push para GitHub..."
git push -u origin feature/versionamento-metadados

echo ""
echo "✅ Push concluído!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Acesse o GitHub e crie um Pull Request"
echo "   2. Revise as mudanças"
echo "   3. Após aprovar, faça merge em main"
echo "   4. Execute: npm run deploy (na branch main)"
echo ""
echo "🧪 Para testar localmente antes do merge:"
echo "   npm run build"
echo "   npm start"
echo ""

