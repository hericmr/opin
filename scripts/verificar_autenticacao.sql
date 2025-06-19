-- Script para verificar autenticação e políticas RLS
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se RLS está habilitado na tabela imagens_escola
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'imagens_escola';

-- 2. Verificar políticas existentes
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'imagens_escola';

-- 3. Verificar se o bucket existe
SELECT name, public FROM storage.buckets WHERE name = 'historia-professor-imagens';

-- 4. Verificar políticas do bucket
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND qual LIKE '%historia-professor-imagens%';

-- 5. Teste de inserção (descomente para testar)
/*
-- Primeiro, vamos tentar inserir um registro de teste
INSERT INTO imagens_escola (escola_id, url, descricao) 
VALUES (1, 'teste/teste.jpg', 'Imagem de teste')
RETURNING *;

-- Se funcionar, deletar o registro de teste
DELETE FROM imagens_escola WHERE url = 'teste/teste.jpg';
*/

-- 6. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'imagens_escola'
ORDER BY ordinal_position; 