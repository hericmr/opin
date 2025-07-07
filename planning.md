# Planning: Correção de Variáveis Não Utilizadas e Warnings ESLint

## 📋 Objetivo
Remover todos os warnings de ESLint relacionados a variáveis não utilizadas e dependências desnecessárias nos useEffect hooks.

## 🎯 Prioridade: ALTA
- Melhorar a qualidade do código
- Eliminar warnings do build
- Otimizar performance removendo código morto

---

## 📁 Arquivos para Correção

### 1. **src/App.js** - 7 warnings
**Problemas:**
- `useEffect` importado mas não usado
- `supabase` importado mas não usado
- `PainelInformacoes` importado mas não usado
- `Papa` importado mas não usado
- `useShare` importado mas não usado
- `MapaSkeleton` importado mas não usado
- `getLocationById` definido mas não usado

**Ações:**
- [ ] Remover imports não utilizados
- [ ] Remover função `getLocationById` se não for necessária
- [ ] Verificar se algum desses imports será usado no futuro

### 2. **src/components/OpenLayersMap.js** - 15 warnings
**Problemas:**
- Imports não utilizados: `Style`, `Fill`, `Stroke`, `Text`, `Icon`
- Imports não utilizados: `handleMarkerClick`, `handleGeoJSONClick`
- Variáveis não utilizadas: `PROXIMITY_THRESHOLD`, `createMarkerSVG`, `mapInfo`, `usedIndices`
- Dependências desnecessárias em useEffect: `createClusterStyle` (4 ocorrências)
- Variáveis não utilizadas: `geometry` (2 ocorrências)

**Ações:**
- [ ] Remover imports não utilizados do OpenLayers
- [ ] Remover imports de handlers não utilizados
- [ ] Remover variáveis não utilizadas ou adicionar `// eslint-disable-next-line`
- [ ] Corrigir dependências dos useEffect removendo `createClusterStyle`
- [ ] Remover variáveis `geometry` não utilizadas

### 3. **src/components/AdminPanel.js** - 4 warnings
**Problemas:**
- Imports não utilizados: `VideoSection`, `DocumentViewer`
- Chave duplicada: `'Linguas faladas'`
- Função não utilizada: `getVideoEmbedUrl`

**Ações:**
- [ ] Remover imports não utilizados
- [ ] Corrigir chave duplicada no objeto
- [ ] Remover função `getVideoEmbedUrl` ou adicionar `// eslint-disable-next-line`

### 4. **src/components/AdminPanel/HistoriaProfessorManager.js** - 6 warnings
**Problemas:**
- Imports não utilizados: `Upload`, `Eye`
- Variáveis não utilizadas: `uploadingImage`, `handleImageUpload`, `handleImageDelete`
- Dependência faltando em useEffect: `carregarHistorias`

**Ações:**
- [ ] Remover imports não utilizados
- [ ] Remover variáveis não utilizadas ou implementar funcionalidade
- [ ] Adicionar `carregarHistorias` ao array de dependências do useEffect

### 5. **src/components/AdminPanel/VideoManager.js** - 1 warning
**Problemas:**
- Dependência faltando em useEffect: `carregarVideos`

**Ações:**
- [ ] Adicionar `carregarVideos` ao array de dependências do useEffect

### 6. **src/components/BibliotecaEducacionalIndigena.js** - 4 warnings
**Problemas:**
- Import não utilizado: `BookOpen`
- Variáveis não utilizadas: `filtroAtivo`, `setFiltroAtivo`
- Caractere de escape desnecessário: `\-`

**Ações:**
- [ ] Remover import não utilizado
- [ ] Remover variáveis não utilizadas ou implementar filtro
- [ ] Corrigir caractere de escape desnecessário

### 7. **src/components/EditEscolaPanel/ImageUploadSection.js** - 6 warnings
**Problemas:**
- Import não utilizado: `Edit3`
- Variáveis não utilizadas: `editingImage`, `setEditingImage`, `editingDescription`, `setEditingDescription`
- Função não utilizada: `handleDescriptionChange`

**Ações:**
- [ ] Remover import não utilizado
- [ ] Remover variáveis não utilizadas ou implementar edição inline
- [ ] Remover função não utilizada

