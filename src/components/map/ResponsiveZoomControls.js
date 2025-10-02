import React, { useEffect, useRef } from 'react';
import { useMapControls } from '../../hooks/useMapControls';

/**
 * Componente wrapper para controles de zoom responsivos
 * 
 * Este componente aplica estilos dinâmicos baseados no tamanho da tela
 * e preferências de acessibilidade do usuário.
 */
const ResponsiveZoomControls = ({ mapRef }) => {
  const { zoomConfig, accessibility, isMobile, isTablet } = useMapControls();
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!controlsRef.current || !mapRef?.current) return;

    const map = mapRef.current;
    const controls = map.getControls().getArray();
    
    // Encontrar controles de zoom
    const zoomControl = controls.find(control => 
      control.getClassName && control.getClassName().includes('ol-zoom')
    );

    if (zoomControl) {
      const element = zoomControl.element;
      
      // Aplicar estilos dinâmicos
      element.style.bottom = `${zoomConfig.bottom}px`;
      element.style.left = `${zoomConfig.left}em`;
      
      // Configurar botões
      const buttons = element.querySelectorAll('.ol-zoom-in, .ol-zoom-out');
      buttons.forEach(button => {
        button.style.minHeight = `${zoomConfig.buttonSize}px`;
        button.style.minWidth = `${zoomConfig.buttonSize}px`;
        button.style.marginBottom = `${zoomConfig.spacing}px`;
        
        // Aplicar configurações de acessibilidade
        if (accessibility.prefersReducedMotion) {
          button.style.transition = 'none';
        }
        
        if (accessibility.prefersHighContrast) {
          button.style.backgroundColor = 'white';
          button.style.border = '2px solid black';
          button.style.color = 'black';
        }
      });
    }
  }, [zoomConfig, accessibility, mapRef]);

  // Em mobile, adicionar classe CSS específica para otimizações
  useEffect(() => {
    if (!controlsRef.current) return;

    const element = controlsRef.current;
    
    // Limpar classes anteriores
    element.classList.remove('mobile-optimized', 'tablet-optimized', 'desktop-optimized');
    
    // Adicionar classe baseada no dispositivo
    if (isMobile) {
      element.classList.add('mobile-optimized');
    } else if (isTablet) {
      element.classList.add('tablet-optimized');
    } else {
      element.classList.add('desktop-optimized');
    }
  }, [isMobile, isTablet]);

  return (
    <div 
      ref={controlsRef}
      className="responsive-zoom-controls"
      data-device={isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
      data-accessibility={JSON.stringify(accessibility)}
    />
  );
};

export default ResponsiveZoomControls;