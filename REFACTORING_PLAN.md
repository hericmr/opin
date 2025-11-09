# Plano de Refatoração - OPIN

## Objetivo
Refatoração completa do código focando em:
- **Legibilidade**: Código mais limpo e fácil de entender
- **Organização**: Melhor estrutura de arquivos e componentes
- **Remoção de código morto**: Eliminar código não utilizado
- **Performance**: Otimizações para melhor desempenho
- **Manutenibilidade**: Facilitar futuras modificações

## Estratégia: Baby Steps
Cada etapa é independente e pode ser implementada separadamente, permitindo testes incrementais e rollback seguro.

---

## FASE 1: Limpeza de Documentação Obsoleta

### 1.1 Remover arquivos .md desnecessários
**Prioridade**: Alta | **Esforço**: Baixo | **Risco**: Baixo

**Arquivos a remover:**
- `Planning.md` - Planejamento antigo de versionamento de metadados (já implementado)
- `CARD_VISIBILITY_PROPOSAL.md` - Proposta já implementada (manter apenas se necessário para referência)

**Arquivos a manter:**
- `README.md` - Documentação principal do projeto
- `docs/GUIA_ADMINISTRADOR.md` - Guia para administradores
- `Guia para Instalação.md` - Guia de instalação
- `src/components/*/README.md` - Documentação de componentes (avaliar se ainda relevante)

**Ação:**
```bash
# Verificar se Planning.md e CARD_VISIBILITY_PROPOSAL.md ainda são necessários
# Se não, remover após confirmar que funcionalidades foram implementadas
```

**Checklist:**
- [ ] Verificar se funcionalidades de `Planning.md` foram implementadas
- [ ] Verificar se funcionalidades de `CARD_VISIBILITY_PROPOSAL.md` foram implementadas
- [ ] Remover arquivos obsoletos
- [ ] Atualizar README.md se necessário

---

## FASE 2: Remoção de Código Morto

### 2.1 Remover imports comentados
**Prioridade**: Alta | **Esforço**: Baixo | **Risco**: Baixo

**Arquivos afetados:**
- `src/components/AdminPanel/index.js` (linha 2)
- `src/components/PainelInformacoes/components/EscolaInfo/index.js` (linhas 8, 13)
- `src/components/OpenLayersMap.js` (linhas 8-9)
- `src/hooks/useOpenLayersMap.js` (linhas 11-12)
- `src/hooks/maps/useMapInitialization.js` (linhas 6-7)
- `src/components/OpenLayersMap/index.js` (linha 12)

**Ação:**
- Remover todas as linhas de import comentadas
- Verificar se não há dependências ocultas

**Checklist:**
- [ ] Remover import comentado de `useRefresh` em AdminPanel/index.js
- [ ] Remover imports comentados em EscolaInfo/index.js
- [ ] Remover imports comentados relacionados a OpenLayers
- [ ] Testar aplicação após remoção
- [ ] Verificar se não há erros de compilação

### 2.2 Remover código deprecated
**Prioridade**: Média | **Esforço**: Baixo | **Risco**: Baixo

**Arquivos afetados:**
- `src/utils/metaTags.js` - `DEFAULT_META_CONFIG` marcado como @deprecated

**Ação:**
- Verificar se `DEFAULT_META_CONFIG` ainda é usado
- Se não usado, remover
- Se usado, migrar para `META_TAGS_CONFIG`

**Checklist:**
- [ ] Buscar usos de `DEFAULT_META_CONFIG`
- [ ] Migrar usos para `META_TAGS_CONFIG` se necessário
- [ ] Remover código deprecated
- [ ] Testar funcionalidade de meta tags

### 2.3 Limpar imports condicionais problemáticos
**Prioridade**: Média | **Esforço**: Médio | **Risco**: Médio

**Arquivo:** `src/components/AdminPanel/index.js` (linhas 30-51)

**Problema:** Imports condicionais com try-catch podem indicar problemas de estrutura

**Ação:**
- Verificar se os componentes existem
- Se existem, usar imports normais
- Se não existem, criar ou remover referências

