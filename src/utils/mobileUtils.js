// Utility functions for mobile detection and interaction

/**
 * Detecta se é um dispositivo mobile baseado em múltiplos critérios
 */
export const isMobile = () => {
  // Verificar largura da tela
  const isMobileWidth = window.innerWidth <= 768;
  
  // Verificar se tem capacidades de toque
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Verificar se é um dispositivo móvel baseado no user agent
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Verificar orientação (mobile geralmente tem orientação variável)
  const isMobileOrientation = window.orientation !== undefined;
  
  // Retorna true se pelo menos 2 critérios forem verdadeiros
  const criteria = [isMobileWidth, hasTouch, isMobileUserAgent, isMobileOrientation];
  const mobileCriteria = criteria.filter(Boolean).length;
  
  console.log('[mobileUtils] Critérios de mobile:', {
    isMobileWidth,
    hasTouch,
    isMobileUserAgent,
    isMobileOrientation,
    mobileCriteria,
    userAgent: navigator.userAgent
  });
  
  return mobileCriteria >= 2;
};

/**
 * Detecta se é mobile em orientação paisagem
 */
export const isMobileLandscape = () => {
  return isMobile() && window.innerWidth > window.innerHeight;
};

/**
 * Detecta especificamente se o dispositivo tem capacidades de toque
 */
export const hasTouchCapabilities = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Detecta se o evento atual é um evento de toque
 */
export const isTouchEvent = (event) => {
  return event.type && event.type.startsWith('touch');
}; 