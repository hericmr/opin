import { useEffect } from 'react';

/**
 * Hook para suprimir o warning de findDOMNode do ReactQuill
 * Este é um workaround para o problema conhecido do ReactQuill 2.0.0
 */
export const useSuppressFindDOMNodeWarning = () => {
  useEffect(() => {
    // Salvar a função original de console.warn
    const originalWarn = console.warn;
    
    // Substituir console.warn para filtrar o warning específico
    console.warn = (...args) => {
      const message = args[0];
      
      // Se for o warning de findDOMNode, não exibir
      if (typeof message === 'string' && message.includes('findDOMNode is deprecated')) {
        return;
      }
      
      // Para todos os outros warnings, usar o comportamento normal
      originalWarn.apply(console, args);
    };
    
    // Restaurar a função original quando o componente for desmontado
    return () => {
      console.warn = originalWarn;
    };
  }, []);
};
