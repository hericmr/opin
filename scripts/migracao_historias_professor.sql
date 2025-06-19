-- Script de Migração para Histórias do Professor
-- Execute este script no SQL Editor do Supabase

-- 1. Criar a nova tabela historias_professor
CREATE TABLE IF NOT EXISTS historias_professor (
  id SERIAL PRIMARY KEY,
  escola_id INTEGER REFERENCES escolas_completa(id) ON DELETE CASCADE,
  titulo TEXT,
  historia TEXT NOT NULL,
  imagem_url TEXT,
  descricao_imagem TEXT,
  ordem INTEGER DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_historias_professor_escola_id ON historias_professor(escola_id);
CREATE INDEX IF NOT EXISTS idx_historias_professor_ordem ON historias_professor(ordem);
CREATE INDEX IF NOT EXISTS idx_historias_professor_ativo ON historias_professor(ativo);

-- 3. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Criar trigger para updated_at
DROP TRIGGER IF EXISTS update_historias_professor_updated_at ON historias_professor;
CREATE TRIGGER update_historias_professor_updated_at 
    BEFORE UPDATE ON historias_professor 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Migrar dados existentes da tabela escolas_completa
-- Esta migração só deve ser executada UMA VEZ
INSERT INTO historias_professor (escola_id, historia, created_at)
SELECT 
  id as escola_id,
  historia_do_prof as historia,
  NOW() as created_at
FROM escolas_completa 
WHERE historia_do_prof IS NOT NULL 
  AND historia_do_prof != ''
  AND historia_do_prof != 'null'
  AND NOT EXISTS (
    SELECT 1 FROM historias_professor hp 
    WHERE hp.escola_id = escolas_completa.id
  );

-- 6. Verificar a migração
SELECT 
  'Escolas com história_do_prof' as tipo,
  COUNT(*) as quantidade
FROM escolas_completa 
WHERE historia_do_prof IS NOT NULL 
  AND historia_do_prof != ''
  AND historia_do_prof != 'null'

UNION ALL

SELECT 
  'Histórias migradas' as tipo,
  COUNT(*) as quantidade
FROM historias_professor;

-- 7. Criar bucket para imagens (se não existir)
-- Nota: Buckets devem ser criados manualmente no painel do Supabase
-- Nome do bucket: historia-professor-imagens

-- 8. Configurar políticas de segurança (RLS) para o bucket
-- Execute estas políticas no painel do Supabase > Storage > Policies

-- Política de leitura pública para o bucket historia-professor-imagens:
/*
CREATE POLICY "Permitir leitura pública de imagens de história do professor"
ON storage.objects FOR SELECT
USING (bucket_id = 'historia-professor-imagens');
*/

-- Política de upload para usuários autenticados:
/*
CREATE POLICY "Permitir upload de imagens de história do professor"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'historia-professor-imagens' AND auth.role() = 'authenticated');
*/

-- 9. Configurar políticas de segurança (RLS) para a tabela historias_professor
-- Execute estas políticas no painel do Supabase > Authentication > Policies

-- Política de leitura pública:
/*
CREATE POLICY "Permitir leitura pública de histórias do professor"
ON historias_professor FOR SELECT
USING (ativo = true);
*/

-- Política de inserção para usuários autenticados:
/*
CREATE POLICY "Permitir inserção de histórias do professor"
ON historias_professor FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
*/

-- Política de atualização para usuários autenticados:
/*
CREATE POLICY "Permitir atualização de histórias do professor"
ON historias_professor FOR UPDATE
USING (auth.role() = 'authenticated');
*/

-- Política de exclusão para usuários autenticados:
/*
CREATE POLICY "Permitir exclusão de histórias do professor"
ON historias_professor FOR DELETE
USING (auth.role() = 'authenticated');
*/

-- 10. Configurar políticas de segurança (RLS) para a tabela imagens_escola
-- Esta tabela é usada pelo serviço de upload de imagens

-- Habilitar RLS na tabela imagens_escola (se não estiver habilitado)
/*
ALTER TABLE imagens_escola ENABLE ROW LEVEL SECURITY;
*/

-- Política de leitura pública para imagens_escola:
/*
CREATE POLICY "Permitir leitura pública de imagens da escola"
ON imagens_escola FOR SELECT
USING (true);
*/

-- Política de inserção para usuários autenticados:
/*
CREATE POLICY "Permitir inserção de imagens da escola"
ON imagens_escola FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
*/

-- Política de atualização para usuários autenticados:
/*
CREATE POLICY "Permitir atualização de imagens da escola"
ON imagens_escola FOR UPDATE
USING (auth.role() = 'authenticated');
*/

-- Política de exclusão para usuários autenticados:
/*
CREATE POLICY "Permitir exclusão de imagens da escola"
ON imagens_escola FOR DELETE
USING (auth.role() = 'authenticated');
*/

-- 11. Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'historias_professor'
ORDER BY ordinal_position;

-- 12. Exemplo de dados de teste (opcional)
-- Descomente para inserir dados de teste
/*
INSERT INTO historias_professor (escola_id, titulo, historia, ordem, ativo) VALUES
(1, 'História do Professor João', 'O professor João começou sua jornada na educação indígena há 15 anos...', 1, true),
(1, 'Memórias da Comunidade', 'Durante os primeiros anos, a comunidade enfrentou muitos desafios...', 2, true),
(2, 'Tradição e Modernidade', 'A escola sempre buscou equilibrar os conhecimentos tradicionais...', 1, true);
*/ 