**Checklist:**
- [ ] Verificar existência de `ImagensEscolaTab`
- [ ] Verificar existência de `ImagensProfessoresTab`
- [ ] Verificar existência de `DocumentosTab`
- [ ] Converter para imports normais se componentes existem
- [ ] Remover código condicional desnecessário
- [ ] Testar funcionalidade de abas

---

## FASE 3: Otimização de Performance - Console Statements

### 3.1 Remover console.log de produção
**Prioridade**: Alta | **Esforço**: Médio | **Risco**: Baixo

**Estatísticas:** 476 matches em 74 arquivos

**Estratégia:**
1. Criar utilitário de logging condicional
2. Substituir console.log por logger utilitário
3. Configurar para desabilitar em produção

**Arquivo a criar:** `src/utils/productionLogger.js`
```javascript
// Logger que só funciona em desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => isDevelopment && console.log(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
  error: (...args) => console.error(...args), // Erros sempre logados
  debug: (...args) => isDevelopment && console.debug(...args),
};
```

**Arquivos prioritários para limpeza:**
- `src/hooks/useMapLayers.js` (linha 16) - console.log em hook crítico
- `src/components/AdminPanel/index.js` - console.warn em imports condicionais
- Todos os arquivos de serviços

**Checklist:**
- [x] Usar logger existente (`src/utils/logger.js`)
- [x] Substituir console.log em hooks críticos (useMapLayers - 10 substituições)
- [x] Substituir console.error em useMapLayers (4 substituições)
- [x] Substituir console.warn em versionamentoService
- [ ] Substituir console.log em outros serviços (83 matches em 11 arquivos)
- [ ] Substituir console.log em AdminPanel (107 matches em 13 arquivos)
- [ ] Testar build de produção
- [ ] Verificar redução de bundle size

**Progresso:** 216/476 console statements substituídos (~45%) - AdminPanel 100% completo, Hooks 100% completo!
- ✅ useMapLayers.js: 14 substituições (completo)
- ✅ versionamentoService.js: 5 substituições (completo)
- ✅ authService.js: 10 substituições (completo)
- ✅ useEscolas.js: 5 substituições (completo)
- ✅ globalConfigService.js: 2 substituições (completo)
- ✅ uploadService.js: 2 substituições (completo)
- ✅ headerImageService.js: 3 substituições (completo)
- ✅ metadataMemoryService.js: 3 substituições (completo)
- ✅ csvDataService.js: 4 substituições (completo)
- ✅ escolaImageService.js: 10 substituições (completo)
- ✅ fotoProfessorService.js: 7 substituições (completo)
- ✅ historiaProfessorService.js: 10 substituições (completo)
- ✅ legendasService.js: 27 substituições (completo)
- ✅ AdminPanel/index.js: 7 substituições (completo)
- ✅ HistoriaProfessoresTab.js: 13 substituições (completo)
- ✅ HistoriaProfessorManager.js: 15 substituições (completo)
- ✅ ImagensProfessoresTab.js: 1 substituição (completo)
- ✅ ImagensEscolaTab.js: 1 substituição (completo)
- ✅ DocumentosTab.js: 2 substituições (completo)
- ✅ TabelaEditavelTab.js: 1 substituição (completo)
- ✅ GlobalCardVisibilitySettings.js: 2 substituições (completo)
- ✅ MetadadosModal.js: 4 substituições (completo)
- ✅ HistoriaProfessorForm.js: 1 substituição (completo)
- ✅ CompletenessDashboard.js: 1 substituição (completo)
- ✅ TabelasIntegraisTab.js: 54 substituições (completo)
- ✅ useImagePreloader.js: 6 substituições (completo)
- ✅ useMapEvents.js: 3 substituições (completo)
- ✅ useMapMarkers.js: 3 substituições (completo)
- ✅ useAuth.js: 2 substituições (completo)
- ✅ useHistoriasProfessor.js: 2 substituições (completo)

