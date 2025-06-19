# 🔧 Solução Definitiva para Upload de Imagens

## 🚨 Diagnóstico do Problema

O erro `new row violates row-level security policy` está acontecendo porque:

1. **O bucket `historia-professor-imagens` não existe**
2. **Ou as políticas do bucket não estão configuradas**
3. **Ou você não está autenticado**

## ✅ Solução Passo a Passo

### **Passo 1: Criar o Bucket**

No painel do Supabase:

1. Vá em **Storage**
2. Clique em **"New bucket"**
3. Nome: `historia-professor-imagens`
4. Marque **"Public bucket"**
5. Clique em **"Create bucket"**

### **Passo 2: Configurar Políticas do Bucket**

No painel do Supabase > **Storage > historia-professor-imagens > Policies**, adicione:

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

### **Passo 3: Verificar Autenticação**

Certifique-se de que está logado no sistema antes de tentar o upload.

### **Passo 4: Testar Upload**

1. Recarregue a página
2. Tente fazer upload de uma imagem
3. Verifique o console para logs detalhados

## 🔍 Verificação Rápida

Execute este SQL no Supabase para verificar:

```sql
-- Verificar se o bucket existe
SELECT name, public FROM storage.buckets WHERE name = 'historia-professor-imagens';

-- Verificar políticas do bucket
SELECT policyname, cmd FROM pg_policies 
WHERE tablename = 'objects' 
AND qual LIKE '%historia-professor-imagens%';
```

## 🚀 Solução Alternativa (Se ainda não funcionar)

Se o problema persistir, podemos usar o bucket existente `imagens-professores`:

```javascript
// No arquivo escolaImageService.js, linha 15
const PROFESSOR_IMAGE_CONFIG = {
  BUCKET_NAME: 'imagens-professores', // Usar bucket existente
  // ... resto da configuração
};
```

## 📞 Próximos Passos

1. **Crie o bucket** `historia-professor-imagens`
2. **Configure as políticas**
3. **Teste o upload**
4. **Se funcionar**, está resolvido!
5. **Se não funcionar**, use o bucket `imagens-professores`

## 🎯 Resumo

O problema é que o bucket `historia-professor-imagens` não existe. Crie-o no Supabase e configure as políticas. O código já está correto e funcionará assim que o bucket estiver disponível. 