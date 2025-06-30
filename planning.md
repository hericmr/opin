# Plano de Refatoração - OpenLayersMap.js

## 📋 Visão Geral

O componente `OpenLayersMap.js` atual possui **963 linhas** e múltiplas responsabilidades, tornando-o difícil de manter e expandir. Este plano propõe uma refatoração modular que separa as responsabilidades em componentes e hooks especializados.

## 🎯 Objetivos

- **Modularidade**: Separar funcionalidades em componentes menores e especializados
- **Extensibilidade**: Facilitar a adição de novas funcionalidades
- **Manutenibilidade**: Reduzir complexidade e melhorar legibilidade
- **Reutilização**: Criar hooks e utilitários reutilizáveis
- **Testabilidade**: Facilitar testes unitários e de integração

## 🏗️ Arquitetura Proposta

### Estrutura de Diretórios

```
src/
├── components/
│   ├── maps/
│   │   ├── OpenLayersMap/
│   │   │   ├── index.js                    # Componente principal
│   │   │   ├── OpenLayersMap.js            # Componente refatorado
│   │   │   ├── MapContainer.js             # Container do mapa
│   │   │   ├── MapControls.js              # Controles do mapa
│   │   │   └── MapInfo.js                  # Informações do mapa
│   │   ├── markers/
│   │   │   ├── MarkerCluster.js            # Clustering de marcadores
│   │   │   ├── MarkerLayer.js              # Camada de marcadores
│   │   │   ├── MarkerStyle.js              # Estilos de marcadores
│   │   │   ├── MarkerTooltip.js            # Tooltips de marcadores
│   │   │   └── MarkerSVG.js                # Geração de SVG
│   │   ├── layers/
│   │   │   ├── BaseLayer.js                # Camada base (satélite)
│   │   │   ├── GeoJSONLayer.js             # Camada GeoJSON genérica
│   │   │   ├── TerrasIndigenasLayer.js     # Camada específica TI
│   │   │   └── EstadoSPLayer.js            # Camada específica SP
│   │   └── interactions/
│   │       ├── MapInteractions.js          # Interações do mapa
│   │       ├── MobileInteractions.js       # Interações mobile
│   │       └── ClickHandler.js             # Manipulador de cliques
│   └── ui/
│       ├── Tooltip.js                      # Componente de tooltip
│       └── MapInfoPanel.js                 # Painel de informações
├── hooks/
│   ├── maps/
│   │   ├── useOpenLayersMap.js             # Hook principal do mapa
│   │   ├── useMapInitialization.js         # Inicialização do mapa
│   │   ├── useMapEvents.js                 # Eventos do mapa
│   │   ├── useMapView.js                   # Controle de visualização
│   │   └── useMapLayers.js                 # Gerenciamento de camadas
│   ├── markers/
│   │   ├── useMarkerClustering.js          # Clustering de marcadores
│   │   ├── useMarkerStyles.js              # Estilos de marcadores
│   │   ├── useMarkerInteractions.js        # Interações de marcadores
│   │   └── useNearbyPairs.js               # Detecção de pares próximos
│   └── interactions/
│       ├── useMobileInteractions.js        # Interações mobile
│       ├── useTooltip.js                   # Gerenciamento de tooltips
│       └── useClickHandling.js             # Manipulação de cliques
├── utils/
│   ├── maps/
│   │   ├── mapConfig.js                    # Configurações do mapa
│   │   ├── mapProjections.js               # Projeções cartográficas
│   │   └── mapUtils.js                     # Utilitários gerais
│   ├── markers/
│   │   ├── markerUtils.js                  # Utilitários de marcadores
│   │   ├── svgGenerator.js                 # Geração de SVG
│   │   └── proximityUtils.js               # Utilitários de proximidade
│   └── interactions/
│       ├── interactionUtils.js             # Utilitários de interação
│       └── mobileUtils.js                  # Utilitários mobile
└── constants/
    ├── mapConstants.js                     # Constantes do mapa
    ├── markerConstants.js                  # Constantes de marcadores
    └── interactionConstants.js             # Constantes de interação
```

## 🔧 Componentes Principais

### 1. OpenLayersMap (Componente Principal)
**Responsabilidade**: Orquestração geral e composição de componentes

