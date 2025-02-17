export const usePainelDimensions = (isMobile) => {
    const navbarHeight = isMobile ? 62 : 0;
    
    return {
      height: `calc(${isMobile ? "100vh" : "100vh"} - ${navbarHeight}px)`,
      maxHeight: isMobile ? "96vh" : "92vh"
    };
  };