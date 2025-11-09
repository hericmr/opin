import { useState, useEffect } from 'react';
import csvDataService from '../services/csvDataService';
import logger from '../utils/logger';

/**
 * Hook para carregar dados dos gráficos do Dashboard
 * 
 * @returns {Object} Objeto com dados dos gráficos, loading e error
 */
export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    alunosPorEscola: [],
    distribuicaoAlunos: [],
    distribuicaoAlunosModalidade: [],
    equipamentos: [],
    escolasPorDiretoria: [],
    tiposEnsino: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          alunosPorEscola,
          distribuicaoAlunos,
          distribuicaoAlunosModalidade,
          equipamentos,
          escolasPorDiretoria,
          tiposEnsino
        ] = await Promise.all([
          csvDataService.getAlunosPorEscolaData().catch(err => {
            logger.error('Erro ao carregar alunos por escola:', err);
            return [];
          }),
          csvDataService.getDistribuicaoAlunosData().catch(err => {
            logger.error('Erro ao carregar distribuição de alunos:', err);
            return [];
          }),
          csvDataService.getDistribuicaoAlunosModalidadeData().catch(err => {
            logger.error('Erro ao carregar distribuição de alunos por modalidade:', err);
            return [];
          }),
          csvDataService.getEquipamentosData().catch(err => {
            logger.error('Erro ao carregar equipamentos:', err);
            return [];
          }),
          csvDataService.getEscolasPorDiretoriaData().catch(err => {
            logger.error('Erro ao carregar escolas por diretoria:', err);
            return [];
          }),
          csvDataService.getTiposEnsinoData().catch(err => {
            logger.error('Erro ao carregar tipos de ensino:', err);
            return [];
          })
        ]);

        setData({
          alunosPorEscola,
          distribuicaoAlunos,
          distribuicaoAlunosModalidade,
          equipamentos,
          escolasPorDiretoria,
          tiposEnsino
        });
      } catch (err) {
        logger.error('Erro geral ao carregar dados:', err);
        setError(`Erro ao carregar os dados dos gráficos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};