```javascript
// src/components/maps/OpenLayersMap/OpenLayersMap.js
const OpenLayersMap = ({ 
  dataPoints, 
  onPainelOpen,
  center,
  zoom,
  className,
  // Props para camadas
  terrasIndigenasData,
  estadoSPData,
  showTerrasIndigenas,
  showEstadoSP,
  // Props para marcadores
  showMarcadores,
  showNomesEscolas
}) => {
  const {
    map,
    mapContainer,
    mapInfo
  } = useOpenLayersMap({ center, zoom });

  return (
    <div className={className} ref={mapContainer}>
      <MapContainer map={map}>
        <BaseLayer />
        <GeoJSONLayers 
          terrasIndigenasData={terrasIndigenasData}
          estadoSPData={estadoSPData}
          showTerrasIndigenas={showTerrasIndigenas}
          showEstadoSP={showEstadoSP}
        />
        <MarkerLayer 
          dataPoints={dataPoints}
          showMarcadores={showMarcadores}
          showNomesEscolas={showNomesEscolas}
          onPainelOpen={onPainelOpen}
        />
      </MapContainer>
      <MapInfo mapInfo={mapInfo} />
    </div>
  );
};
```

### 2. Hooks Especializados

#### useOpenLayersMap
```javascript
// src/hooks/maps/useOpenLayersMap.js
const useOpenLayersMap = ({ center, zoom }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapInfo, setMapInfo] = useState({ lng: center[0], lat: center[1], zoom });

  useMapInitialization({ map, mapContainer, center, zoom });
  useMapEvents({ map, setMapInfo });
  useMapView({ map, center, zoom });

  return { map: map.current, mapContainer, mapInfo };
};
```

#### useMarkerClustering
```javascript
// src/hooks/markers/useMarkerClustering.js
const useMarkerClustering = ({ dataPoints, showMarcadores, showNomesEscolas }) => {
  const vectorSource = useRef(null);
  const clusterSource = useRef(null);
  const vectorLayer = useRef(null);

  // Lógica de clustering
  useEffect(() => {
    // Implementação do clustering
  }, [dataPoints, showMarcadores, showNomesEscolas]);

  return { vectorSource, clusterSource, vectorLayer };
};
```

### 3. Componentes de Camadas

#### BaseLayer
```javascript
// src/components/layers/BaseLayer.js
const BaseLayer = () => {
  const { satelliteLayer } = useBaseLayer();
  
  useEffect(() => {
    // Adicionar camada base ao mapa
  }, []);

  return null;
};
```

#### GeoJSONLayer
```javascript
// src/components/layers/GeoJSONLayer.js
const GeoJSONLayer = ({ 
  data, 
  style, 
  zIndex, 
  interactive = false,
  onFeatureClick 
}) => {
  const layer = useGeoJSONLayer({ data, style, zIndex, interactive });
  
  useEffect(() => {
    // Adicionar camada ao mapa
  }, [data]);

  return null;
};
```

### 4. Componentes de Marcadores

#### MarkerLayer
```javascript
// src/components/markers/MarkerLayer.js
const MarkerLayer = ({ 
  dataPoints, 
  showMarcadores, 
  showNomesEscolas,
  onPainelOpen 
}) => {
  const { vectorLayer } = useMarkerClustering({ 
    dataPoints, 
    showMarcadores, 
    showNomesEscolas 
  });
  
  const { handleMarkerClick } = useMarkerInteractions({ onPainelOpen });
  const { createStyle } = useMarkerStyles({ showNomesEscolas });

  return null;
};
```

#### MarkerStyle
```javascript
// src/components/markers/MarkerStyle.js
const MarkerStyle = ({ feature, showNomesEscolas }) => {
  const { createMarkerStyle, createClusterStyle } = useMarkerStyles({ showNomesEscolas });
  
  // Retorna estilo apropriado baseado no tipo de feature
};
```

### 5. Componentes de Interação

#### MapInteractions
```javascript
// src/components/interactions/MapInteractions.js
const MapInteractions = ({ onPainelOpen }) => {
  const { handleClick, handleHover } = useMapInteractions({ onPainelOpen });
  const { handleMobileClick } = useMobileInteractions({ onPainelOpen });
  
  return null;
};
```

## 🎨 Utilitários e Constantes

