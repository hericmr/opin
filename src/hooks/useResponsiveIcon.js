import { useMemo } from 'react';

/**
 * Hook para gerenciar ícones responsivos baseados no comportamento do dispositivo
 * 
 * @param {boolean} isMobile - Se está em mobile
 * @param {boolean} isMinimized - Estado atual (minimizado/expandido)
 * @returns {Object} Configurações do ícone
 */
export const useResponsiveIcon = (isMobile, isMinimized) => {
  return useMemo(() => {
    if (isMobile) {
      // Mobile: comportamento invertido
      // Quando minimizado: seta para cima (indicando que pode expandir)
      // Quando expandido: seta para baixo (indicando que pode minimizar)
      return {
        minimized: {
          path: "M5 15l7-7 7 7",
          ariaLabel: "Expandir menu"
        },
        expanded: {
          path: "M19 9l-7 7-7-7",
          ariaLabel: "Minimizar menu"
        }
      };
    } else {
      // Desktop: comportamento padrão (mantido como estava)
      // Quando minimizado: seta para baixo (indicando que pode expandir)
      // Quando expandido: seta para cima (indicando que pode minimizar)
      return {
        minimized: {
          path: "M19 9l-7 7-7-7",
          ariaLabel: "Expandir menu"
        },
        expanded: {
          path: "M5 15l7-7 7 7",
          ariaLabel: "Minimizar menu"
        }
      };
    }
  }, [isMobile]);
};

/**
 * Componente de ícone SVG responsivo
 */
export const ResponsiveIcon = ({ isMobile, isMinimized, className = "w-4 h-4" }) => {
  const iconConfig = useResponsiveIcon(isMobile, isMinimized);
  const currentConfig = isMinimized ? iconConfig.minimized : iconConfig.expanded;

  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-label={currentConfig.ariaLabel}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={currentConfig.path} 
      />
    </svg>
  );
};

export default useResponsiveIcon;