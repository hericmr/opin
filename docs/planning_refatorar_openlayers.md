# Refatoração Segura e Modular de OpenLayers.js

## 🎯 Objetivo
Refatorar o arquivo `OpenLayers.js` (ou equivalente), que está extenso, crítico e sujeito a falhas. A refatoração deve ser feita com **máximo cuidado**, dividida em **etapas pequenas e seguras**, evitando qualquer quebra de funcionalidade. O processo será **incremental** e acompanhado de **testes manuais a cada etapa**.

---

## 📋 Etapas do Planejamento

### 1. **Análise do Arquivo Atual**
- Identificar todas as responsabilidades do `OpenLayers.js` (ou `OpenLayersMap.js`)
- Mapear blocos de lógica (ex: inicialização do mapa, eventos de zoom/click, clusters, overlays, camadas, etc.)
- Listar os trechos de código que são candidatos a virarem componentes ou hooks reutilizáveis

### 2. **Planejar Componentização Gradual**
Criar um plano para isolar cada parte em um novo componente, **em ordem de menor risco para maior complexidade**.

#### 💡 Sugestão de divisão inicial:
1. `MapWrapper`: isolando apenas a renderização do `<div>` do mapa + a criação do objeto do mapa
2. `useInitializeMap`: um hook que inicializa o mapa e suas camadas
3. `useMapEvents`: lida com listeners (zoom, click, hover, etc.)
4. `ClusterLayer`: camada de cluster isolada
5. `SchoolMarkersOverlay`: renderiza os overlays de escolas com dados
6. `useFitViewToMarkers`: hook para controlar o zoom/fit ao selecionar escolas ou clusters

### 3. **Execução Incremental**
Para cada etapa:
- Extrair a responsabilidade para um novo componente/hook
- Garantir que a funcionalidade não foi quebrada (testes manuais)
- Refatorar chamadas no componente principal para usar o novo módulo
- Documentar rapidamente cada extração

#### Exemplo de Primeira Etapa
- Criar `components/map/MapWrapper.jsx`:
  - Apenas renderiza o `<div id="map">`
  - ForwardRef para receber o container do mapa, se necessário
  - **Observação:** Para integração correta com OpenLayers, o componente deve usar `React.forwardRef` e receber a ref do container.

```jsx
// components/map/MapWrapper.jsx
import React from 'react';

const MapWrapper = React.forwardRef((props, ref) => {
  return <div id="map" className="w-full h-full" ref={ref} {...props} />;
});

export default MapWrapper;
```

---

#### Etapa concluída: Extração de função utilitária
- **Função `findNearbyPairs` extraída para `src/utils/markers/proximityUtils.js`**
- Motivo: função pura, sem dependências de React ou estado, fácil de testar e reutilizar em outros componentes ou hooks.
- O componente principal agora importa de `utils/markers/proximityUtils.js`.
- Teste manual realizado após a mudança.

---

#### Etapa concluída: Extração de função de estilo
- **Função `terrasIndigenasStyle` extraída para `src/utils/markers/featureStyles.js`**
- Motivo: função pura de estilo, sem dependências de React ou estado, fácil de testar e reutilizar em outros componentes de camada ou hooks.
- O componente principal agora importa de `utils/markers/featureStyles.js`.
- **Correção:** A função foi ajustada para retornar um objeto `Style` do OpenLayers, garantindo compatibilidade e funcionamento correto.
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
- [ ] Extrair hook de inicialização do mapa
- [ ] Extrair hook de eventos do mapa
- [ ] Extrair camada de cluster
- [ ] Extrair overlay de marcadores
- [ ] Extrair hook de fit/zoom
- [ ] Revisão final e limpeza 