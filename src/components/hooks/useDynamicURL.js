import { useEffect, useRef } from "react";

export const useDynamicURL = (painelInfo, gerarLinkCustomizado) => {
  const lastUrlRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!painelInfo) return;

    // Limpa o timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cria um novo timeout para debounce
    timeoutRef.current = setTimeout(() => {
      const newUrl = gerarLinkCustomizado();
      
      // Só atualiza se a URL realmente mudou
      if (newUrl !== lastUrlRef.current) {
        try {
          window.history.replaceState({}, "", newUrl);
          lastUrlRef.current = newUrl;
        } catch (error) {
          console.warn('Erro ao atualizar URL:', error);
        }
      }
    }, 300); // 300ms de debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [painelInfo, gerarLinkCustomizado]);
};