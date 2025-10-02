import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar controles de mapa responsivos
 * 
 * @returns {Object} Configurações de controles baseadas no tamanho da tela
 */
export const useMapControls = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // Definir breakpoints
      setIsMobile(width <= 767);
      setIsTablet(width >= 768 && width <= 1023);
      setIsDesktop(width >= 1024);
    };

    // Configurar listener
    window.addEventListener('resize', handleResize);
    
    // Configurar estado inicial
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Configurações de zoom baseadas no dispositivo
   */
  const getZoomConfig = () => {
    if (isMobile) {
      return {
        bottom: 120, // Aumentado para evitar sobreposição com menu de camadas
        buttonSize: 44,
        spacing: 8,
        left: 0.25,
      };
    }
    
    if (isTablet) {
      return {
        bottom: 40,
        buttonSize: 40,
        spacing: 6,
        left: 0.5,
      };
    }
    
    // Desktop
    return {
      bottom: 60,
      buttonSize: 36,
      spacing: 6,
      left: 0.5,
    };
  };

  /**
   * Configurações de acessibilidade
   */
  const getAccessibilityConfig = () => {
    return {
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
      isLandscape: screenSize.width > screenSize.height,
    };
  };

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    zoomConfig: getZoomConfig(),
    accessibility: getAccessibilityConfig(),
  };
};

export default useMapControls;