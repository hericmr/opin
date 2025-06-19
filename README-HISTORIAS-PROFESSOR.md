# Histórias do Professor - Guia de Implementação

## Visão Geral

Este documento explica como implementar e usar a nova estrutura de "Histórias do Professor" que permite múltiplas histórias por escola, cada uma com sua própria imagem.

## Estrutura Implementada

### 1. Nova Tabela no Supabase: `historias_professor`

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
```

### 2. Novo Bucket: `historia-professor-imagens`

- **Nome**: `historia-professor-imagens`
- **Organização**: `{escola_id}/{filename}`
- **Políticas**: Leitura pública, upload para usuários autenticados

### 3. Componentes React

- `HistoriaDoProfessor.js` - Exibe múltiplas histórias com navegação
- `HistoriaProfessorManager.js` - Interface administrativa para gerenciar histórias
- `historiaProfessorService.js` - Serviço para operações no Supabase
- `useHistoriasProfessor.js` - Hook personalizado para gerenciar estado

## Passos de Implementação

### 1. Configurar o Supabase

Execute o script SQL em `scripts/migracao_historias_professor.sql`:

```bash
# No painel do Supabase > SQL Editor
# Execute o script completo
```

### 2. Criar o Bucket

No painel do Supabase > Storage:

1. Clique em "New bucket"
2. Nome: `historia-professor-imagens`
3. Marque "Public bucket" para leitura pública
4. Clique em "Create bucket"

### 3. Configurar Políticas de Segurança

#### Para o Bucket:

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

#### Para a Tabela:

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

-- Política de exclusão para usuários autenticados
CREATE POLICY "Permitir exclusão de histórias do professor"
ON historias_professor FOR DELETE
USING (auth.role() = 'authenticated');
```

### 4. Migrar Dados Existentes

O script SQL já inclui a migração automática dos dados existentes da tabela `escolas_completa` (campo `historia_do_prof`).

### 5. Atualizar Componentes

O componente `HistoriaDoProfessor` já foi atualizado para usar a nova estrutura. Ele automaticamente:

- Busca múltiplas histórias da nova tabela
- Exibe navegação entre histórias
- Mostra imagens específicas de cada história
- Permite zoom nas imagens

## Como Usar

### 1. Exibir Histórias no Frontend

```jsx
import HistoriaDoProfessor from './components/PainelInformacoes/components/EscolaInfo/HistoriaDoProfessor';

// No componente da escola
<HistoriaDoProfessor escola={escola} />
```

### 2. Gerenciar Histórias no Admin

```jsx
import HistoriaProfessorManager from './components/AdminPanel/HistoriaProfessorManager';

// No painel administrativo
<HistoriaProfessorManager escolaId={escola.id} escolaNome={escola.titulo} />
```

### 3. Usar o Hook Personalizado

```jsx
import { useHistoriasProfessor } from './hooks/useHistoriasProfessor';

const { historias, loading, error, criarHistoria, atualizarHistoria } = useHistoriasProfessor(escolaId);
```

## Funcionalidades

### Para Usuários Finais

- **Múltiplas histórias**: Uma escola pode ter várias histórias de professores
- **Navegação**: Botões para navegar entre histórias
- **Imagens específicas**: Cada história pode ter sua própria imagem
- **Zoom**: Clique nas imagens para ampliar
- **Responsividade**: Interface adaptável para diferentes dispositivos

### Para Administradores

- **CRUD completo**: Criar, editar, deletar histórias
- **Upload de imagens**: Adicionar imagens específicas para cada história
- **Ordenação**: Reordenar histórias com botões de seta
- **Ativação/Desativação**: Ativar ou desativar histórias
- **Validação**: Validação de arquivos e dados

## Estrutura de Dados

### Exemplo de História

```json
{
  "id": 1,
  "escola_id": 123,
  "titulo": "História do Professor João",
  "historia": "O professor João começou sua jornada na educação indígena há 15 anos...",
  "imagem_url": "123/historia_1_1640995200000_abc123.jpg",
  "descricao_imagem": "Professor João em sala de aula",
  "ordem": 1,
  "ativo": true,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

### Estrutura de Arquivos

```
historia-professor-imagens/
├── 123/
│   ├── historia_1_1640995200000_abc123.jpg
│   └── historia_2_1640995300000_def456.png
├── 124/
│   └── historia_1_1640995400000_ghi789.jpg
└── ...
```

## Validações

### Imagens

- **Tipos permitidos**: JPG, PNG, WEBP, GIF
- **Tamanho máximo**: 5MB
- **Dimensões mínimas**: 200x200px (recomendado)
- **Limite**: 1 imagem por história

### Texto

- **Título**: Opcional, máximo 255 caracteres
- **História**: Obrigatório, sem limite de caracteres
- **Descrição da imagem**: Opcional, máximo 500 caracteres

## Tratamento de Erros

O sistema inclui tratamento completo de erros:

- **Validação de arquivos**: Antes do upload
- **Feedback visual**: Durante operações
- **Mensagens específicas**: Para diferentes tipos de erro
- **Rollback**: Em caso de falha na inserção de metadados

## Performance

### Otimizações Implementadas

- **Índices**: Na tabela para consultas rápidas
- **Lazy loading**: Para imagens
- **Cache**: URLs públicas das imagens
- **Paginação**: Para múltiplas histórias (futuro)

### Monitoramento

- **Logs**: Todas as operações são logadas
- **Métricas**: Contagem de histórias por escola
- **Erros**: Captura e exibição de erros

## Migração de Dados

### Dados Existentes

Se você já tem dados na tabela `escolas_completa` (campo `historia_do_prof`), eles serão automaticamente migrados para a nova estrutura.

### Verificação

Após a migração, verifique:

```sql
-- Verificar dados migrados
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
```

## Próximos Passos

1. **Testar** a implementação com dados reais
2. **Migrar** dados existentes se necessário
3. **Configurar** políticas de segurança
4. **Treinar** administradores no uso
5. **Monitorar** performance e uso

## Suporte

Para dúvidas ou problemas:

1. Verifique os logs no console do navegador
2. Consulte a documentação do Supabase
3. Verifique as políticas de segurança
4. Teste com dados de exemplo

## Exemplo de Uso Completo

```jsx
import React from 'react';
import { useHistoriasProfessor } from './hooks/useHistoriasProfessor';
import HistoriaDoProfessor from './components/HistoriaDoProfessor';

const EscolaPage = ({ escola }) => {
  const { 
    historias, 
    loading, 
    error, 
    temHistorias 
  } = useHistoriasProfessor(escola.id);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!temHistorias) return null;

  return (
    <div>
      <h1>{escola.titulo}</h1>
      <HistoriaDoProfessor escola={escola} />
    </div>
  );
};
``` 