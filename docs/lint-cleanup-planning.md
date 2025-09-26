# 📋 Plano de Limpeza de Lint - Escolas Indígenas

## 🎯 Objetivo
Corrigir sistematicamente os warnings de lint restantes, mantendo a funcionalidade do site intacta.

## 📊 Status Atual
- **Erros críticos**: ✅ 0 (todos corrigidos)
- **Warnings restantes**: ~64 warnings
- **Site funcionando**: ✅ Perfeitamente

---

## ✅ FASE 1 - CORREÇÕES CRÍTICAS (CONCLUÍDA)
- [x] Corrigir 4 erros críticos (setUploadingImage, setLoading não definidos)
- [x] Corrigir 5 exports anônimos → exports nomeados
- [x] Remover constructor inútil em setupTests.js
- [x] Adicionar default case em switch statement
- [x] Corrigir variável 'data' não utilizada em legendasService.js

---

## 🟢 FASE 2 - CORREÇÕES SEGURAS (VARIÁVEIS NÃO UTILIZADAS)

### 📁 AdminPanel
- [ ] `src/components/AdminPanel/HistoriaProfessorManager.js`
  - [ ] `uploadingImage` (linha 30) - comentar se não usado
  - [ ] `handleImageUpload` (linha 135) - comentar se não usado  
  - [ ] `handleImageDelete` (linha 151) - comentar se não usado

- [ ] `src/components/AdminPanel/index.js`
  - [ ] `triggerRefresh` (linha 51) - comentar se não usado
  - [ ] `escolas` (linha 70) - comentar se não usado
  - [ ] `handleRemoverEscola` (linha 238) - comentar se não usado

### 📁 EditEscolaPanel
- [ ] `src/components/EditEscolaPanel/ImageUploadSection.js`
  - [ ] `editingImage` (linha 28) - comentar se não usado
  - [ ] `setEditingImage` (linha 28) - comentar se não usado
  - [ ] `editingDescription` (linha 29) - comentar se não usado
  - [ ] `setEditingDescription` (linha 29) - comentar se não usado
  - [ ] `handleDescriptionChange` (linha 363) - comentar se não usado

### 📁 Navbar
- [ ] `src/components/Navbar/SearchBar.js`
  - [ ] `searchTerm` (linha 8) - comentar se não usado
  - [ ] `suggestions` (linha 9) - comentar se não usado
  - [ ] `handleSuggestionClick` (linha 84) - comentar se não usado
  - [ ] `getCategoryColor` (linha 122) - comentar se não usado

### 📁 OpenLayers
- [x] `src/components/OpenLayers/OpenLayersLayers.js`
  - [x] `handleLayerVisibilityChange` (linha 60) - comentado (não usado)

- [x] `src/components/OpenLayers/OpenLayersMarkers.js`
  - [x] `selectedMarker` (linha 32) - comentado (não usado)
  - [x] `setSelectedMarker` (linha 32) - comentado (não usado)
  - [x] `isMobileDevice` (linha 35) - comentado (não usado)
  - [x] `hoveredMarker` e `setHoveredMarker` - MANTIDOS (estão sendo usados)

- [x] `src/components/OpenLayers/OpenLayersTerrasIndigenas.js`
  - [x] `features` (linha 32) - comentado (não usado)
  - [x] `hoveredFeature` e `setHoveredFeature` - MANTIDOS (estão sendo usados)

- [x] `src/components/OpenLayersMap.js`
  - [x] `mapInfo` e `setMapInfo` - MANTIDOS (estão sendo usados)

- [ ] `src/components/OpenLayersMap/index.js`
  - [ ] `MapInfo` (linha 12) - remover import se não usado
  - [ ] `mapInfo` (linha 40) - comentar se não usado

### 📁 PainelInformacoes
- [ ] `src/components/PainelInformacoes/components/EscolaInfo/BasicInfo.js`
  - [ ] `InfoBlock` (linha 64) - comentar se não usado

- [ ] `src/components/PainelInformacoes/components/EscolaInfo/GestaoProfessores.js`
  - [ ] `formatarNomeProfessor` (linha 51) - comentar se não usado

- [ ] `src/components/PainelInformacoes/components/VideoPlayer.js`
  - [ ] `loading` (linha 43) - comentar se não usado

### 📁 Outros Componentes
- [ ] `src/components/DebugLegendas.js`
  - [ ] `structure` (linha 25) - comentar se não usado

- [ ] `src/components/MapaEscolasIndigenas.js`
  - [ ] `totalEscolas` (linha 48) - comentar se não usado

- [ ] `src/components/ShareButton.js`
  - [ ] `showShareOptions` (linha 44) - comentar se não usado
  - [ ] `setShowShareOptions` (linha 44) - comentar se não usado

### 📁 Hooks e Services
- [ ] `src/components/hooks/useDocumentosEscola.js`
  - [ ] `rlsData` (linha 32) - comentar se não usado

- [ ] `src/services/fotoProfessorService.js`
  - [ ] `data` (linha 71) - comentar se não usado

- [ ] `src/services/historiaProfessorService.js`
  - [ ] `publicUrl` (linha 253) - comentar se não usado