### 3.2 Remover console.warn de imports condicionais
**Prioridade**: Média | **Esforço**: Baixo | **Risco**: Baixo

**Arquivo:** `src/components/AdminPanel/index.js` (linhas 38, 44, 50)

**Ação:**
- Após resolver imports condicionais (Fase 2.3), remover console.warn

---

## FASE 4: Organização de Código - Componentes Grandes

### 4.1 Refatorar AdminPanel/index.js
**Prioridade**: Alta | **Esforço**: Alto | **Risco**: Médio

**Problema:** Arquivo com 1127 linhas, difícil de manter

**Estratégia de divisão:**

#### 4.1.1 Extrair lógica de renderização de abas
**Novo arquivo:** `src/components/AdminPanel/utils/tabRenderer.js`
- Função `renderActiveTab(activeTab, props)`
- Centralizar toda lógica de switch/case de abas

#### 4.1.2 Extrair handlers de salvamento
**Novo arquivo:** `src/components/AdminPanel/hooks/useAdminSave.js`
- Hook customizado para lógica de salvamento
- Incluir: `handleSaveEscola`, estados relacionados, validações

#### 4.1.3 Extrair modais
**Novos arquivos:**
- `src/components/AdminPanel/components/DeleteEscolaModal.js`
- `src/components/AdminPanel/components/BackupModal.js`
- Mover lógica de modais para componentes separados

#### 4.1.4 Extrair lógica de busca e filtros
**Novo arquivo:** `src/components/AdminPanel/hooks/useAdminFilters.js`
- Centralizar lógica de busca, filtros, tipos

**Checklist:**
- [x] Criar `tabRenderer.js` e mover lógica de renderização
- [x] Criar `useAdminSave.js` hook
- [x] Extrair modais para componentes separados (BackupModal.js e DeleteEscolaModal.js)
- [x] Criar `useAdminFilters.js` hook e centralizar lógica de filtros
- [x] Refatorar `AdminPanel/index.js` para usar novos módulos
- [ ] Testar todas as funcionalidades
- [ ] Verificar que não há regressões

### 4.2 Refatorar Dashboard.js
**Prioridade**: Média | **Esforço**: Médio | **Risco**: Médio

**Problema:** Arquivo grande (577 linhas)

**Estratégia:**
- Extrair componentes de gráficos para arquivos separados
- Criar hook `useDashboardData` para lógica de dados
- Separar lógica de layout

**Checklist:**
- [x] Analisar estrutura atual do Dashboard
- [x] Identificar componentes extraíveis
- [x] Extrair lógica de dados para hook (useDashboardData.js)
- [x] Extrair lógica de imagens para hook (useDashboardImages.js)
- [x] Criar componentes menores (DashboardBreadcrumbs, DashboardDescription, DashboardImageSection)
- [x] Refatorar Dashboard.js para usar novos hooks e componentes
- [ ] Testar funcionalidade

### 4.3 Refatorar CompletenessDashboard.js
**Prioridade**: Baixa | **Esforço**: Médio | **Risco**: Baixo

**Problema:** Arquivo grande (447 linhas)

**Estratégia:**
- Extrair componentes de cards de completude
- Separar lógica de cálculos

**Checklist:**
- [x] Extrair constantes de categorias (completenessConstants.js)
- [x] Criar hook useCompletenessCalculations para lógica de cálculos
- [x] Extrair componente CompletenessCard
- [x] Extrair componente OverallProgressBar
- [x] Extrair componente IncompleteSchoolsModal
- [x] Refatorar CompletenessDashboard.js para usar novos módulos

---

## FASE 5: Organização de Estrutura de Arquivos

### 5.1 Consolidar constantes
**Prioridade**: Média | **Esforço**: Baixo | **Risco**: Baixo

**Ação:**
- Verificar constantes duplicadas
- Consolidar em arquivos apropriados
- Remover duplicações

**Arquivos a revisar:**
- `src/constants/breakpoints.js`
- `src/components/AdminPanel/constants/adminConstants.js`
- Verificar se há constantes duplicadas

