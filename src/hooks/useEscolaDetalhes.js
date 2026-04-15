import logger from "../utils/logger";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../dbClient';
import { mapEscolaData } from '../utils/escolaMapper';

/**
 * Hook para carregar detalhes completos de uma escola on-demand.
 * @param {string|number} id - ID da escola
 * @returns {Object} Objeto com data, loading e error
 */
export const useEscolaDetalhes = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: rawData, error: sbError } = await supabase
        .from('escolas_completa')
        .select('*')
        .eq('id', id)
        .single();

      if (sbError) throw sbError;
      
      // Aplica o mapeamento para garantir que campos como 'numero_alunos' existam
      const mappedData = mapEscolaData(rawData);
      setData(mappedData);
    } catch (err) {
      logger.error(`Erro ao carregar detalhes da escola ${id}:`, err);
      setError(err.message || 'Erro ao carregar detalhes');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: fetchDetails };
};

export default useEscolaDetalhes;
