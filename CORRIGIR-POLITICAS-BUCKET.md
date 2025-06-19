# 🔧 Corrigir Políticas do Bucket `imagens-professores`

## 🎯 Problema Identificado

O teste confirmou que o problema é com as **políticas RLS do bucket**:
```
❌ "new row violates row-level security policy"
```

## 🔧 Solução: Configurar Políticas do Bucket

### 1. Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Selecione seu projeto
- Vá para **Storage** → **Policies**

### 2. Encontre o Bucket `imagens-professores`
- Clique no bucket `imagens-professores`
- Vá para a aba **Policies**

### 3. Configure as Políticas

#### Política 1: Permitir Upload (INSERT)
```sql
-- Nome: "Allow authenticated users to upload"
-- Operação: INSERT
-- Condição: auth.role() = 'authenticated'
```

#### Política 2: Permitir Download (SELECT)
```sql
-- Nome: "Allow public read access"
-- Operação: SELECT
-- Condição: true
```

#### Política 3: Permitir Deletar (DELETE)
```sql
-- Nome: "Allow authenticated users to delete"
-- Operação: DELETE
-- Condição: auth.role() = 'authenticated'
```

### 4. Ou Use SQL Direto

Execute no SQL Editor do Supabase:

```sql
-- Habilitar RLS no bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Política para upload (INSERT)
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para download (SELECT)
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (true);

-- Política para deletar (DELETE)
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

## 🧪 Teste Após Correção

1. **Configure as políticas** no Supabase
2. **Recarregue a página** do React
3. **Tente fazer upload** novamente
4. **Deve funcionar** agora!

## 🔍 Verificação

Se ainda não funcionar, verifique:
- ✅ **Usuário está logado** no sistema
- ✅ **Políticas foram aplicadas** corretamente
- ✅ **Bucket existe** e está ativo

**Configure as políticas e teste novamente!** 🚀 