- [ ] `src/utils/openlayers/markerStyles.js`
  - [ ] `baseColor` (linha 49) - comentar se não usado
  - [ ] `borderColor` (linha 50) - comentar se não usado
  - [ ] `clusterColor` (linha 125) - comentar se não usado

---

## 🟡 FASE 3 - CORREÇÕES CUIDADOSAS (DEPENDÊNCIAS DE HOOKS)

### ⚠️ Requerem análise cuidadosa - podem afetar funcionalidade

- [ ] `src/components/AdminPanel/HistoriaProfessorManager.js`
  - [ ] useEffect missing dependency: 'carregarHistorias' (linha 58)

- [ ] `src/components/AdminPanel/VideoManager.js`
  - [ ] useEffect missing dependency: 'carregarVideos' (linha 37)

- [ ] `src/components/AdminPanel/components/CompletenessDashboard.js`
  - [ ] useEffect missing dependency: 'fetchCompletenessData' (linha 206)

- [ ] `src/components/AdminPanel/tabs/CoordenadasTab.js`
  - [ ] useEffect missing dependencies: 'editingLocation' e 'handleMapClick' (linha 119)
  - [ ] useEffect missing dependency: 'editingLocation' (linha 126)
  - [ ] Complex expressions in dependency array (linha 126)

- [ ] `src/components/AdminPanel/tabs/HistoriaProfessoresTab.js`
  - [ ] useEffect missing dependency: 'loadHistorias' (linha 21)

- [ ] `src/components/AdminPanel/tabs/TabelasIntegraisTab.js`
  - [ ] useEffect missing dependency: 'TABELAS_SISTEMA' (linha 223)

- [ ] `src/components/MapSelector.js`
  - [ ] useEffect missing dependency: 'showMarcadores' (linha 87)

- [ ] `src/components/PainelInformacoes/components/ImagensdasEscolas.js`
  - [ ] useEffect missing dependency: 'limparCacheERecarregar' (linha 24)

- [ ] `src/components/ReusableImageZoom.js`
  - [ ] useEffect missing dependencies: 'nextImage' e 'prevImage' (linha 109)

- [ ] `src/components/hooks/useDocumentosEscola.js`
  - [ ] useEffect missing dependencies: 'documentos.length', 'error', 'isLoading' (linha 135)

- [ ] `src/components/hooks/usePainelDimensions.js`
  - [ ] useMemo missing dependency: 'breakpoints' (linha 70)

- [ ] `src/components/hooks/usePainelVisibility.js`
  - [ ] useEffect missing dependencies: 'isMobile' e 'isVisible' (linha 46)

- [ ] `src/hooks/maps/useMapEvents.js`
  - [ ] Ref value 'map.current' cleanup warning (linha 21)

- [ ] `src/hooks/useImageLoader.js`
  - [ ] useEffect missing dependency: 'getLoadingStrategy' (linha 80)
  - [ ] Ref value 'ref.current' cleanup warning (linha 159)

- [ ] `src/hooks/useMapEvents.js`
  - [ ] useEffect missing dependencies: 'createClusterTooltipElement' e 'createTooltipElement' (linha 125)

- [ ] `src/components/OpenLayers/OpenLayersMarkers.js`
  - [ ] useCallback missing dependency: 'setupInteractions' (linha 61)
  - [ ] useCallback missing dependencies: 'handleMarkerClick', 'handleMarkerHover', 'handleMarkerHoverOut' (linha 87)

- [ ] `src/components/OpenLayers/OpenLayersTerrasIndigenas.js`
  - [ ] useCallback missing dependency: 'setupInteractions' (linha 108)
  - [ ] useCallback missing dependencies: 'handleFeatureClick', 'handleFeatureHover', 'handleFeatureHoverOut' (linha 128)

---

## 🔵 FASE 4 - CORREÇÕES DE ACESSIBILIDADE

- [ ] `src/components/PainelInformacoes/components/DocumentViewer.js`
  - [ ] aria-pressed não suportado pelo role tab (linha 28)
  - [ ] aria-pressed não suportado pelo role tab (linha 48)

---

## 📝 INSTRUÇÕES DE USO

### Para cada correção:
1. **Assistente**: Faz a correção específica
2. **Usuário**: Testa o site localmente
3. **Se funcionar**: Marca como ✅ concluído
4. **Se houver problema**: Reverte a mudança

### Comandos úteis:
```bash
# Verificar erros específicos
npx eslint src/caminho/para/arquivo.js

# Build rápido para testar
npm run build

# Deploy após correções
npm run deploy
```

### Estratégia:
- **Fase 2**: Correções seguras (variáveis não utilizadas)
- **Fase 3**: Correções cuidadosas (dependências de hooks)
- **Fase 4**: Correções de acessibilidade

---

## 🎯 Meta Final
- **0 erros críticos** ✅ (já alcançado)
- **< 20 warnings** (meta realista)
- **Site 100% funcional** ✅ (já alcançado)

---

*Última atualização: $(date)*
*Status: Pronto para Fase 2 - Correções Seguras*