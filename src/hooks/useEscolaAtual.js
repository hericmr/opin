/**
 * Hook para detectar escola atual baseada na URL
 * Facilita a detecção automática de qual escola está sendo visualizada
 */

import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { criarSlug } from '../utils/slug';

/**
 * Hook para detectar escola atual via URL
 * @param {Array} dataPoints - Array de escolas disponíveis
 * @returns {Object} Objeto com escola atual e informações de detecção
 */
export const useEscolaAtual = (dataPoints) => {
  const location = useLocation();
  // Detectar escola atual baseada na URL (derivado; não precisa de estado)
  const escolaAtual = useMemo(() => {
    if (!dataPoints || dataPoints.length === 0) return null;

    // Extrair parâmetro 'panel' da URL
    const urlParams = new URLSearchParams(location.search);
    const panelSlug = urlParams.get('panel');

    if (!panelSlug) return null;

    // Encontrar escola correspondente ao slug
    const escola = dataPoints.find(item => {
      if (!item.titulo) return false;
      const slug = criarSlug(item.titulo);
      return slug === panelSlug;
    });

    return escola || null;
  }, [location.search, dataPoints]);

  // Informações de debug
  const debugInfo = useMemo(() => {
    if (!escolaAtual) return null;

    return {
      titulo: escolaAtual.titulo,
      slug: criarSlug(escolaAtual.titulo),
      url: window.location.href,
      municipio: escolaAtual['Município'],
      povos: escolaAtual['Povos indigenas']
    };
  }, [escolaAtual]);

  return {
    escolaAtual,
    debugInfo,
    hasEscola: !!escolaAtual
  };
};

export default useEscolaAtual;