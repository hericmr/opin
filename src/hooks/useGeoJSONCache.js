import { useState, useEffect } from 'react';
import logger from '../utils/logger';

// Um objeto simples para armazenar os dados GeoJSON em memória.
const cache = {};

/**
 * Hook para carregar e cachear dados GeoJSON
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

    const fetchGeoJSON = async () => {
      if (cache[key]) {
         logger.debug(`useGeoJSONCache: Dados de ${key} encontrados no cache`);
         setData(cache[key]);
         return;
      }
      setLoading(true);
      try {
         const url = `${import.meta.env.BASE_URL || '/opin'}/${key}.geojson`;
         logger.debug(`useGeoJSONCache: Carregando ${key} de:`, url);
         const response = await fetch(url);
         if (!response.ok) throw new Error(`Erro ao buscar GeoJSON (${response.status})`);
         const geoJSON = await response.json();
         logger.debug(`useGeoJSONCache: ${key} carregado com sucesso:`, {
           type: geoJSON.type,
           features: geoJSON.features?.length || 0,
         });
         cache[key] = geoJSON;
         setData(geoJSON);
      } catch (err) {
         logger.error(`useGeoJSONCache: Erro ao carregar ${key}:`, err);
         setError(err);
      } finally {
         setLoading(false);
      }
    };

    fetchGeoJSON();
  }, [key]);

  return { data, loading, error };
}; 