# Migration: Adicionar Coluna de Desenhos

## Descrição

Esta migração adiciona a coluna `imagens_desenhos` à tabela `escolas_completa` para permitir que administradores selecionem múltiplas imagens para a seção "Desenhos" no painel de informações.

## Como Executar

1. Acesse o **Supabase Dashboard**
2. Vá para **SQL Editor**
3. Execute o seguinte comando SQL:

```sql
-- Adicionar coluna imagens_desenhos
ALTER TABLE escolas_completa 
ADD COLUMN IF NOT EXISTS imagens_desenhos TEXT;

-- Adicionar comentário explicativo
COMMENT ON COLUMN escolas_completa.imagens_desenhos IS 
'JSON array of image URLs selected for the Drawings section. Stored as JSON string. Example: ["url1", "url2", "url3"]';

-- Definir valor padrão
ALTER TABLE escolas_completa 
ALTER COLUMN imagens_desenhos SET DEFAULT NULL;
```

## Estrutura da Coluna

- **Nome**: `imagens_desenhos`
- **Tipo**: `TEXT`
- **Formato**: JSON string contendo array de URLs
- **Exemplo**: `["https://example.com/image1.jpg", "https://example.com/image2.jpg"]`
- **Valor padrão**: `NULL`

## Funcionalidade

Após executar esta migração:

1. Administradores poderão selecionar múltiplas imagens da escola para a seção "Desenhos"
2. As imagens selecionadas aparecerão no painel de informações após a seção de vídeos
3. As imagens serão exibidas em formato grande (16:9), similar ao player de vídeo do YouTube
4. Administradores podem adicionar ou remover imagens a qualquer momento

## Verificação

Para verificar se a migração foi executada com sucesso:

```sql
-- Verificar se a coluna existe
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'escolas_completa' 
AND column_name = 'imagens_desenhos';

-- Verificar dados existentes (deve retornar NULL para escolas sem desenhos)
SELECT id, Escola, imagens_desenhos 
FROM escolas_completa 
LIMIT 5;
```

## Reversão (Rollback)

Se necessário reverter a migração:

```sql
-- Remover a coluna (CUIDADO: Isso apagará todos os dados de desenhos!)
ALTER TABLE escolas_completa 
DROP COLUMN IF EXISTS imagens_desenhos;
```

## Notas Importantes

- A coluna armazena um JSON string, não um tipo JSON nativo do PostgreSQL
- O código JavaScript faz o parse do JSON automaticamente
- Escolas sem desenhos terão `NULL` nesta coluna
- A seção "Desenhos" só aparece quando há pelo menos uma imagem selecionada

