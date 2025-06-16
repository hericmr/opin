import { useState, useEffect, useMemo } from 'react';

export const usePainelDimensions = (isMobile, isMaximized) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Breakpoints para responsividade
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };

  // Detectar mudanças no tamanho da janela
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular dimensões base
  const dimensions = useMemo(() => {
    const navbarHeight = isMobile ? 62 : 0;
    const baseHeight = `calc(${isMobile ? "100vh" : "100vh"} - ${navbarHeight}px)`;
    const baseMaxHeight = isMobile ? "96vh" : "92vh";

    // Determinar se está em modo desktop
    const isDesktop = windowWidth >= breakpoints.md;

    // Determinar se deve usar grid
    const shouldUseGrid = isDesktop && isMaximized;

    // Calcular largura do painel
    const panelWidth = isMaximized 
      ? '100%' 
      : windowWidth >= breakpoints.lg 
        ? '49%' 
        : '75%';

    return {
      height: baseHeight,
      maxHeight: baseMaxHeight,
      width: panelWidth,
      isDesktop,
      shouldUseGrid,
      breakpoints,
      zIndex: 1000
    };
  }, [isMobile, isMaximized, windowWidth]);

  return dimensions;
};