import { useState, useEffect } from "react";

const usePainelVisibility = (painelInfo) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  console.log("usePainelVisibility - painelInfo:", painelInfo);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileWidth = window.innerWidth <= 768;
      const isMobileLandscape = window.innerWidth > window.innerHeight && window.innerWidth <= 1024;
      setIsMobile(isMobileWidth || isMobileLandscape);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  useEffect(() => {
    console.group("usePainelVisibility - Effect");
    console.log("painelInfo recebido:", painelInfo);
    
    if (painelInfo && typeof painelInfo === 'object') {
      console.log("painelInfo válido, definindo visibilidade como true");
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      console.log("painelInfo inválido ou undefined, definindo visibilidade como false");
      setIsVisible(false);
      document.body.style.overflow = "";
    }

    console.log("Estado atual:", { isVisible, isMobile });
    console.groupEnd();

    return () => {
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [painelInfo]);

  console.log("usePainelVisibility - returning state:", { isVisible, isMobile });

  return { isVisible, isMobile };
};

export default usePainelVisibility;