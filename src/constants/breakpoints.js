/**
 * Constantes de breakpoints para o projeto OPIN
 * 
 * Centraliza todas as definições de tamanhos de tela para garantir
 * consistência em toda a aplicação.
 */

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025,
};

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
};

/**
 * Verifica se a largura fornecida corresponde a mobile
 * @param {number} width - Largura em pixels
 * @returns {boolean}
 */
export const isMobile = (width) => width <= BREAKPOINTS.mobile;

/**
 * Verifica se a largura fornecida corresponde a tablet
 * @param {number} width - Largura em pixels
 * @returns {boolean}
 */
export const isTablet = (width) => 
  width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;

/**
 * Verifica se a largura fornecida corresponde a desktop
 * @param {number} width - Largura em pixels
 * @returns {boolean}
 */
export const isDesktop = (width) => width > BREAKPOINTS.tablet;


