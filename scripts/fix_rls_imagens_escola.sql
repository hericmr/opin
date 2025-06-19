-- Script para corrigir políticas RLS da tabela imagens_escola
-- Execute este script no SQL Editor do Supabase para resolver o erro de upload

-- 1. Verificar se a tabela imagens_escola existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'imagens_escola'
) as tabela_existe;

-- 2. Habilitar RLS na tabela imagens_escola (se não estiver habilitado)
ALTER TABLE imagens_escola ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir leitura pública de imagens da escola" ON imagens_escola;
DROP POLICY IF EXISTS "Permitir inserção de imagens da escola" ON imagens_escola;
DROP POLICY IF EXISTS "Permitir atualização de imagens da escola" ON imagens_escola;
DROP POLICY IF EXISTS "Permitir exclusão de imagens da escola" ON imagens_escola;

-- 4. Criar políticas de segurança para a tabela imagens_escola

-- Política de leitura pública
CREATE POLICY "Permitir leitura pública de imagens da escola"
ON imagens_escola FOR SELECT
USING (true);

-- Política de inserção para usuários autenticados
CREATE POLICY "Permitir inserção de imagens da escola"
ON imagens_escola FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Política de atualização para usuários autenticados
CREATE POLICY "Permitir atualização de imagens da escola"
ON imagens_escola FOR UPDATE
USING (auth.role() = 'authenticated');

-- Política de exclusão para usuários autenticados
CREATE POLICY "Permitir exclusão de imagens da escola"
ON imagens_escola FOR DELETE
USING (auth.role() = 'authenticated');

-- 5. Verificar se as políticas foram criadas
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'imagens_escola';

-- 6. Verificar estrutura da tabela imagens_escola
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'imagens_escola'
ORDER BY ordinal_position;

-- 7. Teste de inserção (opcional - descomente para testar)
/*
INSERT INTO imagens_escola (escola_id, url, descricao) 
VALUES (1, 'teste/teste.jpg', 'Imagem de teste')
RETURNING *;
*/ 