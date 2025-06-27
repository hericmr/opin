// Utility functions for mobile detection and interaction

export const isMobile = () => {
  return window.innerWidth <= 768;
};

export const isMobileLandscape = () => {
  return isMobile() && window.innerWidth > window.innerHeight;
};

// Mobile interaction state management
export class MobileInteractionManager {
  constructor() {
    this.lastClickedFeature = null;
    this.clickTimeout = null;
    this.clickDelay = 300; // Time in ms to wait for second click
  }

  handleClick(feature, onFirstClick, onSecondClick) {
    if (!isMobile()) {
      // Desktop behavior - direct action
      onSecondClick(feature);
      return;
    }

    // Mobile behavior - two-click pattern
    if (this.lastClickedFeature === feature) {
      // Second click on same feature
      this.clearTimeout();
      this.lastClickedFeature = null;
      onSecondClick(feature);
    } else {
      // First click or click on different feature
      if (this.lastClickedFeature) {
        // Clear previous first click
        this.clearTimeout();
      }
      
      this.lastClickedFeature = feature;
      onFirstClick(feature);
      
      // Set timeout to clear first click
      this.clickTimeout = setTimeout(() => {
        this.lastClickedFeature = null;
      }, this.clickDelay);
    }
  }

  clearTimeout() {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
  }

  reset() {
    this.clearTimeout();
    this.lastClickedFeature = null;
  }
} 