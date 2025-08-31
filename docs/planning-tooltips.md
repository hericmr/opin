# Planning: Implementação de Tooltips no Mapa

## Visão Geral
Implementar um sistema de tooltips para os marcadores das escolas e terras indígenas no mapa, proporcionando uma experiência de usuário melhorada tanto em desktop quanto em dispositivos móveis.

## Objetivos
- **Desktop**: Exibir tooltips informativos ao passar o mouse sobre os marcadores
- **Mobile**: Exibir tooltips ao primeiro clique, com segundo clique abrindo o painel completo da escola
- **Consistência**: Manter padrão visual e comportamental entre diferentes tipos de marcadores
- **Performance**: Implementar tooltips sem impactar a performance do mapa

## Funcionalidades Principais

### 1. Tooltips para Escolas
- **Conteúdo**: Nome da escola, município, tipo de escola
- **Posicionamento**: Acima do marcador, com seta apontando para baixo
- **Responsividade**: Adaptar posição baseado nos limites da tela

### 2. Tooltips para Terras Indígenas
- **Conteúdo**: Nome da terra indígena, etnia, município
- **Posicionamento**: Similar aos tooltips das escolas
- **Estilo**: Diferenciado visualmente dos tooltips das escolas

### 3. Comportamento Mobile
- **Primeiro clique**: Exibir tooltip
- **Segundo clique**: Abrir painel completo da escola/terra indígena
- **Timeout**: Tooltip desaparece após 3 segundos de inatividade

## Arquitetura Técnica

### Componentes a Criar/Modificar

#### 1. `TooltipManager.js` (Novo)
```javascript
// Gerenciador central dos tooltips
- Controle de estado dos tooltips ativos
- Lógica de posicionamento
- Gerenciamento de eventos mobile vs desktop
- Cache de tooltips para performance
```

#### 2. `MapTooltip.js` (Novo)
```javascript
// Componente visual do tooltip
- Renderização do conteúdo
- Estilos responsivos
- Animações de entrada/saída
- Posicionamento dinâmico
```

#### 3. Modificações em `OpenLayersMarkers.js`
```javascript
// Adicionar lógica de tooltips
- Integração com TooltipManager
- Eventos de hover/click para tooltips
- Dados para tooltips das escolas
```

#### 4. Modificações em `OpenLayersTerrasIndigenas.js`
```javascript
// Adicionar lógica de tooltips
- Integração com TooltipManager
- Eventos de hover/click para tooltips
- Dados para tooltips das terras indígenas
```

#### 5. Modificações em `OpenLayersMap.js`
```javascript
// Integração do sistema de tooltips
- Renderização do TooltipManager
- Passagem de props necessárias
```

### Hooks a Criar

#### 1. `useTooltip.js`
```javascript
// Hook para gerenciar estado dos tooltips
- Estado do tooltip ativo
- Posição do tooltip
- Lógica de timeout mobile
- Controle de visibilidade
```

#### 2. `useTooltipPosition.js`
```javascript
// Hook para cálculo de posicionamento
- Cálculo de posição baseado no marcador
- Ajuste para limites da tela
- Posicionamento responsivo
```

## Estrutura de Dados

### Tooltip Data Structure
```javascript
const tooltipData = {
  id: 'unique_id',
  type: 'school' | 'indigenous_land',
  title: 'Nome da escola/terra indígena',
  subtitle: 'Município, Estado',
  additionalInfo: 'Informações extras',
  coordinates: { x: 100, y: 200 },
  markerData: { /* dados completos do marcador */ }
};
```

### Estado do Tooltip
```javascript
const tooltipState = {
  isVisible: false,
  currentTooltip: null,
  position: { x: 0, y: 0 },
  isMobile: false,
  clickCount: 0,
  timeoutId: null
};
```

## Implementação por Fases

### Fase 1: Estrutura Base
1. **Criar `TooltipManager.js`**
   - Estrutura básica do componente
   - Estados principais
   - Integração com OpenLayers

2. **Criar `MapTooltip.js`**
   - Componente visual básico
   - Estilos CSS iniciais
   - Posicionamento estático

3. **Criar hooks básicos**
   - `useTooltip.js` com estado simples
   - `useTooltipPosition.js` com posicionamento básico

### Fase 2: Integração com Marcadores
1. **Modificar `OpenLayersMarkers.js`**
   - Adicionar eventos de hover
   - Integrar com TooltipManager
   - Testar tooltips das escolas

2. **Modificar `OpenLayersTerrasIndigenas.js`**
   - Adicionar eventos de hover
   - Integrar com TooltipManager
   - Testar tooltips das terras indígenas

### Fase 3: Funcionalidade Mobile
1. **Implementar lógica de clique duplo**
   - Contador de cliques
   - Timeout para tooltips
   - Integração com painel de escolas

2. **Testar comportamento mobile**
   - Primeiro clique mostra tooltip
   - Segundo clique abre painel
   - Timeout funciona corretamente

### Fase 4: Polimento e Otimização
1. **Melhorar posicionamento**
   - Ajuste para limites da tela
   - Posicionamento responsivo
   - Animações suaves

2. **Otimizar performance**
   - Cache de tooltips
   - Debounce de eventos
   - Lazy loading de conteúdo

3. **Testes e ajustes**
   - Diferentes tamanhos de tela
   - Diferentes dispositivos
   - Casos edge

## Estilos e Design

### Tooltip Visual Design
```css
.tooltip {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.9);
}
```

