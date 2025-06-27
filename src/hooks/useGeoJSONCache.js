import { useState, useEffect } from 'react';

// Um objeto simples para armazenar os dados GeoJSON em memória.
const cache = {};

export const useGeoJSONCache = (key) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!key) return;

    const fetchGeoJSON = async () => {
      if (cache[key]) {
         console.log(`useGeoJSONCache: Dados de ${key} encontrados no cache`);
         setData(cache[key]);
         return;
      }
      setLoading(true);
      try {
         const url = `${process.env.PUBLIC_URL}/${key}.geojson`;
         console.log(`useGeoJSONCache: Carregando ${key} de:`, url);
         const response = await fetch(url);
         if (!response.ok) throw new Error(`Erro ao buscar GeoJSON (${response.status})`);
         const geoJSON = await response.json();
         console.log(`useGeoJSONCache: ${key} carregado com sucesso:`, {
           type: geoJSON.type,
           features: geoJSON.features?.length || 0,
           crs: geoJSON.crs,
           firstFeature: geoJSON.features?.[0] ? {
             type: geoJSON.features[0].type,
             properties: geoJSON.features[0].properties ? Object.keys(geoJSON.features[0].properties) : 'Sem propriedades',
             geometry: geoJSON.features[0].geometry ? {
               type: geoJSON.features[0].geometry.type,
               coordinates: geoJSON.features[0].geometry.coordinates ? 
                 `${geoJSON.features[0].geometry.coordinates.length} arrays` : 'Sem coordenadas'
             } : 'Sem geometria'
           } : 'Nenhum feature'
         });
         cache[key] = geoJSON;
         setData(geoJSON);
      } catch (err) {
         console.error(`useGeoJSONCache: Erro ao carregar ${key}:`, err);
         setError(err);
      } finally {
         setLoading(false);
      }
    };

    fetchGeoJSON();
  }, [key]);

  return { data, loading, error };
}; 