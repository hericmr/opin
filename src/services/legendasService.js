import { supabase } from '../supabaseClient';

/**
 * Serviço para gerenciar legendas de fotos
 */

/**
 * Testar se a tabela legendas_fotos existe e está acessível
 * @returns {Promise<boolean>} True se a tabela existe
 */
export const testLegendasTable = async () => {
  try {
    const { data, error } = await supabase
      .from('legendas_fotos')
      .select('count')
      .limit(1);
    
    if (error) {
      console.warn('Tabela legendas_fotos não encontrada ou sem permissão:', error.message);
      return false;
    }
    
    console.log('Tabela legendas_fotos acessível');
    return true;
  } catch (error) {
    console.warn('Erro ao testar tabela legendas_fotos:', error.message);
    return false;
  }
};

/**
 * Buscar legenda por URL da imagem
 * @param {string} imageUrl - URL da imagem
 * @param {number} escolaId - ID da escola
 * @param {string} categoria - Categoria da imagem (professor, escola, etc.)
 * @returns {Promise<Object|null>} Legenda encontrada ou null
 */
export const getLegendaByImageUrl = async (imageUrl, escolaId, categoria = 'professor') => {
  try {
    const { data, error } = await supabase
      .from('legendas_fotos')
      .select('*')
      .eq('imagem_url', imageUrl)
      .eq('escola_id', escolaId)
      .eq('categoria', categoria)
      .single();

    if (error) {
      // Se não encontrar, retorna null (não é erro)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.warn('Erro ao buscar legenda:', error.message);
    return null;
  }
};

/**
 * Adicionar nova legenda de foto
 * @param {Object} legendaData - Dados da legenda
 * @returns {Promise<Object>} Legenda criada
 */
export const addLegendaFoto = async (legendaData) => {
  try {
    const { data, error } = await supabase
      .from('legendas_fotos')
      .insert([legendaData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao adicionar legenda:', error);
    throw error;
  }
};

/**
 * Atualizar legenda de foto existente
 * @param {number} legendaId - ID da legenda
 * @param {Object} updateData - Dados para atualizar
 * @returns {Promise<Object>} Legenda atualizada
 */
export const updateLegendaFoto = async (legendaId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('legendas_fotos')
      .update(updateData)
      .eq('id', legendaId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar legenda:', error);
    throw error;
  }
};

/**
 * Deletar legenda de foto
 * @param {number} legendaId - ID da legenda
 * @returns {Promise<boolean>} True se deletado com sucesso
 */
export const deleteLegendaFoto = async (legendaId) => {
  try {
    const { error } = await supabase
      .from('legendas_fotos')
      .delete()
      .eq('id', legendaId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar legenda:', error);
    throw error;
  }
};

/**
 * Buscar todas as legendas de uma escola
 * @param {number} escolaId - ID da escola
 * @param {string} categoria - Categoria das imagens (opcional)
 * @returns {Promise<Array>} Lista de legendas
 */
export const getLegendasByEscola = async (escolaId, categoria = null) => {
  try {
    let query = supabase
      .from('legendas_fotos')
      .select('*')
      .eq('escola_id', escolaId);

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar legendas da escola:', error);
    throw error;
  }
};

/**
 * Buscar título personalizado de vídeo por URL
 * @param {string} videoUrl - URL do vídeo
 * @param {number} escolaId - ID da escola
 * @returns {Promise<Object|null>} Título encontrado ou null
 */
export const getTituloByVideoUrl = async (videoUrl, escolaId) => {
  try {
    const { data, error } = await supabase
      .from('legendas_fotos')
      .select('*')
      .eq('imagem_url', videoUrl)
      .eq('escola_id', escolaId)
      .eq('categoria', 'video')
      .single();

    if (error) {
      // Se não encontrar, retorna null (não é erro)
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.warn('Erro ao buscar título do vídeo:', error.message);
    return null;
  }
};

export default {
  testLegendasTable,
  getLegendaByImageUrl,
  addLegendaFoto,
  updateLegendaFoto,
  deleteLegendaFoto,
  getLegendasByEscola,
  getTituloByVideoUrl
};
