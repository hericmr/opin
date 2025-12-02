import { supabase } from '../dbClient';
import logger from '../utils/logger';

/**
 * Serviço para gerenciar legendas de fotos
 */

/**
 * Testar se a tabela legendas_fotos existe e está acessível
 * @returns {Promise<boolean>} True se a tabela existe
 */
export const testLegendasTable = async () => {
  try {
    const { error } = await supabase
      .from('legendas_fotos')
      .select('count')
      .limit(1);
    
    if (error) {
      logger.warn('Tabela legendas_fotos não encontrada ou sem permissão:', error.message);
      return false;
    }
    
    logger.debug('Tabela legendas_fotos acessível');
    return true;
  } catch (error) {
    logger.warn('Erro ao testar tabela legendas_fotos:', error.message);
    return false;
  }
};

/**
 * Buscar legenda por URL da imagem (todos os atributos opcionais)
 * @param {string} imageUrl - URL da imagem
 * @param {number} escolaId - ID da escola
 * @param {Object} options - Opções de busca (todos opcionais)
 * @param {string} options.categoria - Categoria da imagem
 * @param {string} options.tipo_foto - Tipo da foto
 * @param {boolean} options.ativo - Se deve buscar apenas ativas
 * @returns {Promise<Object|null>} Legenda encontrada ou null
 */
export const getLegendaByImageUrl = async (imageUrl, escolaId, options = {}) => {
  try {
    let query = supabase
      .from('legendas_fotos')
      .select('*')
      .eq('imagem_url', imageUrl)
      .eq('escola_id', escolaId);

    // Aplicar filtros opcionais
    if (options.ativo !== false) { // Por padrão, busca apenas ativas
      query = query.eq('ativo', true);
    }
    
    if (options.categoria) {
      query = query.eq('categoria', options.categoria);
    }
    
    if (options.tipo_foto) {
      query = query.eq('tipo_foto', options.tipo_foto);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      logger.warn('Erro ao buscar legenda:', error.message);
      return null;
    }

    // Retorna a primeira legenda encontrada (mais recente)
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    logger.warn('Erro ao buscar legenda:', error.message);
    return null;
  }
};

/**
 * Buscar legenda por URL da imagem (busca flexível com múltiplas estratégias)
 * @param {string} imageUrl - URL da imagem
 * @param {number} escolaId - ID da escola
 * @param {Object} preferencias - Preferências de busca (todos opcionais)
 * @param {string} preferencias.categoria - Categoria preferida
 * @param {string} preferencias.tipo_foto - Tipo de foto preferido
 * @returns {Promise<Object|null>} Legenda encontrada ou null
 */
export const getLegendaByImageUrlFlexivel = async (imageUrl, escolaId, preferencias = {}) => {
  try {
    logger.debug(`🔍 Buscando legenda flexível para: ${imageUrl} (escola: ${escolaId})`);
    
    // Estratégia 1: Busca com preferências específicas
    if (preferencias.categoria || preferencias.tipo_foto) {
      logger.debug('  📋 Tentativa 1: Busca com preferências específicas');
      const legenda = await getLegendaByImageUrl(imageUrl, escolaId, preferencias);
      if (legenda) {
        logger.debug('  ✅ Encontrada com preferências específicas');
        return legenda;
      }
    }

    // Estratégia 2: Busca apenas por URL e escola (sem outros filtros)
    logger.debug('  📋 Tentativa 2: Busca apenas por URL e escola');
    const { data: data2, error: error2 } = await supabase
      .from('legendas_fotos')
      .select('*')
      .eq('imagem_url', imageUrl)
      .eq('escola_id', escolaId)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error2) {
      logger.warn('  ❌ Erro na busca por URL e escola:', error2.message);
    } else if (data2 && data2.length > 0) {
      logger.debug('  ✅ Encontrada por URL e escola');
      return data2[0];
    }

    // Estratégia 3: Busca incluindo legendas inativas
    logger.debug('  📋 Tentativa 3: Busca incluindo legendas inativas');
    const { data: data3, error: error3 } = await supabase
      .from('legendas_fotos')
      .select('*')
      .eq('imagem_url', imageUrl)
      .eq('escola_id', escolaId)
      .order('created_at', { ascending: false });

    if (error3) {
      logger.warn('  ❌ Erro na busca incluindo inativas:', error3.message);
    } else if (data3 && data3.length > 0) {
      logger.debug('  ✅ Encontrada incluindo legendas inativas');
      return data3[0];
    }

    // Estratégia 4: Busca por nome do arquivo (sem caminho completo)
    const nomeArquivo = imageUrl.split('/').pop();
    logger.debug(`  📋 Tentativa 4: Busca por nome do arquivo: ${nomeArquivo}`);
    const { data: data4, error: error4 } = await supabase
      .from('legendas_fotos')
      .select('*')
      .ilike('imagem_url', `%${nomeArquivo}`)
      .eq('escola_id', escolaId)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error4) {
      logger.warn('  ❌ Erro na busca por nome do arquivo:', error4.message);
    } else if (data4 && data4.length > 0) {
      logger.debug('  ✅ Encontrada por nome do arquivo');
      return data4[0];
    }

    logger.debug('  ❌ Nenhuma legenda encontrada com todas as estratégias');
    return null;

  } catch (error) {
    logger.warn('Erro ao buscar legenda flexível:', error.message);
    return null;
  }
};

