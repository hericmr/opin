-- Migration: Adicionar controle de visibilidade de cards
-- Permite desabilitar cards específicos no painel de informações

-- Adicionar coluna JSONB para armazenar configurações de visibilidade
ALTER TABLE escolas_completa 
ADD COLUMN IF NOT EXISTS cards_visibilidade JSONB DEFAULT '{
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
}'::jsonb;

-- Criar índice GIN para consultas eficientes
CREATE INDEX IF NOT EXISTS idx_escolas_cards_visibilidade 
ON escolas_completa USING GIN (cards_visibilidade);

-- Comentário na coluna
COMMENT ON COLUMN escolas_completa.cards_visibilidade IS 
'Configuração de visibilidade dos cards no painel de informações. Cada chave representa um card e o valor booleano indica se está visível.';








