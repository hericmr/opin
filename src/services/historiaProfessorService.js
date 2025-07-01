import { supabase } from '../supabaseClient';

// Configurações para imagens das histórias do professor
const HISTORIA_PROFESSOR_CONFIG = {
  BUCKET_NAME: 'historia-professor-imagens',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_HISTORIA: 1,
  MIN_DIMENSIONS: { width: 200, height: 200 }
};

/**
 * Valida um arquivo de imagem
 * @param {File} file - Arquivo a ser validado
 * @returns {Object} Resultado da validação
 */
const validateImageFile = (file) => {
  // Verificar tipo MIME
  if (!HISTORIA_PROFESSOR_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não suportado. Use apenas: ${HISTORIA_PROFESSOR_CONFIG.ALLOWED_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}`
    };
  }

  // Verificar tamanho
  if (file.size > HISTORIA_PROFESSOR_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${HISTORIA_PROFESSOR_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Verificar extensão
  const extension = file.name.split('.').pop().toLowerCase();
  const allowedExtensions = HISTORIA_PROFESSOR_CONFIG.ALLOWED_TYPES.map(t => t.split('/')[1]);
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Extensão não permitida. Use apenas: ${allowedExtensions.join(', ')}`
    };
  }

  return { isValid: true };
};

/**
 * Valida dimensões da imagem (opcional)
 * @param {File} file - Arquivo de imagem
 * @returns {Promise<boolean>} Se as dimensões são válidas
 */
const validateImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid = img.width >= HISTORIA_PROFESSOR_CONFIG.MIN_DIMENSIONS.width &&
                     img.height >= HISTORIA_PROFESSOR_CONFIG.MIN_DIMENSIONS.height;
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Gera nome único para o arquivo
 * @param {File} file - Arquivo
 * @param {number} escolaId - ID da escola
 * @param {number} historiaId - ID da história
 * @returns {string} Nome único do arquivo
 */
const generateUniqueFileName = (file, escolaId, historiaId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop().toLowerCase();
  return `historia_${historiaId}_${timestamp}_${random}.${extension}`;
};

/**
 * Buscar todas as histórias do professor de uma escola
 * @param {number} escolaId - ID da escola
 * @returns {Promise<Array>} Lista de histórias
 */
export const getHistoriasProfessor = async (escolaId) => {
  try {
    const { data, error } = await supabase
      .from('historias_professor')
      .select('*')
      .eq('escola_id', escolaId)
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Adicionar URLs públicas das imagens
    const historiasComImagens = data.map((historia) => {
      if (historia.imagem_url) {
        try {
          const { data: { publicUrl } } = supabase.storage
            .from(HISTORIA_PROFESSOR_CONFIG.BUCKET_NAME)
            .getPublicUrl(historia.imagem_url);

          return { ...historia, imagem_public_url: publicUrl };
        } catch (err) {
          return { ...historia, imagem_public_url: null, urlError: err.message };
        }
      }
      return historia;
    });

    return historiasComImagens;

  } catch (error) {
    console.error('Erro ao buscar histórias do professor:', error);
    throw error;
  }
};

/**
 * Criar nova história do professor
 * @param {Object} historiaData - Dados da história
 * @returns {Promise<Object>} História criada
 */
