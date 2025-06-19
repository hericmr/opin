# 🔧 Solução para Erro de Upload: "new row violates row-level security policy"

## 🚨 Problema
O erro `new row violates row-level security policy` ocorre porque a tabela `imagens_escola` não tem as políticas RLS (Row Level Security) configuradas corretamente para permitir inserções.

## ✅ Solução Rápida

### 1. Execute o Script SQL
No painel do Supabase, vá em **SQL Editor** e execute o conteúdo do arquivo:
```
scripts/fix_rls_imagens_escola.sql
```

### 2. Ou execute manualmente estas políticas:

```sql
-- Habilitar RLS na tabela imagens_escola
ALTER TABLE imagens_escola ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "Permitir leitura pública de imagens da escola" ON imagens_escola;
DROP POLICY IF EXISTS "Permitir inserção de imagens da escola" ON imagens_escola;
DROP POLICY IF EXISTS "Permitir atualização de imagens da escola" ON imagens_escola;
DROP POLICY IF EXISTS "Permitir exclusão de imagens da escola" ON imagens_escola;

-- Criar políticas de segurança
CREATE POLICY "Permitir leitura pública de imagens da escola"
ON imagens_escola FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de imagens da escola"
ON imagens_escola FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Permitir atualização de imagens da escola"
ON imagens_escola FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Permitir exclusão de imagens da escola"
ON imagens_escola FOR DELETE
USING (auth.role() = 'authenticated');
```

### 3. Verificar se o bucket existe
Certifique-se de que o bucket `historia-professor-imagens` foi criado no Supabase:
- Vá em **Storage**
- Clique em **"New bucket"**
- Nome: `historia-professor-imagens`
- Marque **"Public bucket"**
- Clique em **"Create bucket"**

### 4. Configurar políticas do bucket
No bucket `historia-professor-imagens`, adicione estas políticas:

```sql
-- Política de leitura pública
CREATE POLICY "Permitir leitura pública de imagens de história do professor"
ON storage.objects FOR SELECT
USING (bucket_id = 'historia-professor-imagens');

-- Política de upload para usuários autenticados
CREATE POLICY "Permitir upload de imagens de história do professor"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'historia-professor-imagens' AND auth.role() = 'authenticated');
```

## 🔍 Verificação

### 1. Verificar se as políticas foram criadas:
```sql
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'imagens_escola';
```

### 2. Verificar se o bucket existe:
```sql
SELECT name FROM storage.buckets WHERE name = 'historia-professor-imagens';
```

### 3. Verificar políticas do bucket:
```sql
SELECT 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND qual LIKE '%historia-professor-imagens%';
```

## 🧪 Teste

Após aplicar as correções:

1. **Faça login** no sistema (se necessário)
2. **Tente fazer upload** de uma imagem no painel de edição
3. **Verifique** se não há mais erros de RLS

## 📋 Resumo das Políticas

### Tabela `imagens_escola`:
- ✅ **SELECT**: Público (todos podem ler)
- ✅ **INSERT**: Apenas usuários autenticados
- ✅ **UPDATE**: Apenas usuários autenticados  
- ✅ **DELETE**: Apenas usuários autenticados

### Bucket `historia-professor-imagens`:
- ✅ **SELECT**: Público (todos podem ler)
- ✅ **INSERT**: Apenas usuários autenticados

## 🚀 Próximos Passos

1. Execute o script SQL
2. Crie o bucket se não existir
3. Configure as políticas do bucket
4. Teste o upload
5. Se ainda houver problemas, verifique se está autenticado

## 📞 Suporte

Se o problema persistir:
1. Verifique se está logado no sistema
2. Confirme que o bucket foi criado
3. Verifique se todas as políticas foram aplicadas
4. Consulte os logs do console do navegador 