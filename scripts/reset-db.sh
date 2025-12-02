#!/bin/bash

# Script para resetar o banco de dados local (PostgreSQL)
# Substitui o comando 'npx supabase db reset'

# Configurações do Banco de Dados
# Ajuste conforme sua configuração local
DB_HOST="localhost"
DB_PORT="5432" # Porta padrão do Postgres (ou 54322 se estiver usando Docker do Supabase antigo)
DB_USER="postgres"
DB_NAME="postgres"

echo "=== Resetando Banco de Dados Local ==="
echo "Conectando a $DB_HOST:$DB_PORT..."

# Verifica se o psql está instalado
if ! command -v psql &> /dev/null; then
    echo "Erro: psql não encontrado. Por favor, instale o cliente PostgreSQL."
    exit 1
fi

# Executa a migração
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "database/migrations/20251202200000_full_setup.sql"

if [ $? -eq 0 ]; then
    echo "=== Banco de dados resetado com sucesso! ==="
else
    echo "=== Falha ao resetar o banco de dados ==="
    exit 1
fi
