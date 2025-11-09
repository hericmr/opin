# Planejamento: Sistema de Versionamento de Metadados

## Objetivo

Implementar um sistema de versionamento de metadados para registrar informações sobre todas as inserções e atualizações de dados realizadas no painel administrativo. Este sistema permitirá rastreabilidade completa das alterações, identificando a origem dos dados, o autor das modificações e observações relevantes sobre cada operação.

## Justificativa

O sistema de versionamento de metadados é essencial para:

1. **Rastreabilidade**: Saber quem, quando e por quê cada dado foi inserido ou modificado
2. **Auditoria**: Manter um histórico completo de todas as alterações no banco de dados
3. **Qualidade dos dados**: Identificar a fonte dos dados permite validar e melhorar a qualidade das informações
4. **Compliance**: Atender requisitos de documentação e transparência em projetos de dados públicos
5. **Manutenção**: Facilitar a identificação de problemas e a correção de dados incorretos

## Estrutura do Banco de Dados

### Tabela: `fontes_dados`

Armazena as diferentes fontes de dados que podem ser utilizadas no sistema.

**Campos:**
- `id` (uuid, primary key): Identificador único da fonte
- `nome` (text, required): Nome da fonte (ex: "Censo Escolar", "SEDUC", "Entrevista", "Levantamento de campo")
- `descricao` (text, optional): Descrição detalhada da fonte

**Exemplos de fontes:**
- Censo Escolar 2023
- SEDUC dados.educacao.sp.gov.br
- Entrevista com estudante da LINDI
- Documento Oficial
- Levantamento de Campo

### Tabela: `versoes_dados`

Registra cada versão de dados inserida ou atualizada.

**Campos:**
- `id` (uuid, primary key): Identificador único da versão
- `nome_tabela` (text, required): Nome da tabela onde ocorreu a alteração (ex: "escolas_completa")
- `chave_linha` (text, required): Chave primária da linha afetada (convertida para texto)
- `fonte_id` (uuid, nullable, FK -> fontes_dados.id): Referência à fonte dos dados
- `autor` (text, nullable): Identidade do administrador que realizou a operação
- `observacoes` (text, nullable): Observações adicionais sobre a alteração
- `criado_em` (timestamp, default now()): Data e hora da criação do registro

**Observações:**
- Quando metadados não são fornecidos, apenas `nome_tabela`, `chave_linha`, `autor` (se disponível) e `criado_em` são registrados
- Quando metadados são fornecidos, `fonte_id` e/ou `observacoes` são incluídos

## Etapas de Migração do Banco de Dados

### Etapa 1: Criar tabela `fontes_dados`

1. Criar tabela com os campos especificados
2. Adicionar índices para otimização de consultas
3. Configurar Row Level Security (RLS) se necessário
4. Inserir fontes padrão (opcional)

### Etapa 2: Criar tabela `versoes_dados`

1. Criar tabela com os campos especificados
2. Criar foreign key para `fontes_dados`
3. Adicionar índices para consultas frequentes:
   - Índice em `nome_tabela` e `chave_linha` para buscar versões de uma linha específica
   - Índice em `criado_em` para ordenação temporal
   - Índice em `autor` para auditoria
4. Configurar Row Level Security (RLS) se necessário

### Etapa 3: Criar função de versionamento (opcional)

Criar uma função PostgreSQL que facilite a inserção de versões:

```sql
CREATE OR REPLACE FUNCTION registrar_versao_dados(
  p_nome_tabela TEXT,
  p_chave_linha TEXT,
  p_fonte_id UUID DEFAULT NULL,
  p_autor TEXT DEFAULT NULL,
  p_observacoes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_versao_id UUID;
BEGIN
  INSERT INTO versoes_dados (
    nome_tabela,
    chave_linha,
    fonte_id,
    autor,
    observacoes
  ) VALUES (
    p_nome_tabela,
    p_chave_linha,
    p_fonte_id,
    p_autor,
    p_observacoes
  ) RETURNING id INTO v_versao_id;
  
  RETURN v_versao_id;
END;
$$ LANGUAGE plpgsql;
```

## Modificações no Backend

