-- Migration: Adicionar tabela de configurações globais de visibilidade de cards
-- Permite definir configuração padrão que vale para todas as escolas

-- Criar tabela de configurações globais
CREATE TABLE IF NOT EXISTS configuracao_global (
  id SERIAL PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor JSONB NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir configuração padrão de visibilidade global
INSERT INTO configuracao_global (chave, valor, descricao)
VALUES (
  'cards_visibilidade_global',
  '{
    "basicInfo": true,
    "modalidades": true,
    "infraestrutura": true,
    "gestaoProfessores": true,
    "projetosParcerias": true,
    "historiaEscola": true,
    "imagensEscola": true,
    "historiaProfessor": true,
    "documentos": true,
    "videos": true
  }'::jsonb,
  'Configuração padrão de visibilidade de cards para todas as escolas. Escolas individuais podem sobrescrever esta configuração.'
)
ON CONFLICT (chave) DO NOTHING;

-- Criar índice GIN para consultas eficientes
CREATE INDEX IF NOT EXISTS idx_configuracao_global_valor 
ON configuracao_global USING GIN (valor);

-- Comentário na tabela
COMMENT ON TABLE configuracao_global IS 
'Tabela para armazenar configurações globais do sistema. A chave "cards_visibilidade_global" define a visibilidade padrão dos cards.';







