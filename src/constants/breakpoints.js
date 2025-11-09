/**
 * Constantes de breakpoints para o projeto OPIN
 * 
 * Centraliza todas as definições de tamanhos de tela para garantir
 * consistência em toda a aplicação.
 */

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1025,
};

const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tablet: `(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`,
  desktop: `(min-width: ${BREAKPOINTS.desktop}px)`,
};

/**
 * Verifica se a largura fornecida corresponde a mobile
 * @param {number} width - Largura em pixels
 * @returns {boolean}
 */
const isMobileWidth = (width) => width <= BREAKPOINTS.mobile;

/**
 * Verifica se a largura fornecida corresponde a tablet
 * @param {number} width - Largura em pixels
 * @returns {boolean}
 */
const isTabletWidth = (width) => 
  width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet;

/**
 * Verifica se a largura fornecida corresponde a desktop
 * @param {number} width - Largura em pixels
 * @returns {boolean}
 */
const isDesktopWidth = (width) => width > BREAKPOINTS.tablet;

// Exportar tudo no final para evitar problemas de hoisting
export {
  BREAKPOINTS,
  MEDIA_QUERIES,
  isMobileWidth,
  isTabletWidth,
  isDesktopWidth
};


















