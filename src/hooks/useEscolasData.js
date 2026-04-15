import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../dbClient';
import { mapEscolaData } from '../utils/escolaMapper';
import { useRefresh } from '../contexts/RefreshContext';

// Campos leves para listagem no mapa e busca.
// Dados detalhados (história, projetos, mídia) são carregados on-demand.
const CAMPOS_LISTAGEM = [
  'id',
  'Escola',
  'Município',
  'Endereço',
  'Latitude',
  'Longitude',
  'Terra Indigena (TI)',
  'Povos indigenas',
  'Diretoria de Ensino',
  'Modalidade de Ensino/turnos de funcionamento',
  'Numero de alunos',
  'imagem_header',
  'cards_visibilidade',
].map(f => `"${f}"`).join(', ');

export function useEscolasData() {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshKey } = useRefresh();
  const isInitialLoad = useRef(true);

  const fetchDataPoints = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('escolas_completa')
        .select(CAMPOS_LISTAGEM);
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw err;
    }
  }, []);

  const formatData = useCallback((dataPoints) => {
    if (!Array.isArray(dataPoints)) return [];
    
    const escolasSemCoordenadas = {
      vazias: [],
      invalidas: [],
      foraDosLimites: []
    };

    const formattedData = dataPoints
      .filter(e => e && typeof e === 'object' && !Array.isArray(e) && e.Escola)
      .map((e) => {
        // Registra escolas sem coordenadas para diagnóstico, mas não as descarta
        // (a busca funciona sem coordenadas; o mapa simplesmente não as plota)
        const lat = parseFloat(e.Latitude);
        const lng = parseFloat(e.Longitude);
        const hasCoords =
          e.Latitude != null && e.Longitude != null &&
          !isNaN(lat) && !isNaN(lng) &&
          lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;

        if (!hasCoords) {
          escolasSemCoordenadas.vazias.push({
            id: e.id, nome: e.Escola, municipio: e["Município"],
            problema: "Coordenadas ausentes ou inválidas"
          });
        }

        return mapEscolaData(e);
      })
      .filter(ponto => ponto !== null);

    return formattedData;
  }, []);

  useEffect(() => {
    async function initialize() {
      if (isInitialLoad.current) {
        setLoading(true);
      }
      setError(null);
      try {
        let data = await fetchDataPoints();
        data = formatData(data);
        setDataPoints(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
        isInitialLoad.current = false;
      }
    }
    initialize();
  }, [fetchDataPoints, formatData, refreshKey]);

  return { dataPoints, loading, error };
}