### SVG Generator
```javascript
// src/utils/markers/svgGenerator.js
export const createMarkerSVG = (color, size = 24, options = {}) => {
  // Lógica de geração de SVG
};

export const createClusterSVG = (color, size, count) => {
  // Lógica de geração de SVG para clusters
};
```

### Proximity Utils
```javascript
// src/utils/markers/proximityUtils.js
export const findNearbyPairs = (points, threshold = 0.00005) => {
  // Lógica de detecção de pares próximos
};
```

### Map Utils
```javascript
// src/utils/maps/mapUtils.js
export const createMapView = (center, zoom, options = {}) => {
  // Criação de view do mapa
};

export const createMapControls = (options = {}) => {
  // Criação de controles do mapa
};
```

## 📦 Benefícios da Refatoração

### 1. **Modularidade**
- Cada componente tem uma responsabilidade específica
- Fácil de testar e manter
- Reutilização de código

### 2. **Extensibilidade**
- Adição de novas camadas sem modificar código existente
- Novos tipos de marcadores facilmente implementáveis
- Sistema de plugins para funcionalidades customizadas

### 3. **Performance**
- Lazy loading de componentes
- Otimização de re-renders
- Memoização de cálculos pesados

### 4. **Manutenibilidade**
- Código mais limpo e organizado
- Separação clara de responsabilidades
- Documentação inline

## 🚀 Plano de Implementação

### Fase 1: Preparação (1-2 dias)
- [ ] Criar estrutura de diretórios
- [ ] Mover utilitários existentes
- [ ] Definir interfaces e tipos

### Fase 2: Hooks Core (2-3 dias)
- [ ] Implementar `useOpenLayersMap`
- [ ] Implementar `useMapInitialization`
- [ ] Implementar `useMapEvents`
- [ ] Implementar `useMapView`

### Fase 3: Componentes de Camadas (2-3 dias)
- [ ] Implementar `BaseLayer`
- [ ] Implementar `GeoJSONLayer`
- [ ] Implementar camadas específicas (TI, SP)

### Fase 4: Componentes de Marcadores (3-4 dias)
- [ ] Implementar `MarkerLayer`
- [ ] Implementar `MarkerStyle`
- [ ] Implementar `MarkerCluster`
- [ ] Implementar `MarkerTooltip`

### Fase 5: Componentes de Interação (2-3 dias)
- [ ] Implementar `MapInteractions`
- [ ] Implementar `MobileInteractions`
- [ ] Implementar `ClickHandler`

### Fase 6: Refatoração Principal (2-3 dias)
- [ ] Refatorar `OpenLayersMap` principal
- [ ] Integrar todos os componentes
- [ ] Testes de integração

### Fase 7: Otimização e Documentação (1-2 dias)
- [ ] Otimizações de performance
- [ ] Documentação de componentes
- [ ] Exemplos de uso

## 🧪 Estratégia de Testes

### Testes Unitários
- Hooks individuais
- Utilitários
- Componentes isolados

### Testes de Integração
- Fluxo completo do mapa
- Interações entre componentes
- Performance com grandes datasets

### Testes E2E
- Funcionalidades críticas
- Compatibilidade mobile
- Diferentes navegadores

## 📚 Documentação

### Para Desenvolvedores
- Guia de uso dos hooks
- Documentação de componentes
- Exemplos de implementação

### Para Usuários Finais
- Guia de configuração
- Customização de estilos
- Adição de novas funcionalidades

## 🔄 Migração

### Estratégia Gradual
1. Manter componente atual funcionando
2. Implementar novos componentes em paralelo
3. Migrar gradualmente funcionalidades
4. Remover código antigo após validação

### Compatibilidade
- Manter API pública compatível
- Deprecation warnings para mudanças
- Guia de migração detalhado

## 📈 Métricas de Sucesso

- **Redução de linhas**: De 963 para ~200-300 no componente principal
- **Cobertura de testes**: >80%
- **Performance**: Melhoria de 20-30% no tempo de carregamento
- **Manutenibilidade**: Redução de 50% no tempo de desenvolvimento de novas features

---

**Tempo Estimado Total**: 12-18 dias
**Complexidade**: Alta
**Risco**: Médio (mitigado pela estratégia gradual)
**Benefício**: Alto (sustentabilidade a longo prazo)