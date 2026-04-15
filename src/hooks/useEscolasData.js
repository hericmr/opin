import { useState, useEffect, useCallback } from 'react';
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
        // Validação básica de coordenadas para o mapa
        const infoEscola = {
          id: e.id,
          nome: e.Escola,
          municipio: e["Município"]
        };

        if (e.Latitude === null || e.Latitude === undefined || 
            e.Longitude === null || e.Longitude === undefined) {
          escolasSemCoordenadas.vazias.push({ ...infoEscola, problema: "Coordenadas vazias" });
          return null;
        }

        const latitude = parseFloat(e.Latitude);
        const longitude = parseFloat(e.Longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          escolasSemCoordenadas.invalidas.push({ ...infoEscola, problema: "Coordenadas inválidas" });
          return null;
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          escolasSemCoordenadas.foraDosLimites.push({ ...infoEscola, problema: "Coordenadas fora dos limites" });
          return null;
        }

        // Usa o mapper centralizado para garantir consistência
        return mapEscolaData(e);
      })
      .filter(ponto => ponto !== null);

    return formattedData;
  }, []);

  useEffect(() => {
    async function initialize() {
      setLoading(true);
      setError(null);
      try {
        let data = await fetchDataPoints();
        data = formatData(data);
        setDataPoints(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, [fetchDataPoints, formatData, refreshKey]);

  return { dataPoints, loading, error };
}