export const createHistoriaProfessor = async (historiaData) => {
  try {
    const { data, error } = await supabase
      .from('historias_professor')
      .insert([{
        escola_id: historiaData.escola_id,
        nome_professor: historiaData.nome_professor || null,
        historia: historiaData.historia,
        ordem: historiaData.ordem || 1,
        ativo: historiaData.ativo !== false
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;

  } catch (error) {
    console.error('Erro ao criar história do professor:', error);
    throw error;
  }
};

/**
 * Atualizar história do professor
 * @param {number} historiaId - ID da história
 * @param {Object} historiaData - Dados atualizados
 * @returns {Promise<Object>} História atualizada
 */
export const updateHistoriaProfessor = async (historiaId, historiaData) => {
  try {
    const { data, error } = await supabase
      .from('historias_professor')
      .update({
        nome_professor: historiaData.nome_professor,
        historia: historiaData.historia,
        ordem: historiaData.ordem,
        ativo: historiaData.ativo,
        updated_at: new Date().toISOString()
      })
      .eq('id', historiaId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;

  } catch (error) {
    console.error('Erro ao atualizar história do professor:', error);
    throw error;
  }
};

/**
 * Deletar história do professor
 * @param {number} historiaId - ID da história
 * @returns {Promise<void>}
 */
export const deleteHistoriaProfessor = async (historiaId) => {
  try {
    // Deletar a história
    const { error: deleteError } = await supabase
      .from('historias_professor')
      .delete()
      .eq('id', historiaId);

    if (deleteError) {
      throw deleteError;
    }
  } catch (error) {
    console.error('Erro ao deletar história do professor:', error);
    throw error;
  }
};

/**
 * Upload de imagem para uma história do professor
 * @param {File} file - Arquivo de imagem
 * @param {number} escolaId - ID da escola
 * @param {number} historiaId - ID da história
 * @param {string} descricao - Descrição da imagem
 * @returns {Promise<Object>} Dados da imagem salva
 */
export const uploadHistoriaProfessorImage = async (file, escolaId, historiaId, descricao = '') => {
  try {
    // Validar arquivo
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Validar dimensões (opcional)
    const hasValidDimensions = await validateImageDimensions(file);
    if (!hasValidDimensions) {
      console.warn('Imagem com dimensões menores que o recomendado');
    }

    // Gerar nome único
    const fileName = generateUniqueFileName(file, escolaId, historiaId);
    const filePath = `${escolaId}/${fileName}`;

    // Upload ao bucket
    const { error: uploadError } = await supabase.storage
      .from(HISTORIA_PROFESSOR_CONFIG.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(HISTORIA_PROFESSOR_CONFIG.BUCKET_NAME)
      .getPublicUrl(filePath);

    // Atualizar a história com a URL da imagem
    const { data: historia, error: updateError } = await supabase
      .from('historias_professor')
      .update({
        descricao_imagem: descricao.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', historiaId)
      .select()
      .single();

    if (updateError) {
      // Se falhar ao atualizar, deletar o arquivo
      await supabase.storage
        .from(HISTORIA_PROFESSOR_CONFIG.BUCKET_NAME)
        .remove([filePath]);
      throw new Error(`Erro ao salvar metadados: ${updateError.message}`);
    }

    return {
      id: historia.id,
      descricao_imagem: historia.descricao_imagem
    };

  } catch (error) {
    console.error('Erro no upload da imagem da história do professor:', error);
    throw error;
  }
};

/**
 * Deletar imagem de uma história do professor
 * @param {number} historiaId - ID da história
 * @returns {Promise<void>}
 */
export const deleteHistoriaProfessorImage = async (historiaId) => {
  try {
    // Buscar a história para obter a URL da imagem
    const { data: historia, error: fetchError } = await supabase
      .from('historias_professor')
      .select('imagem_url')
      .eq('id', historiaId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!historia.imagem_url) {
      return; // Não há imagem para deletar
    }

    // Atualizar a história removendo a referência da imagem
    const { error: updateError } = await supabase
      .from('historias_professor')
      .update({
        descricao_imagem: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', historiaId);

    if (updateError) {
      throw updateError;
    }

    // Deletar arquivo do storage
    const { error: storageError } = await supabase.storage
      .from(HISTORIA_PROFESSOR_CONFIG.BUCKET_NAME)
      .remove([historia.imagem_url]);

    if (storageError) {
      console.warn('Erro ao deletar imagem do storage:', storageError);
    }

  } catch (error) {
    console.error('Erro ao deletar imagem da história do professor:', error);
    throw error;
  }
};

/**
 * Migrar dados existentes da tabela escolas_completa
 * @returns {Promise<Object>} Resultado da migração
 */
export const migrarDadosExistentes = async () => {
  try {
    // Buscar escolas com história do professor
    const { data: escolas, error: fetchError } = await supabase
      .from('escolas_completa')
      .select('id, historia_do_prof')
      .not('historia_do_prof', 'is', null)
      .neq('historia_do_prof', '');

    if (fetchError) {
      throw fetchError;
    }

    if (!escolas || escolas.length === 0) {
      return { migradas: 0, mensagem: 'Nenhuma história para migrar' };
    }

    // Inserir histórias na nova tabela
    const historiasParaInserir = escolas.map(escola => ({
      escola_id: escola.id,
      historia: escola.historia_do_prof,
      ordem: 1,
      ativo: true,
      created_at: new Date().toISOString()
    }));

    const { data: historiasInseridas, error: insertError } = await supabase
      .from('historias_professor')
      .insert(historiasParaInserir)
      .select();

    if (insertError) {
      throw insertError;
    }

    return {
      migradas: historiasInseridas.length,
      mensagem: `${historiasInseridas.length} histórias migradas com sucesso`
    };

  } catch (error) {
    console.error('Erro na migração de dados:', error);
    throw error;
  }
};

/**
 * Verificar se uma escola tem histórias do professor
 * @param {number} escolaId - ID da escola
 * @returns {Promise<boolean>} Se tem histórias
 */
export const escolaTemHistoriasProfessor = async (escolaId) => {
  try {
    const { count, error } = await supabase
      .from('historias_professor')
      .select('*', { count: 'exact', head: true })
      .eq('escola_id', escolaId)
      .eq('ativo', true);

    if (error) {
      throw error;
    }

    return (count || 0) > 0;

  } catch (error) {
    console.error('Erro ao verificar histórias do professor:', error);
    return false;
  }
}; 