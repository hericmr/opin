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
         setData(cache[key]);
         return;
      }
      setLoading(true);
      try {
         const response = await fetch(`${process.env.PUBLIC_URL}/${key}.geojson`);
         if (!response.ok) throw new Error(`Erro ao buscar GeoJSON (${response.status})`);
         const geoJSON = await response.json();
         cache[key] = geoJSON;
         setData(geoJSON);
      } catch (err) {
         setError(err);
      } finally {
         setLoading(false);
      }
    };

    fetchGeoJSON();
  }, [key]);

  return { data, loading, error };
}; 