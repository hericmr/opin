# Controles de Mapa Responsivos

## Visão Geral

Este documento descreve a implementação de controles de zoom responsivos para o mapa OpenLayers, seguindo boas práticas de design responsivo e acessibilidade.

## Arquitetura

### 1. CSS Modular (`src/styles/map-controls.css`)
- **Breakpoints definidos**: Mobile (≤767px), Tablet (768-1023px), Desktop (≥1024px)
- **Posicionamento responsivo**: `bottom` ajustado conforme dispositivo
- **Acessibilidade**: Suporte a `prefers-reduced-motion` e `prefers-contrast`
- **Área de toque**: Mínimo 44px em mobile (padrão WCAG)

### 2. Hook Personalizado (`src/hooks/useMapControls.js`)
- **Gerenciamento de estado**: Tamanho da tela e tipo de dispositivo
- **Configurações dinâmicas**: Zoom config baseado no dispositivo
- **Acessibilidade**: Detecção de preferências do usuário
- **Performance**: Debounce automático no resize

### 3. Componente Wrapper (`src/components/map/ResponsiveZoomControls.js`)
- **Integração**: Conecta hook com OpenLayers
- **Estilos dinâmicos**: Aplica configurações em tempo real
- **Classes CSS**: Adiciona classes baseadas no dispositivo
- **Cleanup**: Remove listeners automaticamente

## Configurações por Dispositivo

### Mobile (≤767px)
```css
bottom: 120px  /* Aumentado para evitar sobreposição com menu de camadas */
button-size: 44px
spacing: 8px
left: 0.25em
```

### Tablet (768-1023px)
```css
bottom: 40px
button-size: 40px
spacing: 6px
left: 0.5em
```

### Desktop (≥1024px)
```css
bottom: 60px
button-size: 36px
spacing: 6px
left: 0.5em
```

## Recursos de Acessibilidade

### Redução de Movimento
- Remove transições para usuários com `prefers-reduced-motion: reduce`
- Desabilita animações de hover

### Alto Contraste
- Aplica estilos de alto contraste quando `prefers-contrast: high`
- Bordas mais espessas e cores contrastantes

### Área de Toque
- Botões com mínimo 44px em mobile
- Espaçamento adequado entre elementos

## Uso

```jsx
import ResponsiveZoomControls from './components/map/ResponsiveZoomControls';

// No componente do mapa
<ResponsiveZoomControls mapRef={mapRef} />
```

## Manutenção

### Adicionar Novo Breakpoint
1. Atualizar `map-controls.css` com nova media query
2. Modificar `useMapControls.js` para incluir nova configuração
3. Testar em diferentes dispositivos

### Modificar Posicionamento
1. Editar valores em `getZoomConfig()` no hook
2. Atualizar CSS correspondente
3. Verificar acessibilidade

## Testes Recomendados

- [ ] Mobile portrait (320px-480px)
- [ ] Mobile landscape (480px-767px)
- [ ] Tablet portrait (768px-1024px)
- [ ] Tablet landscape (1024px-1366px)
- [ ] Desktop (1366px+)
- [ ] Preferências de acessibilidade
- [ ] Performance em resize rápido