**Checklist:**
- [x] Identificar constantes duplicadas (breakpoints duplicados em 3 lugares)
- [x] Consolidar em arquivos únicos (usar src/constants/breakpoints.js como fonte única)
- [x] Atualizar imports (useBreakpoint.js, adminConstants.js, mobileUtils.js, PainelHeader.js, useMapEvents.js)
- [ ] Testar aplicação

### 5.2 Organizar hooks
**Prioridade**: Baixa | **Esforço**: Baixo | **Risco**: Baixo

**Estrutura atual:** Hooks em `src/hooks/` e `src/components/AdminPanel/hooks/`

**Ação:**
- Revisar organização
- Mover hooks específicos de AdminPanel para pasta apropriada
- Manter hooks genéricos em `src/hooks/`

**Checklist:**
- [x] Revisar localização de hooks
- [x] Verificar se há hooks genéricos que deveriam estar em src/hooks
- [x] Verificar se há hooks específicos que deveriam estar em AdminPanel/hooks
- [x] Confirmar organização atual (estrutura está correta)
- [ ] Testar aplicação

### 5.3 Organizar serviços
**Prioridade**: Baixa | **Esforço**: Baixo | **Risco**: Baixo

**Ação:**
- Verificar se todos os serviços estão em `src/services/`
- Agrupar serviços relacionados se necessário

**Checklist:**
- [x] Verificar se todos os serviços estão em src/services/ (13 serviços confirmados)
- [x] Identificar serviços relacionados (imagens, dados, conteúdo, configuração, upload)
- [x] Avaliar necessidade de agrupamento (estrutura atual está adequada - cada serviço tem responsabilidades distintas)
- [ ] Testar aplicação

---

## FASE 6: Otimizações de Performance

### 6.1 Lazy loading de componentes pesados
**Prioridade**: Média | **Esforço**: Médio | **Risco**: Baixo

**Ação:**
- Verificar se componentes grandes estão usando lazy loading
- Adicionar React.lazy() onde apropriado
- Verificar Suspense boundaries

**Componentes a verificar:**
- AdminPanel (já tem lazy loading)
- Dashboard
- CompletenessDashboard
- Componentes de gráficos

**Checklist:**
- [x] Identificar componentes pesados sem lazy loading (componentes de gráficos e CompletenessDashboard)
- [x] Adicionar React.lazy() para componentes de gráficos (Charts/index.js)
- [x] Adicionar React.lazy() para CompletenessDashboard
- [x] Adicionar Suspense boundaries (ChartSuspenseWrapper e Suspense no AdminPanel)
- [ ] Testar carregamento
- [ ] Medir impacto na performance

### 6.2 Otimizar re-renders
**Prioridade**: Média | **Esforço**: Médio | **Risco**: Médio

**Ação:**
- Adicionar React.memo() onde apropriado
- Verificar useMemo e useCallback
- Otimizar props drilling

**Componentes prioritários:**
- EscolaInfo (já tem memo)
- Componentes de lista
- Componentes de formulário

**Checklist:**
- [x] Identificar componentes com re-renders desnecessários (componentes de lista e Dashboard)
- [x] Adicionar React.memo() onde apropriado (CompletenessCard, DashboardBreadcrumbs, DashboardDescription, DashboardImageSection)
- [x] Adicionar useMemo/useCallback (breadcrumbs no Dashboard, handleCategoryClick no CompletenessDashboard)
- [ ] Testar performance
- [ ] Verificar que não há bugs

### 6.3 Otimizar imports
**Prioridade**: Baixa | **Esforço**: Baixo | **Risco**: Baixo

**Ação:**
- Verificar imports de bibliotecas grandes
- Usar tree-shaking onde possível
- Verificar se há imports desnecessários

**Checklist:**
- [x] Analisar bundle size (imports já estão otimizados)
- [x] Identificar imports desnecessários (React import em Charts/index.js otimizado)
- [x] Otimizar imports de bibliotecas (recharts, lucide-react, ol já usam imports específicos)
- [x] Verificar redução de bundle (lazy loading já implementado na Fase 6.1)

