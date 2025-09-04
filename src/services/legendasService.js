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
    console.log('=== DEBUG: addLegendaFoto ===');
    console.log('Dados recebidos:', legenda);
    
    // Remover tipo_foto se a coluna não existir no banco
    const legendaData = { ...legenda };
    console.log('Dados iniciais:', legendaData);
    
    // Limpar campos vazios que podem causar problemas com o banco
    Object.keys(legendaData).forEach(key => {
      if (legendaData[key] === '' || legendaData[key] === null) {
        delete legendaData[key];
      }
    });
    
    // Verificar se a coluna tipo_foto existe antes de incluí-la
    try {
      console.log('Verificando se a coluna tipo_foto existe...');
      // Tentar uma consulta simples para verificar se a coluna existe
      const { data: testData, error: testError } = await supabase
        .from('legendas_fotos')
        .select('tipo_foto')
        .limit(1);
      
      console.log('Teste da coluna tipo_foto:', { testData, testError });
      
      if (testError && testError.code === '42703') {
        // Se a coluna não existe, remover do objeto
        console.warn('Coluna tipo_foto não encontrada. Removendo do objeto de inserção.');
        delete legendaData.tipo_foto;
      }
    } catch (columnError) {
      // Se a coluna não existe, remover do objeto
      console.warn('Coluna tipo_foto não encontrada. Removendo do objeto de inserção.');
      delete legendaData.tipo_foto;
    }

    console.log('Dados finais para inserção:', legendaData);
    
    const { data, error } = await supabase
      .from('legendas_fotos')
      .insert([legendaData])
      .select()
      .single();

    console.log('Resposta do Supabase:', { data, error });

    if (error) {
      console.error('Erro do Supabase:', error);
      throw error;
    }

    console.log('Legenda criada com sucesso:', data);
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
    console.log('=== DEBUG: updateLegendaFoto ===');
    console.log('ID da legenda:', id);
    console.log('Dados para atualização:', updates);
    
    // Limpar campos vazios que podem causar problemas com o banco
    const cleanUpdates = { ...updates };
    Object.keys(cleanUpdates).forEach(key => {
      if (cleanUpdates[key] === '' || cleanUpdates[key] === null) {
        delete cleanUpdates[key];
      }
    });
    
    console.log('Dados limpos para atualização:', cleanUpdates);
    
    const { data, error } = await supabase
      .from('legendas_fotos')
      .update(cleanUpdates)
      .eq('id', id)
      .select()
      .single();

    console.log('Resposta do Supabase:', { data, error });

    if (error) {
      console.error('Erro do Supabase ao atualizar:', error);
      throw error;
    }

    console.log('Legenda atualizada com sucesso:', data);
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
    console.log('getLegendaByImageUrl chamada com:', { imagemUrl, escolaId, tipoFoto });
    
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
    console.log('Busca exata resultou em:', { data, error });

    // Se não encontrou, tenta buscar por finalização
    if ((error && error.code === 'PGRST116') || !data) {
      console.log('Tentando busca por finalização...');
      // Busca por finalização (ilike)
      const caminhoRelativo = imagemUrl.split('/').slice(-2).join('/'); // ex: 20/2.png
      console.log('Caminho relativo extraído:', caminhoRelativo);
      
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
      console.log('Busca por finalização resultou em:', { data2, error2 });
      
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

/**
 * Função de teste para verificar a estrutura da tabela legendas_fotos
 * @returns {Promise<void>}
 */
export const testLegendasTable = async () => {
  try {
    console.log('=== TESTE: Verificando estrutura da tabela legendas_fotos ===');
    
    // Teste 1: Verificar se a tabela existe
    const { data: tableData, error: tableError } = await supabase
      .from('legendas_fotos')
      .select('*')
      .limit(1);
    
    console.log('Teste 1 - Tabela existe:', { tableData, tableError });
    
    if (tableError) {
      console.error('❌ ERRO: Tabela legendas_fotos não existe ou não está acessível:', tableError);
      return;
    }
    
    // Teste 2: Verificar estrutura da tabela
    const { data: structureData, error: structureError } = await supabase
      .from('legendas_fotos')
      .select('id, escola_id, imagem_url, legenda, descricao_detalhada, autor_foto, data_foto, categoria, ativo, created_at, updated_at')
      .limit(1);
    
    console.log('Teste 2 - Estrutura da tabela:', { structureData, structureError });
    
    if (structureError) {
      console.error('❌ ERRO: Problema com estrutura da tabela:', structureError);
    } else {
      console.log('✅ Estrutura básica da tabela está OK');
    }
    
    // Teste 3: Verificar se a coluna tipo_foto existe
    try {
      const { data: tipoData, error: tipoError } = await supabase
        .from('legendas_fotos')
        .select('tipo_foto')
        .limit(1);
      
      console.log('Teste 3 - Coluna tipo_foto:', { tipoData, tipoError });
      
      if (tipoError && tipoError.code === '42703') {
        console.log('⚠️ AVISO: Coluna tipo_foto não existe na tabela');
      } else if (tipoError) {
        console.error('❌ ERRO: Problema com coluna tipo_foto:', tipoError);
      } else {
        console.log('✅ Coluna tipo_foto existe');
      }
    } catch (tipoError) {
      console.log('⚠️ AVISO: Coluna tipo_foto não existe na tabela');
    }
    
    // Teste 4: Tentar inserir um registro de teste
    console.log('Teste 4 - Testando inserção...');
    const testRecord = {
      escola_id: 999999, // ID que não existe
      imagem_url: 'test/test.jpg',
      legenda: 'Teste de legenda',
      descricao_detalhada: 'Descrição de teste',
      autor_foto: 'Teste',
      data_foto: '2024-01-01',
      categoria: 'teste',
      ativo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('legendas_fotos')
        .insert([testRecord])
        .select()
        .single();
      
      console.log('Teste 4 - Inserção de teste:', { insertData, insertError });
      
      if (insertError) {
        console.error('❌ ERRO: Problema com inserção:', insertError);
      } else {
        console.log('✅ Inserção funcionando - removendo registro de teste...');
        
        // Remover o registro de teste
        const { error: deleteError } = await supabase
          .from('legendas_fotos')
          .delete()
          .eq('id', insertData.id);
        
        if (deleteError) {
          console.error('⚠️ AVISO: Não foi possível remover registro de teste:', deleteError);
        } else {
          console.log('✅ Registro de teste removido com sucesso');
        }
      }
    } catch (insertError) {
      console.error('❌ ERRO: Falha na inserção de teste:', insertError);
    }
    
    console.log('=== FIM DO TESTE ===');
    
  } catch (error) {
    console.error('❌ ERRO GERAL no teste da tabela:', error);
  }
}; 
 