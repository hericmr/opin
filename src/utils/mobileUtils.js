// Utility functions for mobile detection and interaction

/**
 * Detecta se é um dispositivo mobile baseado em múltiplos critérios
 * Prioriza a largura da tela como critério principal
 */
export const isMobile = () => {
  // PRIORIDADE: Largura da tela é o critério principal
  // Se a largura for maior que 768px, NUNCA é mobile (mesmo com touch)
  const width = window.innerWidth;
  if (width > 768) {
    return false; // Desktop - nunca mobile, mesmo com touch
  }
  
  // Para telas menores ou igual a 768px, verificar outros critérios
  const isMobileWidth = width <= 768;
  
  // Verificar se é um dispositivo móvel baseado no user agent
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Verificar orientação (mobile geralmente tem orientação variável)
  const isMobileOrientation = window.orientation !== undefined;
  
  // Se a largura é mobile E tem user agent mobile OU orientação mobile, é mobile
  // Touch sozinho não é suficiente (desktops também podem ter touch)
  if (isMobileWidth && (isMobileUserAgent || isMobileOrientation)) {
    return true;
  }
  
  // Se largura é mobile mas não tem user agent nem orientação, 
  // verificar se é realmente mobile (pode ser janela pequena no desktop)
  // Nesse caso, usar apenas a largura como critério
  return isMobileWidth;
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