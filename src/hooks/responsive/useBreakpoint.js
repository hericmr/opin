/**
 * Hook para detectar breakpoints responsivos
 * 
 * Centraliza a lógica de detecção de tamanhos de tela,
 * eliminando duplicação de código de verificação mobile/tablet/desktop.
 * 
 * @returns {Object} Objeto com informações do breakpoint atual
 * @property {string} breakpoint - Nome do breakpoint ('mobile' | 'tablet' | 'desktop')
 * @property {boolean} isMobile - Se é mobile
 * @property {boolean} isTablet - Se é tablet
 * @property {boolean} isDesktop - Se é desktop
 * @property {number} width - Largura atual da janela
 * 
 * @example
 * const { breakpoint, isMobile } = useBreakpoint();
 * 
 * return (
 *   <div>
 *     {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *   </div>
 * );
 */
import { useState, useEffect } from 'react';

// Breakpoints consistentes em todo o projeto
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('desktop');
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const updateBreakpoint = () => {
      const currentWidth = window.innerWidth;
      setWidth(currentWidth);

      if (currentWidth <= BREAKPOINTS.mobile) {
        setBreakpoint('mobile');
      } else if (currentWidth <= BREAKPOINTS.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
    };

    // Verificar no mount
    updateBreakpoint();

    // Adicionar listener
    window.addEventListener('resize', updateBreakpoint);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateBreakpoint);
    };
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    width,
  };
};

export default useBreakpoint;




