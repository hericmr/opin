/**
 * Hook personalizado para gerenciar meta tags
 * Facilita o uso do sistema de meta tags em componentes
 */

import { useMemo } from 'react';
import { 
  gerarUrlEscola, 
  gerarTituloEscola, 
  gerarDescricaoEscola, 
  gerarKeywordsEscola,
  gerarImagemEscola,
  gerarStructuredData 
} from '../utils/metaTags';

/**
 * Hook para gerar meta tags de uma escola
 * @param {Object} escola - Dados da escola
 * @returns {Object} Objeto com todas as meta tags geradas
 */
export const useMetaTags = (escola) => {
  return useMemo(() => {
    if (!escola) {
      return {
        url: '',
        title: '',
        description: '',
        keywords: '',
        image: '',
        structuredData: null
      };
    }

    return {
      url: gerarUrlEscola(escola),
      title: gerarTituloEscola(escola),
      description: gerarDescricaoEscola(escola),
      keywords: gerarKeywordsEscola(escola),
      image: gerarImagemEscola(escola),
      structuredData: gerarStructuredData(escola)
    };
  }, [escola]);
};

/**
 * Hook para gerar apenas URL de compartilhamento
 * @param {Object} escola - Dados da escola
 * @returns {string} URL de compartilhamento
 */
export const useShareUrl = (escola) => {
  return useMemo(() => gerarUrlEscola(escola), [escola]);
};

/**
 * Hook para gerar dados de compartilhamento completos
 * @param {Object} escola - Dados da escola
 * @returns {Object} Dados completos para compartilhamento
 */
export const useShareData = (escola) => {
  return useMemo(() => {
    if (!escola) return null;

    return {
      url: gerarUrlEscola(escola),
      title: gerarTituloEscola(escola),
      description: gerarDescricaoEscola(escola),
      image: gerarImagemEscola(escola)
    };
  }, [escola]);
};

export default useMetaTags;