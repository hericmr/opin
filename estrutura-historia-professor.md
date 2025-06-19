# Estrutura de Armazenamento - História do Professor

## Visão Geral

Este documento descreve a estrutura implementada para organizar múltiplas "Histórias do Professor" com imagens associadas no Supabase, permitindo escalabilidade para múltiplas escolas.

## Buckets no Supabase

### Bucket Principal: `historia-professor-imagens`
- **Nome**: `historia-professor-imagens`
- **Organização interna**: Uma pasta por escola
- **Estrutura de pastas**:
```
historia-professor-imagens/
├── escola_1/
│   ├── historia_prof_1.jpg
│   ├── historia_prof_2.png
│   └── ...
├── escola_2/
│   ├── historia_prof_1.jpg
│   └── ...
└── ...
```

### Bucket Alternativo (se preferir manter separado)
- **Nome**: `imagens-professores` (já existente)
- **Organização**: `{escola_id}/historia_professor/{filename}`

## Tabela no Supabase

### Tabela: `historias_professor`

```sql
CREATE TABLE historias_professor (
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

-- Índices para performance
CREATE INDEX idx_historias_professor_escola_id ON historias_professor(escola_id);
CREATE INDEX idx_historias_professor_ordem ON historias_professor(ordem);
CREATE INDEX idx_historias_professor_ativo ON historias_professor(ativo);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_historias_professor_updated_at 
    BEFORE UPDATE ON historias_professor 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Estrutura da Tabela

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `id` | SERIAL | Sim | Chave primária, auto-incremento |
| `escola_id` | INTEGER | Sim | Referência à tabela `escolas_completa` |
| `titulo` | TEXT | Não | Título da história (opcional) |
| `historia` | TEXT | Sim | Texto da história do professor |
| `imagem_url` | TEXT | Não | Caminho da imagem no bucket |
| `descricao_imagem` | TEXT | Não | Descrição da imagem |
| `ordem` | INTEGER | Não | Ordem de exibição (padrão: 1) |
| `ativo` | BOOLEAN | Não | Se a história está ativa (padrão: true) |
| `created_at` | TIMESTAMP | Sim | Data de criação |
| `updated_at` | TIMESTAMP | Sim | Data de atualização |

## Componente React

### Estrutura do Componente

O componente `HistoriaDoProfessor` deve:

1. **Receber `escola_id`** como prop
2. **Buscar dados** da tabela `historias_professor` via Supabase
3. **Exibir múltiplas histórias** em ordem
4. **Mostrar imagens associadas** de cada história
5. **Permitir navegação** entre histórias

### Exemplo de Uso

```jsx
<HistoriaDoProfessor escola_id={escola.id} />
```

### Funcionalidades

- **Múltiplas histórias**: Uma escola pode ter várias histórias de professores
- **Imagens específicas**: Cada história pode ter sua própria imagem
- **Ordenação**: Histórias são exibidas em ordem definida
- **Ativação/Desativação**: Histórias podem ser ativadas ou desativadas
- **Responsividade**: Interface adaptável para diferentes dispositivos

## Migração da Estrutura Atual

### Dados Existentes

A tabela `escolas_completa` possui o campo `historia_do_prof` que será migrado:

```sql
-- Migração dos dados existentes
INSERT INTO historias_professor (escola_id, historia, created_at)
SELECT 
  id as escola_id,
  historia_do_prof as historia,
  NOW() as created_at
FROM escolas_completa 
WHERE historia_do_prof IS NOT NULL 
  AND historia_do_prof != '';
```

### Imagens Existentes

As imagens atualmente no bucket `imagens-professores` podem ser:
1. **Mantidas** no bucket atual
2. **Migradas** para o novo bucket `historia-professor-imagens`
3. **Referenciadas** na nova tabela

## Políticas de Segurança (RLS)

### Bucket `historia-professor-imagens`

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

### Tabela `historias_professor`

```sql
-- Política de leitura pública
CREATE POLICY "Permitir leitura pública de histórias do professor"
ON historias_professor FOR SELECT
USING (ativo = true);

-- Política de inserção para usuários autenticados
CREATE POLICY "Permitir inserção de histórias do professor"
ON historias_professor FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Política de atualização para usuários autenticados
CREATE POLICY "Permitir atualização de histórias do professor"
ON historias_professor FOR UPDATE
USING (auth.role() = 'authenticated');
```

## Vantagens da Nova Estrutura

1. **Escalabilidade**: Suporte a múltiplas histórias por escola
2. **Organização**: Separação clara entre texto e imagens
3. **Flexibilidade**: Histórias podem ser ativadas/desativadas
4. **Performance**: Índices otimizados para consultas
5. **Manutenibilidade**: Estrutura clara e documentada
6. **Extensibilidade**: Fácil adição de novos campos no futuro

## Próximos Passos

1. **Implementar** a nova tabela no Supabase
2. **Criar** o bucket `historia-professor-imagens`
3. **Migrar** dados existentes
4. **Atualizar** componentes React
5. **Testar** funcionalidades
6. **Documentar** uso para administradores 