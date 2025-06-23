import { supabase } from '../supabaseClient';

/**
 * Buscar legendas de fotos de uma escola
 * @param {number} escolaId - ID da escola
 * @param {string} tipoFoto - 'escola' ou 'professor' (opcional, busca todas se não especificado)
 * @returns {Promise<Array>} Lista de legendas de fotos
 */
export const getLegendasFotos = async (escolaId, tipoFoto = null) => {
  try {
    let query = supabase
      .from('legendas_fotos')
      .select('*')
      .eq('escola_id', escolaId)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    // Verificar se a coluna tipo_foto existe antes de usá-la
    if (tipoFoto) {
      try {
        query = query.eq('tipo_foto', tipoFoto);
      } catch (columnError) {
        // Se a coluna não existe, ignorar o filtro por tipo
        console.warn('Coluna tipo_foto não encontrada. Ignorando filtro por tipo.');
      }
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar legendas de fotos:', error);
    throw error;
  }
};

/**
 * Adicionar legenda de foto
 * @param {Object} legenda - Dados da legenda
 * @returns {Promise<Object>} Legenda criada
 */
export const addLegendaFoto = async (legenda) => {
  try {
    // Remover tipo_foto se a coluna não existir no banco
    const legendaData = { ...legenda };
    
    // Verificar se a coluna tipo_foto existe antes de incluí-la
    try {
      // Tentar uma consulta simples para verificar se a coluna existe
      await supabase
        .from('legendas_fotos')
        .select('tipo_foto')
        .limit(1);
    } catch (columnError) {
      // Se a coluna não existe, remover do objeto
      console.warn('Coluna tipo_foto não encontrada. Removendo do objeto de inserção.');
      delete legendaData.tipo_foto;
    }

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
    console.error('Erro ao adicionar legenda de foto:', error);
    throw error;
  }
};

/**
 * Atualizar legenda de foto
 * @param {number} id - ID da legenda
 * @param {Object} updates - Dados para atualizar
 * @returns {Promise<Object>} Legenda atualizada
 */
export const updateLegendaFoto = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('legendas_fotos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro do Supabase ao atualizar:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar legenda de foto:', error);
    throw error;
  }
};

/**
 * Deletar legenda de foto (soft delete)
 * @param {number} id - ID da legenda
 * @returns {Promise<boolean>} Sucesso da operação
 */
export const deleteLegendaFoto = async (id) => {
  try {
    const { error } = await supabase
      .from('legendas_fotos')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar legenda de foto:', error);
    throw error;
  }
};

/**
 * Buscar títulos de vídeos de uma escola
 * @param {number} escolaId - ID da escola
 * @returns {Promise<Array>} Lista de títulos de vídeos
 */
export const getTitulosVideos = async (escolaId) => {
  try {
    const { data, error } = await supabase
      .from('titulos_videos')
      .select('*')
      .eq('escola_id', escolaId)
      .eq('ativo', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar títulos de vídeos:', error);
    throw error;
  }
};

/**
 * Adicionar título de vídeo
 * @param {Object} titulo - Dados do título
 * @returns {Promise<Object>} Título criado
 */
export const addTituloVideo = async (titulo) => {
  try {
    const { data, error } = await supabase
      .from('titulos_videos')
      .insert([titulo])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao adicionar título de vídeo:', error);
    throw error;
  }
};

/**
 * Atualizar título de vídeo
 * @param {number} id - ID do título
 * @param {Object} updates - Dados para atualizar
 * @returns {Promise<Object>} Título atualizado
 */
export const updateTituloVideo = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('titulos_videos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar título de vídeo:', error);
    throw error;
  }
};

/**
 * Deletar título de vídeo (soft delete)
 * @param {number} id - ID do título
 * @returns {Promise<boolean>} Sucesso da operação
 */
export const deleteTituloVideo = async (id) => {
  try {
    const { error } = await supabase
      .from('titulos_videos')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar título de vídeo:', error);
    throw error;
  }
};

/**
 * Buscar legenda de foto por URL da imagem
 * @param {string} imagemUrl - URL da imagem
 * @param {number} escolaId - ID da escola
 * @param {string} tipoFoto - 'escola' ou 'professor' (opcional)
 * @returns {Promise<Object|null>} Legenda encontrada ou null
 */
