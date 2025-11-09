import { useState, useEffect, useCallback } from 'react';
import { 
  getHistoriasProfessor, 
  createHistoriaProfessor, 
  updateHistoriaProfessor, 
  deleteHistoriaProfessor,
  uploadHistoriaProfessorImage,
  deleteHistoriaProfessorImage,
  escolaTemHistoriasProfessor
} from '../services/historiaProfessorService';
import logger from '../utils/logger';

/**
 * Hook personalizado para gerenciar histórias do professor
 * @param {number} escolaId - ID da escola
 * @returns {Object} Estado e funções para gerenciar histórias
 */
export const useHistoriasProfessor = (escolaId) => {
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temHistorias, setTemHistorias] = useState(false);

  // Carregar histórias
  const carregarHistorias = useCallback(async () => {
    if (!escolaId) {
      setHistorias([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getHistoriasProfessor(escolaId);
      setHistorias(data);
      setTemHistorias(data.length > 0);
    } catch (err) {
      logger.error('Erro ao carregar histórias do professor:', err);
      setError(err.message);
      setHistorias([]);
      setTemHistorias(false);
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  // Verificar se a escola tem histórias
  const verificarTemHistorias = useCallback(async () => {
    if (!escolaId) {
      setTemHistorias(false);
      return;
    }

    try {
      const tem = await escolaTemHistoriasProfessor(escolaId);
      setTemHistorias(tem);
    } catch (err) {
      logger.error('Erro ao verificar histórias:', err);
      setTemHistorias(false);
    }
  }, [escolaId]);

  // Criar nova história
  const criarHistoria = useCallback(async (historiaData) => {
    try {
      setError(null);
      
      const novaHistoria = await createHistoriaProfessor({
        ...historiaData,
        escola_id: escolaId
      });
      
      setHistorias(prev => [...prev, novaHistoria]);
      setTemHistorias(true);
      
      return novaHistoria;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [escolaId]);

  // Atualizar história
  const atualizarHistoria = useCallback(async (historiaId, historiaData) => {
    try {
      setError(null);
      
      const historiaAtualizada = await updateHistoriaProfessor(historiaId, historiaData);
      
      setHistorias(prev => 
        prev.map(h => h.id === historiaId ? historiaAtualizada : h)
      );
      
      return historiaAtualizada;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Deletar história
  const deletarHistoria = useCallback(async (historiaId) => {
    try {
      setError(null);
      
      await deleteHistoriaProfessor(historiaId);
      
      setHistorias(prev => prev.filter(h => h.id !== historiaId));
      
      // Verificar se ainda há histórias
      const historiasRestantes = historias.filter(h => h.id !== historiaId);
      setTemHistorias(historiasRestantes.length > 0);
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [historias]);

  // Upload de imagem
  const uploadImagem = useCallback(async (historiaId, file, descricao = '') => {
    try {
      setError(null);
      
      const resultado = await uploadHistoriaProfessorImage(file, escolaId, historiaId, descricao);
      
      // Atualizar a história com a nova imagem
      setHistorias(prev => 
        prev.map(h => 
          h.id === historiaId 
            ? { ...h, imagem_url: resultado.imagem_url, imagem_public_url: resultado.imagem_public_url, descricao_imagem: resultado.descricao_imagem }
            : h
        )
      );
      
      return resultado;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [escolaId]);

  // Deletar imagem
  const deletarImagem = useCallback(async (historiaId) => {
    try {
      setError(null);
      
      await deleteHistoriaProfessorImage(historiaId);
      
      // Remover referência da imagem da história
      setHistorias(prev => 
        prev.map(h => 
          h.id === historiaId 
            ? { ...h, imagem_url: null, imagem_public_url: null, descricao_imagem: null }
            : h
        )
      );
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Reordenar histórias
  const reordenarHistorias = useCallback(async (historiaId, direction) => {
    const historiaIndex = historias.findIndex(h => h.id === historiaId);
    if (historiaIndex === -1) return;

    const newHistorias = [...historias];
    const targetIndex = direction === 'up' ? historiaIndex - 1 : historiaIndex + 1;
    
    if (targetIndex < 0 || targetIndex >= newHistorias.length) return;

    // Trocar posições
    [newHistorias[historiaIndex], newHistorias[targetIndex]] = 
    [newHistorias[targetIndex], newHistorias[historiaIndex]];

    // Atualizar ordens
    const updates = newHistorias.map((historia, index) => ({
      id: historia.id,
      ordem: index + 1
    }));

    try {
      setError(null);
      
      // Atualizar todas as histórias com novas ordens
      for (const update of updates) {
        await updateHistoriaProfessor(update.id, { ordem: update.ordem });
      }
      
      // Atualizar estado local
      setHistorias(newHistorias.map((h, index) => ({ ...h, ordem: index + 1 })));
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [historias]);

  // Limpar erro
  const limparErro = useCallback(() => {
    setError(null);
  }, []);

  // Limpar sucesso
  const limparSucesso = useCallback(() => {
    setError(null);
  }, []);

  // Efeitos
  useEffect(() => {
    carregarHistorias();
  }, [carregarHistorias]);

  useEffect(() => {
    verificarTemHistorias();
  }, [verificarTemHistorias]);

  return {
    // Estado
    historias,
    loading,
    error,
    temHistorias,
    
    // Funções
    carregarHistorias,
    criarHistoria,
    atualizarHistoria,
    deletarHistoria,
    uploadImagem,
    deletarImagem,
    reordenarHistorias,
    limparErro,
    limparSucesso,
    
    // Utilitários
    historiasAtivas: historias.filter(h => h.ativo),
    historiasInativas: historias.filter(h => !h.ativo),
    totalHistorias: historias.length,
    temImagens: historias.some(h => h.imagem_url)
  };
}; 