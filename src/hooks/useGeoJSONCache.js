import { useState, useEffect } from 'react';
import logger from '../utils/logger';

// Um objeto simples para armazenar os dados GeoJSON em memória.
const cache = {};

// Mapeamento de chaves para seus arquivos simplificados (muito menores)
// SP: 2 MB → 176 KB | terras_indigenas: 944 KB → 196 KB
const SIMPLIFIED_MAP = {
  'SP': 'SP_simplified',
  'terras_indigenas': 'terras_indigenas_simplified',
};

/**
 * Hook para carregar e cachear dados GeoJSON
 * Usa automaticamente versões simplificadas quando disponíveis.
 *
 * @param {string} key - Chave do arquivo GeoJSON (sem extensão)
 * @returns {Object} Objeto com data, loading e error
 */
export const useGeoJSONCache = (key) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!key) return;

    // Prefere a versão simplificada quando disponível
    const resolvedKey = SIMPLIFIED_MAP[key] ?? key;

    const fetchGeoJSON = async () => {
      if (cache[resolvedKey]) {
         logger.debug(`useGeoJSONCache: Dados de ${resolvedKey} encontrados no cache`);
         setData(cache[resolvedKey]);
         return;
      }
      setLoading(true);
      try {
         const rawBase = process.env.PUBLIC_URL || import.meta.env.BASE_URL || '/opin';
         const base = rawBase.endsWith('/') ? rawBase.slice(0, -1) : rawBase;
         const url = `${base}/${resolvedKey}.geojson`;
         logger.info(`useGeoJSONCache: Iniciando carregamento de ${resolvedKey}. Requisitando: ${url}`);
         
         const startTime = Date.now();
         const response = await fetch(url);
         if (!response.ok) throw new Error(`Erro ao buscar GeoJSON (${response.status})`);
         
         const geoJSON = await response.json();
         const duration = Date.now() - startTime;
         
         const sizeKB = Math.round(JSON.stringify(geoJSON).length / 1024);
         logger.info(`useGeoJSONCache: ${resolvedKey} carregado em ${duration}ms. Tamanho aproximado: ${sizeKB}KB`);
         
         if (sizeKB > 500 && !resolvedKey.includes('simplified')) {
           logger.warn(`useGeoJSONCache: Detectado GeoJSON grande (${sizeKB}KB) sem versão simplificada: ${resolvedKey}`);
         }

         cache[resolvedKey] = geoJSON;
         setData(geoJSON);
      } catch (err) {
         logger.error(`useGeoJSONCache: Erro ao carregar ${resolvedKey}:`, err);
         setError(err);
      } finally {
         setLoading(false);
      }
    };

    fetchGeoJSON();
  }, [key]);

  return { data, loading, error };
}; 