### 8. **src/components/EditEscolaPanel/ProfessorImageUploadSection.js** - 8 warnings
**Problemas:**
- Import não utilizado: `Edit3`
- Variáveis não utilizadas: `editingImage`, `setEditingImage`, `editingDescription`, `setEditingDescription`, `setGenero`, `setTitulo`
- Função não utilizada: `handleDescriptionChange`

**Ações:**
- [ ] Remover import não utilizado
- [ ] Remover variáveis não utilizadas ou implementar funcionalidade
- [ ] Remover função não utilizada

### 9. **src/components/EditEscolaPanel/VideoSection.js** - 6 warnings
**Problemas:**
- Imports não utilizados: `Edit3`, `Clock`, `Tag`, `Play`
- Função não utilizada: `getTituloByVideoUrl`
- Variável não utilizada: `loading`

**Ações:**
- [ ] Remover imports não utilizados
- [ ] Remover função não utilizada
- [ ] Remover variável não utilizada

### 10. **src/components/MapSelector.js** - 1 warning
**Problemas:**
- Dependência faltando em useEffect: `showMarcadores`

**Ações:**
- [ ] Adicionar `showMarcadores` ao array de dependências do useEffect

### 11. **src/components/MapaEscolasIndigenas.js** - 1 warning
**Problemas:**
- Variável não utilizada: `totalEscolas`

**Ações:**
- [ ] Remover variável não utilizada ou usar em algum lugar

### 12. **src/components/Marcadores.js** - 1 warning
**Problemas:**
- Variável não utilizada: `usedIndices`

**Ações:**
- [ ] Remover variável não utilizada

### 13. **src/components/Navbar/MobileMenu.js** - 9 warnings
**Problemas:**
- Imports não utilizados: `MapPin`, `BookOpen`, `Search`, `Home`, `Users`, `Map`
- Import não utilizado: `LazyImage`
- Variável não utilizada: `navigate`

**Ações:**
- [ ] Remover imports não utilizados
- [ ] Remover variável não utilizada

### 14. **src/components/Navbar/NavButtons.js** - 4 warnings
**Problemas:**
- Imports não utilizados: `MapPin`, `BookOpen`, `Home`
- Variável não utilizada: `isActive`

**Ações:**
- [ ] Remover imports não utilizados
- [ ] Remover variável não utilizada

### 15. **src/components/Navbar/SearchBar.js** - 4 warnings
**Problemas:**
- Variáveis não utilizadas: `searchTerm`, `suggestions`
- Funções não utilizadas: `handleSuggestionClick`, `getCategoryColor`

**Ações:**
- [ ] Remover variáveis não utilizadas ou implementar funcionalidade
- [ ] Remover funções não utilizadas

### 16. **src/components/Navbar/index.js** - 2 warnings
**Problemas:**
- Imports não utilizados: `NavLogo`, `DesktopNav`

**Ações:**
- [ ] Remover imports não utilizados

### 17. **src/components/PainelInformacoes/components/DocumentViewer.js** - 2 warnings
**Problemas:**
- Atributo `aria-pressed` não suportado pelo role `tab`

**Ações:**
- [ ] Remover atributo `aria-pressed` ou alterar role

### 18. **src/components/PainelInformacoes/components/EscolaInfo/BasicInfo.js** - 1 warning
**Problemas:**
- Import não utilizado: `Users`

**Ações:**
- [ ] Remover import não utilizado

### 19. **src/components/PainelInformacoes/components/EscolaInfo/GestaoProfessores.js** - 1 warning
**Problemas:**
- Função não utilizada: `formatarNomeProfessor`

**Ações:**
- [ ] Remover função não utilizada

### 20. **src/components/PainelInformacoes/components/EscolaInfo/Modalidades.js** - 2 warnings
**Problemas:**
- Import não utilizado: `useState`
- Variável não utilizada: `modalidadeEnsinoCard`

**Ações:**
- [ ] Remover import não utilizado
- [ ] Remover variável não utilizada

### 21. **src/components/PainelInformacoes/components/EscolaInfo/index.js** - 1 warning
**Problemas:**
- Import não utilizado: `ImagemHistoriadoProfessor`