/**
 * Buscar legenda por URL da imagem (sem filtro de categoria) - MANTIDA PARA COMPATIBILIDADE
 * @param {string} imageUrl - URL da imagem
 * @param {number} escolaId - ID da escola
 * @returns {Promise<Object|null>} Legenda encontrada ou null
 */
export const getLegendaByImageUrlAnyCategory = async (imageUrl, escolaId) => {
  return getLegendaByImageUrlFlexivel(imageUrl, escolaId);
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
    logger.error('Erro ao adicionar legenda:', error);
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
    logger.error('Erro ao atualizar legenda:', error);
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
    logger.error('Erro ao deletar legenda:', error);
    throw error;
  }
};

/**
 * Transferir legenda de uma URL antiga para uma nova URL (útil quando imagem é substituída)
 * @param {string} oldImageUrl - URL antiga da imagem
 * @param {string} newImageUrl - Nova URL da imagem
 * @param {number} escolaId - ID da escola
 * @param {string} tipoFoto - Tipo da foto ('escola' ou 'professor')
 * @returns {Promise<Object|null>} Legenda transferida ou null se não havia legenda
 */
export const transferLegendaToNewUrl = async (oldImageUrl, newImageUrl, escolaId, tipoFoto = 'escola') => {
  try {
    // Buscar legenda da imagem antiga
    const legenda = await getLegendaByImageUrl(oldImageUrl, escolaId, { 
      tipo_foto: tipoFoto,
      ativo: false // Buscar mesmo se inativa
    });

    if (!legenda) {
      logger.debug(`Nenhuma legenda encontrada para transferir de ${oldImageUrl} para ${newImageUrl}`);
      return null;
    }

    // Verificar se já existe legenda para a nova URL
    const existingLegenda = await getLegendaByImageUrl(newImageUrl, escolaId, { 
      tipo_foto: tipoFoto,
      ativo: false
    });

    if (existingLegenda) {
      // Se já existe, atualizar a existente com os dados da antiga (preservando ordem se existir)
      const updateData = {
        legenda: legenda.legenda || existingLegenda.legenda,
        descricao_detalhada: legenda.descricao_detalhada || existingLegenda.descricao_detalhada,
        autor_foto: legenda.autor_foto || existingLegenda.autor_foto,
        data_foto: legenda.data_foto || existingLegenda.data_foto,
        categoria: legenda.categoria || existingLegenda.categoria,
        ordem: legenda.ordem !== null && legenda.ordem !== undefined ? legenda.ordem : existingLegenda.ordem,
        ativo: true,
        updated_at: new Date().toISOString()
      };

      const updated = await updateLegendaFoto(existingLegenda.id, updateData);
      
      // Deletar a legenda antiga se for diferente
      if (legenda.id !== existingLegenda.id) {
        await deleteLegendaFoto(legenda.id);
      }

      logger.debug(`Legenda transferida e mesclada de ${oldImageUrl} para ${newImageUrl}`);
      return updated;
    } else {
      // Se não existe, atualizar a legenda antiga com a nova URL
      const updated = await updateLegendaFoto(legenda.id, {
        imagem_url: newImageUrl,
        updated_at: new Date().toISOString()
      });

      logger.debug(`Legenda transferida de ${oldImageUrl} para ${newImageUrl}`);
      return updated;
    }
  } catch (error) {
    logger.error('Erro ao transferir legenda:', error);
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
    logger.error('Erro ao buscar legendas da escola:', error);
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
    logger.warn('Erro ao buscar título do vídeo:', error.message);
    return null;
  }
};