export const getLegendaByImageUrl = async (imagemUrl, escolaId, tipoFoto = null) => {
  try {
    // 1. Tenta buscar por igualdade exata
    let query = supabase
      .from('legendas_fotos')
      .select('*')
      .eq('imagem_url', imagemUrl)
      .eq('escola_id', escolaId)
      .eq('ativo', true);

    if (tipoFoto) {
      try {
        query = query.eq('tipo_foto', tipoFoto);
      } catch (columnError) {
        console.warn('Coluna tipo_foto não encontrada. Ignorando filtro por tipo.');
      }
    }

    let { data, error } = await query.single();

    // Se não encontrou, tenta buscar por finalização
    if ((error && error.code === 'PGRST116') || !data) {
      // Busca por finalização (ilike)
      const caminhoRelativo = imagemUrl.split('/').slice(-2).join('/'); // ex: 20/2.png
      let query2 = supabase
        .from('legendas_fotos')
        .select('*')
        .ilike('imagem_url', `%/${caminhoRelativo}`)
        .eq('escola_id', escolaId)
        .eq('ativo', true);

      if (tipoFoto) {
        try {
          query2 = query2.eq('tipo_foto', tipoFoto);
        } catch (columnError) {
          // Se a coluna não existe, ignora
        }
      }

      const { data: data2, error: error2 } = await query2.single();
      if (!error2 && data2) {
        return data2;
      }
    }

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Erro ao buscar legenda por URL:', error);
    return null;
  }
};

/**
 * Buscar título de vídeo por URL do vídeo
 * @param {string} videoUrl - URL do vídeo
 * @param {number} escolaId - ID da escola
 * @returns {Promise<Object|null>} Título encontrado ou null
 */
export const getTituloByVideoUrl = async (videoUrl, escolaId) => {
  try {
    const { data, error } = await supabase
      .from('titulos_videos')
      .select('*')
      .eq('video_url', videoUrl)
      .eq('escola_id', escolaId)
      .eq('ativo', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Erro ao buscar título por URL:', error);
    return null;
  }
};

/**
 * Migrar dados existentes de imagens para legendas
 * @param {number} escolaId - ID da escola
 * @param {string} tipoFoto - 'escola' ou 'professor'
 * @returns {Promise<Array>} Legendas migradas
 */
export const migrarLegendasExistentes = async (escolaId, tipoFoto = 'escola') => {
  try {
    let imagens = [];
    
    if (tipoFoto === 'escola') {
      // Buscar imagens existentes da tabela imagens_escola
      const { data, error } = await supabase
        .from('imagens_escola')
        .select('*')
        .eq('escola_id', escolaId)
        .eq('ativo', true);

      if (error) {
        throw error;
      }
      imagens = data || [];
    } else if (tipoFoto === 'professor') {
      // Buscar imagens dos professores do bucket
      const { data, error } = await supabase.storage
        .from('imagens-professores')
        .list(`${escolaId}/`);

      if (error) {
        throw error;
      }
      
      imagens = (data || []).map(file => ({
        url: `${escolaId}/${file.name}`,
        descricao: `Imagem do professor - ${file.name}`,
        created_at: file.created_at
      }));
    }

    const legendasMigradas = [];

    for (const imagem of imagens) {
      // Verificar se já existe legenda para esta imagem
      const legendaExistente = await getLegendaByImageUrl(imagem.url, escolaId, tipoFoto);
      
      if (!legendaExistente) {
        // Criar nova legenda
        const novaLegenda = await addLegendaFoto({
          escola_id: escolaId,
          imagem_url: imagem.url,
          legenda: imagem.descricao || `Imagem da ${tipoFoto}`,
          descricao_detalhada: imagem.descricao,
          categoria: 'geral',
          tipo_foto: tipoFoto,
          ativo: true
        });
        
        legendasMigradas.push(novaLegenda);
      }
    }

    return legendasMigradas;
  } catch (error) {
    console.error('Erro ao migrar legendas existentes:', error);
    throw error;
  }
};

/**
 * Migrar dados existentes de vídeos para títulos
 * @param {number} escolaId - ID da escola
 * @param {string} videoUrl - URL do vídeo
 * @returns {Promise<Object|null>} Título migrado
 */
export const migrarTituloExistente = async (escolaId, videoUrl) => {
  try {
    if (!videoUrl) return null;

    // Verificar se já existe título para este vídeo
    const tituloExistente = await getTituloByVideoUrl(videoUrl, escolaId);
    
    if (!tituloExistente) {
      // Determinar plataforma
      let plataforma = 'outro';
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        plataforma = 'youtube';
      } else if (videoUrl.includes('vimeo.com')) {
        plataforma = 'vimeo';
      }

      // Criar novo título
      const novoTitulo = await addTituloVideo({
        escola_id: escolaId,
        video_url: videoUrl,
        titulo: `Vídeo da Escola - ${plataforma.charAt(0).toUpperCase() + plataforma.slice(1)}`,
        descricao: 'Vídeo relacionado à escola indígena',
        plataforma: plataforma,
        categoria: 'geral',
        ativo: true
      });
      
      return novoTitulo;
    }

    return tituloExistente;
  } catch (error) {
    console.error('Erro ao migrar título existente:', error);
    throw error;
  }
}; 
 