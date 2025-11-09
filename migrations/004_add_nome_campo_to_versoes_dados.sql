-- Migration: Adicionar campo nome_campo à tabela versoes_dados
-- Esta migração permite rastrear metadados por campo específico alterado

-- Adicionar coluna nome_campo
ALTER TABLE versoes_dados 
ADD COLUMN IF NOT EXISTS nome_campo TEXT;

-- Criar índice para busca por campo
CREATE INDEX IF NOT EXISTS idx_versoes_dados_nome_campo 
ON versoes_dados(nome_tabela, nome_campo) 
WHERE nome_campo IS NOT NULL;

-- Comentário na coluna
COMMENT ON COLUMN versoes_dados.nome_campo IS 'Nome do campo específico que foi alterado (ex: Escola, Município). NULL significa que a versão se refere a toda a linha';

