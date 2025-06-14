import { useState, useEffect } from "react";

const usePainelVisibility = (painelInfo) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  console.log("usePainelVisibility - painelInfo:", painelInfo);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
  }, [painelInfo]);

  console.log("usePainelVisibility - returning state:", { isVisible, isMobile });

  return { isVisible, isMobile };
};

export default usePainelVisibility;