### Serviço de Versionamento

Criar um novo serviço em `src/services/versionamentoService.js` que:

1. **Função `registrarVersaoDados`**:
   - Recebe: nome da tabela, chave da linha, metadados opcionais (fonte_id, autor, observacoes)
   - Insere registro em `versoes_dados`
   - Retorna sucesso/erro

2. **Função `obterAutorAtual`**:
   - Obtém o usuário autenticado do sistema de autenticação
   - Retorna o nome do usuário ou null se não autenticado

### Modificações em `useEscolas.js`

Modificar a função `saveEscola` para:

1. Após inserção bem-sucedida:
   - Chamar `registrarVersaoDados` com:
     - `nome_tabela`: "escolas_completa"
     - `chave_linha`: ID da escola criada (convertido para string)
     - `fonte_id`: do formulário de metadados (se fornecido)
     - `autor`: do sistema de autenticação (se disponível)
     - `observacoes`: do formulário de metadados (se fornecido)

2. Após atualização bem-sucedida:
   - Mesma lógica, mas usando o ID existente

3. **Importante**: O registro de versão deve ocorrer mesmo se metadados não forem fornecidos (com valores mínimos)

### Outras Tabelas

O sistema deve ser extensível para outras tabelas no futuro:
- `historias_professor`
- `documentos_escola`
- `escola_images`
- `professor_images`

## Modificações no Frontend (Painel Admin)

### Componente de Formulário de Metadados

Criar `src/components/AdminPanel/components/MetadadosForm.js`:

**Campos:**
1. **Fonte dos dados** (dropdown):
   - Carrega opções de `fontes_dados`
   - Campo opcional
   - Placeholder: "Selecione a fonte dos dados (opcional)"

2. **Observações** (textarea):
   - Campo opcional
   - Placeholder: "Adicione observações sobre esta alteração (opcional)"
   - Máximo de caracteres: 1000 (com contador)

3. **Autor** (text, readonly):
   - Preenchido automaticamente com o usuário autenticado
   - Exibido como "Você está logado como: [nome]"
   - Se não autenticado, exibir "Não identificado"

**Comportamento:**
- Formulário sempre visível após criar/editar dados
- Campos opcionais (não bloqueiam salvamento)
- Texto de ajuda sutil incentivando preenchimento
- Destaque visual discreto quando campos estão vazios

### Integração no Fluxo de Criação/Edição

**Localização**: `src/components/AdminPanel/index.js`

1. **Estado para metadados**:
   - Adicionar `metadados` ao estado do componente
   - Inicializar como `{ fonte_id: null, observacoes: '', autor: null }`

2. **Após salvar com sucesso**:
   - Exibir formulário de metadados
   - Aguardar preenchimento (opcional)
   - Registrar versão com os dados fornecidos

3. **Fluxo sugerido**:
   ```
   Usuário salva dados → Sucesso → Exibir formulário de metadados → 
   Usuário preenche (ou não) → Registrar versão → Fechar formulário
   ```

**Alternativa (mais simples)**:
- Formulário de metadados sempre visível na parte inferior do formulário de edição
- Campos pré-preenchidos quando disponível (ex: autor)
- Salvar metadados junto com os dados principais

### Componente Visual

**Design:**
- Card discreto com borda sutil
- Título: "Metadados (Opcional)"
- Ícone de informação ao lado do título
- Texto de ajuda: "Preencher os metadados ajuda a manter um histórico completo das alterações"
- Campos com labels claros
- Botão "Salvar Metadados" (opcional, pode ser automático)

## Checklist de Desenvolvimento

### Fase 1: Preparação
- [ ] Criar branch `feature/versionamento-metadados`
- [ ] Revisar estrutura atual do banco de dados
- [ ] Documentar tabelas existentes que serão versionadas

### Fase 2: Banco de Dados
- [ ] Criar migração SQL para `fontes_dados`
- [ ] Criar migração SQL para `versoes_dados`
- [ ] Testar migrações em ambiente de desenvolvimento
- [ ] Inserir fontes padrão (opcional)
- [ ] Configurar RLS se necessário
- [ ] Criar função PostgreSQL `registrar_versao_dados` (opcional)

