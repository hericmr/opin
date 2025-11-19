import { useState, useEffect } from 'react';
import { GlobalConfigService } from '../services/globalConfigService';

/**
 * Hook para buscar e gerenciar a configuração global de visibilidade de cards
 * @returns {Object} { globalVisibility, loading }
 */
export const useGlobalCardVisibility = () => {
  const [globalVisibility, setGlobalVisibility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGlobalConfig = async () => {
      try {
        setLoading(true);
        const config = await GlobalConfigService.getGlobalCardsVisibility();
        setGlobalVisibility(config);
      } catch (error) {
        console.error('Erro ao carregar configuração global:', error);
        setGlobalVisibility(null);
      } finally {
        setLoading(false);
      }
    };

    loadGlobalConfig();
  }, []);

  return { globalVisibility, loading };
};