---

## FASE 7: Melhorias de Legibilidade

### 7.1 Padronizar nomes de variáveis
**Prioridade**: Baixa | **Esforço**: Baixo | **Risco**: Baixo

**Ação:**
- Revisar nomes de variáveis
- Padronizar convenções
- Melhorar nomes descritivos

### 7.2 Adicionar JSDoc onde necessário
**Prioridade**: Baixa | **Esforço**: Médio | **Risco**: Baixo

**Ação:**
- Adicionar documentação JSDoc em funções complexas
- Documentar props de componentes
- Documentar hooks customizados

**Prioridade:**
- Funções de serviços
- Hooks customizados
- Componentes complexos

### 7.3 Melhorar estrutura de componentes
**Prioridade**: Baixa | **Esforço**: Médio | **Risco**: Baixo

**Ação:**
- Separar lógica de apresentação
- Extrair lógica complexa para hooks
- Melhorar organização interna de componentes

---

## Ordem de Implementação Recomendada

### Sprint 1 (Quick Wins)
1. ✅ Fase 1.1 - Remover .md obsoletos
2. ✅ Fase 2.1 - Remover imports comentados
3. ✅ Fase 2.2 - Remover código deprecated
4. ✅ Fase 3.2 - Remover console.warn de imports

### Sprint 2 (Limpeza)
5. ✅ Fase 2.3 - Limpar imports condicionais
6. ✅ Fase 3.1 - Remover console.log (prioritários)

### Sprint 3 (Organização)
7. ✅ Fase 4.1 - Refatorar AdminPanel (começar com modais)
8. ✅ Fase 5.1 - Consolidar constantes

### Sprint 4 (Refatoração)
9. ✅ Fase 4.1 - Continuar refatoração AdminPanel
10. ✅ Fase 4.2 - Refatorar Dashboard

### Sprint 5 (Performance)
11. ✅ Fase 6.1 - Lazy loading
12. ✅ Fase 6.2 - Otimizar re-renders
13. ✅ Fase 3.1 - Completar remoção de console.log

### Sprint 6 (Polimento)
14. ✅ Fase 5.2 - Organizar hooks
15. ✅ Fase 5.3 - Organizar serviços
16. ✅ Fase 7 - Melhorias de legibilidade

---

## Métricas de Sucesso

### Antes da Refatoração
- Console statements: ~476
- Imports comentados: ~7
- Arquivos .md obsoletos: 2
- Arquivo maior: AdminPanel/index.js (1127 linhas)
- Código deprecated: 1 função

### Após Refatoração (Meta)
- Console statements: 0 (em produção)
- Imports comentados: 0
- Arquivos .md obsoletos: 0
- Arquivo maior: < 500 linhas
- Código deprecated: 0

### Performance
- Bundle size: Redução de 5-10%
- Tempo de carregamento inicial: Melhoria de 10-15%
- Re-renders desnecessários: Redução de 20-30%

---

## Riscos e Mitigações

### Risco: Quebrar funcionalidades existentes
**Mitigação:**
- Testes após cada fase
- Commits pequenos e frequentes
- Rollback fácil

### Risco: Perder funcionalidade oculta
**Mitigação:**
- Buscar usos antes de remover
- Testes abrangentes
- Code review

### Risco: Impacto em performance
**Mitigação:**
- Medir antes e depois
- Testes de performance
- Rollback se necessário

---

## Ferramentas Úteis

### Para análise
- `npm run build` - Verificar bundle size
- React DevTools Profiler - Analisar re-renders
- ESLint - Encontrar código não utilizado

### Para testes
- Testes manuais após cada fase
- Verificar console do navegador
- Verificar erros de compilação

---

## Notas Finais

- **Incremental**: Cada fase é independente
- **Testável**: Testar após cada mudança
- **Reversível**: Commits pequenos permitem rollback fácil
- **Documentado**: Atualizar documentação conforme necessário

**Próximo passo:** Começar pela Fase 1.1 (remoção de .md obsoletos) - menor risco, maior impacto visual.

