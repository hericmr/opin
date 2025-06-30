# Refatoração Segura e Modular de OpenLayers.js

## 🎯 Objetivo
Refatorar o arquivo `OpenLayers.js` (ou equivalente), que está extenso, crítico e sujeito a falhas. A refatoração deve ser feita com **máximo cuidado**, dividida em **etapas pequenas e seguras**, evitando qualquer quebra de funcionalidade. O processo será **incremental** e acompanhado de **testes manuais a cada etapa**.

---

## 📋 Etapas do Planejamento

### 1. **Análise do Arquivo Atual**
- Identificar todas as responsabilidades do `OpenLayers.js` (ou `OpenLayersMap.js`)
- Mapear blocos de lógica (ex: inicialização do mapa, eventos de zoom/click, clusters, overlays, camadas, etc.)
- Listar os trechos de código que são candidatos a virarem componentes ou hooks reutilizáveis

### 2. **Diagnóstico: O que pode ser extraído de forma segura**

#### **Funções Utilitárias Puras**
- `createMarkerSVG`: Função pura para gerar SVG de marcadores. Não depende de React nem do estado do componente. Pode ser movida para `src/utils/markers/svgGenerator.js`.
- Outras funções auxiliares de cálculo (se existirem além das já extraídas).

#### **Funções de Estilo**
- Funções de estilo de outros layers (além das já extraídas) podem ser movidas para `featureStyles.js`.

#### **Handlers Simples**
- `handleMarkerClick`: Handler de clique em marcador, depende apenas de um callback e do dado do marcador. Pode ser extraído para um utilitário ou hook.
- `handleGeoJSONClick`: Handler de clique em features GeoJSON, depende apenas do callback e do dado da feature. Pode ser extraído para um utilitário.

#### **Funções de Estilo de Cluster/Marcador**
- `createMarkerStyle` e `createClusterStyle`: Funções de estilo para marcadores e clusters. Podem ser extraídas para um utilitário ou hook customizado (`useMarkerStyles`).

#### **Hooks Customizados**
- `useInitializeMap`: O bloco de inicialização do mapa (useEffect que cria o mapa e as camadas) pode ser extraído para um hook customizado.
- `useClusterLayer`: O bloco de criação e atualização da camada de cluster pode ser extraído para um hook.
- `useMapEvents`: Blocos de listeners de eventos (zoom, click, hover) podem ser extraídos para um hook.

#### **Componentização de Camadas**
- `BaseLayer` e `GeoJSONLayer` já são componentes autocontidos, mas se houver lógica repetida, pode ser extraída para hooks ou utilitários.

---

### 3. **Plano Incremental de Implementação**

**Prioridades para extração segura:**
1. **createMarkerSVG** (utilitário puro)
2. **Handlers simples** (`handleMarkerClick`, `handleGeoJSONClick`)
3. **Funções de estilo de cluster/marcador** (`createMarkerStyle`, `createClusterStyle`)
4. **Blocos de useEffect autocontidos** (hooks customizados: `useInitializeMap`, `useClusterLayer`, `useMapEvents`)
5. **Componentização de camadas, se houver lógica duplicada**

**Racional:**
- Começar por funções puras/utilitários reduz o risco de efeitos colaterais.
- Handlers simples são facilmente testáveis e isoláveis.
- Funções de estilo de cluster/marcador são autocontidas e podem ser migradas para hooks/utilitários.
- Hooks customizados permitem modularizar efeitos colaterais e lógica de ciclo de vida.
- Componentização de camadas só é necessária se houver duplicidade ou lógica complexa repetida.

**Para cada etapa:**
- Extrair a função/bloco para utilitário ou hook.
- Ajustar os imports/usos no componente principal.
- Testar manualmente.
- Documentar no planejamento.

---

#### Etapa concluída: Extração de handlers simples
- **Funções `handleMarkerClick` e `handleGeoJSONClick` extraídas para `src/utils/markers/handlers.js`**
- Motivo: funções puras, facilmente testáveis e reutilizáveis em outros componentes ou hooks.
- O componente principal agora importa de `utils/markers/handlers.js`.
- Teste manual realizado após a mudança.

#### Etapa concluída: Extração de funções de estilo de cluster/marcador
- **Funções `createMarkerStyle` e `createClusterStyle` extraídas para `src/utils/markers/markerStyles.js`**
- Motivo: funções autocontidas, facilmente testáveis e reutilizáveis em outros componentes ou hooks.
- O componente principal agora importa de `utils/markers/markerStyles.js`.
- Teste manual realizado após a mudança.

---

### 4. **Correção de Erros e Warnings de Lint**
Antes ou durante a refatoração incremental, resolver todos os avisos do ESLint para garantir código limpo e sustentável. Exemplos de problemas a serem corrigidos:
- Imports não utilizados (`no-unused-vars`)
- Variáveis declaradas e não usadas
- Dependências faltantes em hooks (`react-hooks/exhaustive-deps`)

**Lista de avisos atuais:**
- 'OSM' is defined but never used
- 'LineString' is defined but never used
- 'Circle' is defined but never used
- 'OpenLayersTerrasIndigenas' is defined but never used
- 'OpenLayersEstadoSP' is defined but never used
- 'pairIndex' is assigned a value but never used
- 'currentFeature' is assigned a value but never used
- React Hook useEffect has a missing dependency: 'showNomesEscolas'. Either include it or remove the dependency array
- 'usedIndices' is assigned a value but never used
- 'geometry' is assigned a value but never used (duas ocorrências)

---

## 🛡️ Boas Práticas
- Refatorar em pequenos passos, commitando cada etapa
- Testar manualmente a cada extração
- Documentar decisões e problemas encontrados
- Priorizar extrações de menor risco primeiro
- Corrigir todos os avisos de lint antes de finalizar cada etapa

---

## 📈 Progresso
- [x] Planejamento criado
- [x] `MapWrapper` criado
- [x] Integrar `MapWrapper` ao componente principal (com forwardRef)
- [x] Corrigir todos os erros/warnings de lint
- [x] Extrair função utilitária `findNearbyPairs`
- [x] Extrair função de estilo `terrasIndigenasStyle` (com retorno Style do OL)
- [x] Extrair função de estilo `estadoSPStyle`
- [x] Extrair handlers simples (`handleMarkerClick`, `handleGeoJSONClick`)
- [x] Extrair funções de estilo de cluster/marcador (`createMarkerStyle`, `createClusterStyle`)
- [ ] Extrair utilitário `createMarkerSVG`
- [ ] Extrair hooks customizados (`useInitializeMap`, `useClusterLayer`, `useMapEvents`)
- [ ] Revisão final e limpeza 