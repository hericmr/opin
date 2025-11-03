import { useState, useEffect } from "react";
import { useBreakpoint } from "../../hooks/responsive/useBreakpoint";
import logger from "../../utils/logger";

/**
 * Hook para controlar visibilidade do painel
 * 
 * @param {Object|null} painelInfo - Informações do painel a ser exibido
 * @returns {Object} Objeto com isVisible e isMobile
 */
const usePainelVisibility = (painelInfo) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    logger.debug("usePainelVisibility - painelInfo mudou:", painelInfo);
    
    if (painelInfo && typeof painelInfo === 'object') {
      logger.debug("usePainelVisibility: Definindo visibilidade como true");
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      logger.debug("usePainelVisibility: Definindo visibilidade como false");
      setIsVisible(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [painelInfo]);

  return { isVisible, isMobile };
};

export default usePainelVisibility;