**Ações:**
- [ ] Remover import não utilizado

### 22. **src/components/PainelInformacoes/components/ImagensdasEscolas.js** - 1 warning
**Problemas:**
- Dependência faltando em useEffect: `limparCacheERecarregar`

**Ações:**
- [ ] Adicionar `limparCacheERecarregar` ao array de dependências

### 23. **src/components/PainelInformacoes/components/VideoPlayer.js** - 1 warning
**Problemas:**
- Variável não utilizada: `loading`

**Ações:**
- [ ] Remover variável não utilizada

### 24. **src/components/PainelInformacoes/index.js** - 1 warning
**Problemas:**
- Import não utilizado: `useAudio`

**Ações:**
- [ ] Remover import não utilizado

### 25. **src/components/TerrasIndigenas.js** - 3 warnings
**Problemas:**
- Import não utilizado: `L`
- Variável não utilizada: `layer`
- Dependência faltando em useCallback: `hoverStyle`

**Ações:**
- [ ] Remover import não utilizado
- [ ] Remover variável não utilizada
- [ ] Adicionar `hoverStyle` ao array de dependências do useCallback

### 26. **src/components/hooks/useClickOutside.js** - 2 warnings
**Problemas:**
- Mistura inesperada de `&&` e `||` (2 ocorrências)

**Ações:**
- [ ] Adicionar parênteses para esclarecer a ordem das operações

### 27. **src/components/hooks/useDocumentosEscola.js** - 2 warnings
**Problemas:**
- Variável não utilizada: `rlsData`
- Dependências faltando em useEffect: `documentos.length`, `error`, `isLoading`

**Ações:**
- [ ] Remover variável não utilizada
- [ ] Adicionar dependências faltantes ao array do useEffect

### 28. **src/components/hooks/usePainelDimensions.js** - 1 warning
**Problemas:**
- Dependência faltando em useMemo: `breakpoints`

**Ações:**
- [ ] Adicionar `breakpoints` ao array de dependências do useMemo

### 29. **src/components/hooks/usePainelVisibility.js** - 1 warning
**Problemas:**
- Dependências faltando em useEffect: `isMobile`, `isVisible`

**Ações:**
- [ ] Adicionar dependências faltantes ao array do useEffect

### 30. **src/services/historiaProfessorService.js** - 1 warning
**Problemas:**
- Variável não utilizada: `publicUrl`

**Ações:**
- [ ] Remover variável não utilizada

---

## 🚀 Estratégia de Implementação

### Fase 1: Limpeza Rápida (1-2 horas)
- [ ] Remover todos os imports não utilizados
- [ ] Remover variáveis não utilizadas simples
- [ ] Remover funções não utilizadas

### Fase 2: Correção de Dependências (1 hora)
- [ ] Corrigir arrays de dependências dos useEffect
- [ ] Corrigir arrays de dependências dos useCallback
- [ ] Corrigir arrays de dependências dos useMemo

### Fase 3: Correções Específicas (1 hora)
- [ ] Corrigir chave duplicada no AdminPanel
- [ ] Corrigir atributos aria no DocumentViewer
- [ ] Corrigir operadores lógicos no useClickOutside

### Fase 4: Teste e Validação (30 min)
- [ ] Executar build para verificar se warnings foram removidos
- [ ] Testar funcionalidades principais
- [ ] Verificar se não quebrou nada

---

## 📊 Métricas de Sucesso
- [ ] Reduzir warnings de ESLint de ~80 para 0
- [ ] Manter todas as funcionalidades funcionando
- [ ] Melhorar a qualidade do código
- [ ] Otimizar o tamanho do bundle

---

## ⚠️ Observações Importantes
1. **Não remover código que pode ser usado no futuro** - adicionar `// eslint-disable-next-line` se necessário
2. **Testar cada mudança** para garantir que não quebra funcionalidades
3. **Fazer commits pequenos** para facilitar rollback se necessário
4. **Documentar mudanças** importantes no código

---

## 🎯 Resultado Esperado
- Build limpo sem warnings
- Código mais limpo e otimizado
- Melhor performance
- Facilidade de manutenção
