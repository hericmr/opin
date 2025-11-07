#!/bin/bash

# Script para atualizar GitHub, fazer build e deploy
# OPIN - Observatório dos Professores Indígenas

echo "🔄 Verificando status do Git..."
git status

echo ""
echo "📦 Adicionando arquivos modificados..."
git add .

echo ""
echo "💾 Criando commit..."
git commit -m "Corrige Service Worker: resolve ChunkLoadError, garante que sempre retorna Response válida, não cacheia arquivos com hash, atualiza versão do cache para v3"

echo ""
echo "🚀 Fazendo push para GitHub..."
git push origin main

echo ""
echo "🏗️ Executando build..."
npm run build

echo ""
echo "✅ Processo concluído!"
echo "📝 O deploy será feito automaticamente via GitHub Actions quando o push for concluído."

