# Ícones Responsivos do Menu de Camadas

## Visão Geral

Este documento descreve a implementação de ícones responsivos para o menu de camadas, onde o comportamento visual é diferente entre mobile e desktop para refletir a experiência do usuário.

## Problema Identificado

O menu de camadas tinha o mesmo ícone em mobile e desktop, mas comportamentos diferentes:
- **Desktop**: Menu que se expande/contrai no local
- **Mobile**: Menu que pode ter comportamento diferente (overlay, drawer, etc.)

## Solução Implementada

### 1. Hook Personalizado (`src/hooks/useResponsiveIcon.js`)

```javascript
// Mobile: comportamento invertido
// Minimizado: seta para baixo (pode expandir)
// Expandido: seta para cima (pode minimizar)

// Desktop: comportamento padrão  
// Minimizado: seta para cima (pode expandir)
// Expandido: seta para baixo (pode minimizar)
```

### 2. Componente Responsivo (`ResponsiveIcon`)

- **Props**: `isMobile`, `isMinimized`, `className`
- **Funcionalidade**: Renderiza SVG com path correto baseado no dispositivo
- **Acessibilidade**: Inclui `aria-label` apropriado

### 3. Integração (`MapSelector.js`)

```jsx
<ResponsiveIcon 
  isMobile={isMobile} 
  isMinimized={isMinimized} 
  className="w-4 h-4" 
/>
```

## Comportamento por Dispositivo

### Mobile (≤768px) - Comportamento Invertido
- **Minimizado**: ⬆️ (seta para cima) - "Expandir menu"
- **Expandido**: ⬇️ (seta para baixo) - "Minimizar menu"

### Desktop (>768px) - Comportamento Padrão
- **Minimizado**: ⬇️ (seta para baixo) - "Expandir menu"  
- **Expandido**: ⬆️ (seta para cima) - "Minimizar menu"

## Benefícios

✅ **UX Consistente**: Ícone reflete o comportamento real do menu  
✅ **Intuitivo**: Usuário entende a ação esperada  
✅ **Modular**: Hook reutilizável para outros componentes  
✅ **Acessível**: Labels apropriados para screen readers  
✅ **Manutenível**: Lógica centralizada e bem documentada  

## Uso em Outros Componentes

```jsx
import { ResponsiveIcon } from '../hooks/useResponsiveIcon';

// Em qualquer componente que precise de ícones responsivos
<ResponsiveIcon 
  isMobile={isMobile} 
  isMinimized={isExpanded} 
  className="w-5 h-5" 
/>
```

## Testes Recomendados

- [ ] Mobile: Verificar inversão do ícone
- [ ] Desktop: Verificar comportamento padrão
- [ ] Transição: Testar mudança de tamanho de tela
- [ ] Acessibilidade: Verificar aria-labels
- [ ] Performance: Confirmar memoização funcionando