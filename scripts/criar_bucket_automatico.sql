-- Script para criar o bucket historia-professor-imagens automaticamente
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se o bucket já existe
SELECT 
  name,
  public,
  created_at
FROM storage.buckets 
WHERE name = 'historia-professor-imagens';

-- 2. Se não existir, criar o bucket (execute manualmente se necessário)
-- Nota: Buckets devem ser criados manualmente no painel do Supabase
-- Vá em Storage > New bucket > Nome: historia-professor-imagens > Public bucket

-- 3. Verificar políticas do bucket (se existir)
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

-- 4. Criar políticas para o bucket (execute se o bucket existir)
-- Política de leitura pública
CREATE POLICY IF NOT EXISTS "Permitir leitura pública de imagens de história do professor"
ON storage.objects FOR SELECT
USING (bucket_id = 'historia-professor-imagens');

-- Política de upload para usuários autenticados
CREATE POLICY IF NOT EXISTS "Permitir upload de imagens de história do professor"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'historia-professor-imagens' AND auth.role() = 'authenticated');

-- Política de atualização para usuários autenticados
CREATE POLICY IF NOT EXISTS "Permitir atualização de imagens de história do professor"
ON storage.objects FOR UPDATE
USING (bucket_id = 'historia-professor-imagens' AND auth.role() = 'authenticated');

-- Política de exclusão para usuários autenticados
CREATE POLICY IF NOT EXISTS "Permitir exclusão de imagens de história do professor"
ON storage.objects FOR DELETE
USING (bucket_id = 'historia-professor-imagens' AND auth.role() = 'authenticated');

-- 5. Verificar se as políticas foram criadas
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND qual LIKE '%historia-professor-imagens%'
ORDER BY policyname; 