### Variações por Tipo
- **Escolas**: Cor azul/verde com ícone de escola
- **Terras Indígenas**: Cor marrom/terra com ícone de terra
- **Hover**: Efeito de elevação e brilho
- **Mobile**: Tamanho maior para melhor usabilidade

## Eventos e Interações

### Desktop (Hover)
```javascript
// Eventos de mouse
onMouseEnter: () => showTooltip()
onMouseLeave: () => hideTooltip()
onMouseMove: () => updateTooltipPosition()
```

### Mobile (Touch)
```javascript
// Eventos de toque
onTouchStart: () => handleTouchStart()
onTouchEnd: () => handleTouchEnd()
onClick: () => handleClick()
```

### Lógica de Clique Mobile
```javascript
const handleMobileClick = (markerData) => {
  if (clickCount === 0) {
    // Primeiro clique: mostrar tooltip
    showTooltip(markerData);
    startTimeout();
    setClickCount(1);
  } else if (clickCount === 1) {
    // Segundo clique: abrir painel
    openPanel(markerData);
    hideTooltip();
    setClickCount(0);
  }
};
```

## Considerações de Performance

### Otimizações
1. **Debounce de eventos de mouse**
   - Evitar atualizações excessivas de posição
   - Limitar a 60fps

2. **Cache de tooltips**
   - Reutilizar tooltips já criados
   - Pool de componentes

3. **Lazy loading**
   - Carregar conteúdo apenas quando necessário
   - Skeleton loading para tooltips

4. **Virtualização**
   - Renderizar apenas tooltips visíveis
   - Limitar número máximo de tooltips ativos

### Monitoramento
```javascript
// Métricas de performance
const tooltipMetrics = {
  renderTime: 0,
  showTime: 0,
  hideTime: 0,
  memoryUsage: 0
};
```

## Testes e Validação

### Testes Unitários
1. **TooltipManager**
   - Criação e destruição de tooltips
   - Posicionamento correto
   - Estados de visibilidade

2. **MapTooltip**
   - Renderização do conteúdo
   - Estilos aplicados
   - Responsividade

3. **Hooks**
   - Estados corretos
   - Lógica de timeout
   - Posicionamento

### Testes de Integração
1. **Marcadores de escolas**
   - Tooltips aparecem no hover
   - Conteúdo correto
   - Posicionamento adequado

2. **Terras indígenas**
   - Tooltips funcionam corretamente
   - Estilo diferenciado
   - Interação adequada

3. **Comportamento mobile**
   - Primeiro clique mostra tooltip
   - Segundo clique abre painel
   - Timeout funciona

### Testes de Performance
1. **Renderização**
   - Tempo de criação de tooltips
   - FPS durante interações
   - Uso de memória

2. **Responsividade**
   - Diferentes tamanhos de tela
   - Diferentes dispositivos
   - Casos edge

## Cronograma Estimado

### Semana 1: Estrutura Base
- Criar componentes base
- Implementar hooks básicos
- Estrutura de dados

### Semana 2: Integração
- Integrar com marcadores
- Integrar com terras indígenas
- Testes básicos

### Semana 3: Mobile
- Implementar lógica mobile
- Testar comportamento
- Ajustes de UX

### Semana 4: Polimento
- Otimizações de performance
- Testes finais
- Documentação

## Riscos e Mitigações

### Riscos Identificados
1. **Performance em dispositivos antigos**
   - Mitigação: Implementar fallbacks e otimizações

2. **Conflitos com interações existentes**
   - Mitigação: Testes extensivos e refatoração se necessário

3. **Complexidade da lógica mobile**
   - Mitigação: Implementação incremental e testes contínuos

4. **Compatibilidade cross-browser**
   - Mitigação: Testes em múltiplos navegadores e fallbacks

### Plano de Contingência
1. **Implementação simplificada**
   - Tooltips básicos sem animações complexas
   - Funcionalidade mobile reduzida

2. **Fallback para dispositivos antigos**
   - Desabilitar tooltips em dispositivos com performance baixa
   - Manter funcionalidade básica

## Critérios de Aceitação

### Funcionalidade
- [ ] Tooltips aparecem ao hover em desktop
- [ ] Tooltips aparecem ao primeiro clique em mobile
- [ ] Segundo clique abre painel da escola
- [ ] Tooltips são posicionados corretamente
- [ ] Conteúdo é relevante e legível

### Performance
- [ ] Tooltips não impactam FPS do mapa
- [ ] Tempo de resposta < 100ms
- [ ] Uso de memória < 10MB adicional
- [ ] Funciona em dispositivos móveis antigos

### UX/UI
- [ ] Design consistente com o resto da aplicação
- [ ] Responsivo em diferentes tamanhos de tela
- [ ] Animações suaves e naturais
- [ ] Acessível (ARIA labels, contraste)

### Compatibilidade
- [ ] Funciona em Chrome, Firefox, Safari, Edge
- [ ] Funciona em dispositivos iOS e Android
- [ ] Funciona com diferentes resoluções
- [ ] Funciona com zoom do navegador

## Próximos Passos

1. **Revisar e aprovar este planning**
2. **Criar branch de desenvolvimento**
3. **Implementar Fase 1 (Estrutura Base)**
4. **Revisar código e fazer ajustes**
5. **Continuar com fases subsequentes**
6. **Testes contínuos e validação**
7. **Deploy e monitoramento**

---

**Autor**: Equipe de Desenvolvimento  
**Data**: Janeiro 2025  
**Versão**: 1.0  
**Status**: Em revisão
