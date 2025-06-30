// Utility functions for mobile detection and interaction

export const isMobile = () => {
  return window.innerWidth <= 768;
};

export const isMobileLandscape = () => {
  return isMobile() && window.innerWidth > window.innerHeight;
}; 