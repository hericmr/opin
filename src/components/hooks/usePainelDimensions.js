import { useState, useEffect, useMemo } from 'react';

export const usePainelDimensions = (isMobile, isMaximized) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  
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
      setWindowHeight(window.innerHeight);
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
    
    // Determinar se está em mobile na horizontal (landscape)
    const isMobileLandscape = isMobile && windowWidth > windowHeight;

    // Determinar se deve usar grid
    const shouldUseGrid = isDesktop && isMaximized;

    // Calcular largura do painel
    let panelWidth;
    if (isMobile) {
      if (isMobileLandscape) {
        // Mobile na horizontal: preencher toda a tela
        panelWidth = '100%';
      } else {
        // Mobile na vertical: preencher toda a largura
        panelWidth = '100%';
      }
    } else {
      // Desktop
      panelWidth = isMaximized 
      ? '100%' 
      : windowWidth >= breakpoints.lg 
        ? '49%' 
        : '75%';
    }

    return {
      height: baseHeight,
      maxHeight: baseMaxHeight,
      width: panelWidth,
      isDesktop,
      isMobileLandscape,
      shouldUseGrid,
      breakpoints,
      zIndex: 1000
    };
  }, [isMobile, isMaximized, windowWidth, windowHeight]);

  return dimensions;
};