### Fase 3: Backend
- [ ] Criar serviço `versionamentoService.js`
- [ ] Implementar `registrarVersaoDados`
- [ ] Implementar `obterAutorAtual`
- [ ] Modificar `saveEscola` em `useEscolas.js` para chamar versionamento
- [ ] Testar inserção de versão após criar escola
- [ ] Testar inserção de versão após atualizar escola
- [ ] Testar com metadados vazios
- [ ] Testar com metadados preenchidos

### Fase 4: Frontend - Componente de Metadados
- [ ] Criar componente `MetadadosForm.js`
- [ ] Implementar dropdown de fontes (carregar de `fontes_dados`)
- [ ] Implementar textarea de observações
- [ ] Implementar exibição de autor
- [ ] Adicionar estilos e feedback visual
- [ ] Adicionar texto de ajuda
- [ ] Testar componente isoladamente

### Fase 5: Frontend - Integração
- [ ] Adicionar estado de metadados em `AdminPanel`
- [ ] Integrar `MetadadosForm` no fluxo de criação
- [ ] Integrar `MetadadosForm` no fluxo de edição
- [ ] Conectar formulário ao serviço de versionamento
- [ ] Testar fluxo completo de criação com metadados
- [ ] Testar fluxo completo de edição com metadados
- [ ] Testar fluxo sem preencher metadados

### Fase 6: Testes e Validação
- [ ] Testar em ambiente de desenvolvimento
- [ ] Verificar registros em `versoes_dados` após operações
- [ ] Validar foreign keys
- [ ] Testar performance (não deve impactar significativamente)
- [ ] Validar UI/UX (formulário não deve ser intrusivo)
- [ ] Testar com diferentes usuários (se aplicável)

### Fase 7: Documentação
- [ ] Atualizar `GUIA_ADMINISTRADOR.md` com informações sobre metadados
- [ ] Documentar API de versionamento (se aplicável)
- [ ] Criar exemplos de uso

### Fase 8: Deploy
- [ ] Revisar todas as mudanças
- [ ] Executar migrações em produção (com backup)
- [ ] Monitorar logs após deploy
- [ ] Verificar funcionamento em produção

## Plano de Rollback

### Se algo der errado durante a implementação:

1. **Rollback de Banco de Dados**:
   ```sql
   -- Remover tabelas (apenas se necessário)
   DROP TABLE IF EXISTS versoes_dados CASCADE;
   DROP TABLE IF EXISTS fontes_dados CASCADE;
   DROP FUNCTION IF EXISTS registrar_versao_dados CASCADE;
   ```

2. **Rollback de Código**:
   - Reverter commits relacionados ao versionamento
   - Remover chamadas a `registrarVersaoDados`
   - Remover componente `MetadadosForm`

3. **Rollback Completo**:
   - Fazer checkout para branch `main`
   - Deletar branch `feature/versionamento-metadados` se necessário

### Estratégia de Deploy Seguro:

1. Deploy incremental:
   - Primeiro: Apenas tabelas (sem uso)
   - Segundo: Backend (registra versões silenciosamente)
   - Terceiro: Frontend (exibe formulário)

2. Feature flag (opcional):
   - Adicionar flag para habilitar/desabilitar versionamento
   - Permitir rollback sem deploy

## Considerações Técnicas

### Performance

- Inserções em `versoes_dados` devem ser rápidas (índices adequados)
- Não bloquear operações principais (usar async/await)
- Considerar inserção em lote se houver muitas operações simultâneas

### Segurança

- RLS nas tabelas de versionamento (apenas admins podem inserir)
- Validar dados antes de inserir
- Sanitizar inputs (especialmente `observacoes`)

### Escalabilidade

- Considerar arquivamento de versões antigas (se necessário no futuro)
- Índices adequados para consultas frequentes
- Considerar particionamento por data (se volume crescer muito)

## Próximos Passos

1. Revisar este planejamento
2. Aprovar estrutura de banco de dados
3. Iniciar implementação seguindo as fases acima
4. Testar incrementalmente
5. Solicitar revisão antes de merge em `main`

