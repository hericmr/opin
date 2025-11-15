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
import { BREAKPOINTS } from '../../constants/breakpoints';

export const useBreakpoint = () => {
  // Calcular breakpoint inicial baseado na largura real
  const getInitialBreakpoint = () => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width <= BREAKPOINTS.mobile) return 'mobile';
    if (width <= BREAKPOINTS.tablet) return 'tablet';
    return 'desktop';
  };

  const getInitialWidth = () => {
    if (typeof window === 'undefined') return 1024;
    return window.innerWidth;
  };

  const [breakpoint, setBreakpoint] = useState(getInitialBreakpoint);
  const [width, setWidth] = useState(getInitialWidth);

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

    // Verificar imediatamente no mount
    updateBreakpoint();

    // Verificar também após um pequeno delay para garantir que o DOM está pronto
    const timeoutId = setTimeout(updateBreakpoint, 0);

    // Adicionar listener
    window.addEventListener('resize', updateBreakpoint);
    
    // Cleanup
    return () => {
      clearTimeout(timeoutId);
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





