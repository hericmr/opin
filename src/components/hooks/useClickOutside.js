import { useEffect } from 'react';

export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Só fecha se o clique for no mapa (openlayers-container)
      const el = event.target;
      if (el.classList && el.classList.contains('openlayers-container')) {
        return;
      }
      
      // Ignorar cliques em botões de fechar ou seus elementos filhos
      const isCloseButton = el.closest('button[aria-label="Fechar painel"]') || 
                           el.closest('button[aria-label*="Fechar"]') ||
                           el.closest('[aria-label="Fechar painel"]');
      if (isCloseButton) {
        return;
      }
      
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};