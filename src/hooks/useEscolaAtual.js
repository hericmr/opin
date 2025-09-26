/**
 * Hook para detectar escola atual baseada na URL
 * Facilita a detecção automática de qual escola está sendo visualizada
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { criarSlug } from '../utils/slug';

/**
 * Hook para detectar escola atual via URL
 * @param {Array} dataPoints - Array de escolas disponíveis
 * @returns {Object} Objeto com escola atual e informações de detecção
 */
export const useEscolaAtual = (dataPoints) => {
  const location = useLocation();
  const [escolaAtual, setEscolaAtual] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Detectar escola atual baseada na URL
  const detectarEscola = useMemo(() => {
    if (!dataPoints || dataPoints.length === 0) return null;

    setIsDetecting(true);

    // Extrair parâmetro 'panel' da URL
    const urlParams = new URLSearchParams(location.search);
    const panelSlug = urlParams.get('panel');

    if (!panelSlug) {
      setIsDetecting(false);
      return null;
    }

    // Encontrar escola correspondente ao slug
    const escola = dataPoints.find(item => {
      if (!item.titulo) return false;
      const slug = criarSlug(item.titulo);
      return slug === panelSlug;
    });

    setIsDetecting(false);
    return escola || null;
  }, [location.search, dataPoints]);

  // Atualizar escola atual quando detecção mudar
  useEffect(() => {
    setEscolaAtual(detectarEscola);
  }, [detectarEscola]);

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
    isDetecting,
    debugInfo,
    hasEscola: !!escolaAtual
  };
};

export default useEscolaAtual;