/**
 * Atualizar ordem de uma imagem
 * @param {string} imageUrl - URL da imagem
 * @param {number} escolaId - ID da escola
 * @param {number} ordem - Nova ordem
 * @returns {Promise<Object>} Legenda atualizada
 */
export const updateImageOrder = async (imageUrl, escolaId, ordem) => {
  try {
    // Primeiro, buscar a legenda existente
    const legenda = await getLegendaByImageUrl(imageUrl, escolaId, { ativo: false });
    
    if (legenda) {
      // Se existe, atualizar apenas a ordem
      const { data, error } = await supabase
        .from('legendas_fotos')
        .update({ ordem, updated_at: new Date().toISOString() })
        .eq('id', legenda.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Se não existe, criar uma entrada básica com ordem
      // Extrair nome do arquivo para usar como legenda padrão
      const fileName = imageUrl.split('/').pop() || 'Imagem';
      const legendaPadrao = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') || 'Imagem';
      
      const { data, error } = await supabase
        .from('legendas_fotos')
        .insert([{
          escola_id: escolaId,
          imagem_url: imageUrl,
          legenda: legendaPadrao, // Valor padrão obrigatório
          ordem,
          ativo: true,
          tipo_foto: 'escola',
          categoria: 'geral',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    logger.error('Erro ao atualizar ordem da imagem:', error);
    throw error;
  }
};

/**
 * Atualizar ordem de múltiplas imagens
 * @param {Array} imageOrders - Array de objetos { imageUrl, ordem }
 * @param {number} escolaId - ID da escola
 * @returns {Promise<Array>} Legendas atualizadas
 */
export const updateMultipleImageOrders = async (imageOrders, escolaId) => {
  try {
    const updates = await Promise.all(
      imageOrders.map(({ imageUrl, ordem }) => 
        updateImageOrder(imageUrl, escolaId, ordem)
      )
    );
    return updates;
  } catch (error) {
    logger.error('Erro ao atualizar ordens das imagens:', error);
    throw error;
  }
};

/**
 * Buscar todas as legendas de uma escola ordenadas por ordem
 * @param {number} escolaId - ID da escola
 * @param {string} tipoFoto - Tipo da foto (opcional, default: 'escola')
 * @returns {Promise<Array>} Lista de legendas ordenadas
 */
export const getLegendasByEscolaOrdered = async (escolaId, tipoFoto = 'escola') => {
  try {
    const { data, error } = await supabase
      .from('legendas_fotos')
      .select('*')
      .eq('escola_id', escolaId)
      .eq('tipo_foto', tipoFoto)
      .eq('ativo', true)
      .order('ordem', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Erro ao buscar legendas ordenadas da escola:', error);
    throw error;
  }
};

const LegendasService = {
  testLegendasTable,
  getLegendaByImageUrl,
  getLegendaByImageUrlFlexivel,
  getLegendaByImageUrlAnyCategory,
  addLegendaFoto,
  updateLegendaFoto,
  deleteLegendaFoto,
  getLegendasByEscola,
  getTituloByVideoUrl,
  updateImageOrder,
  updateMultipleImageOrders,
  getLegendasByEscolaOrdered
};

export default LegendasService;
