import { supabase } from '../supabaseClient';

// Configurações para imagens das escolas
const ESCOLA_IMAGE_CONFIG = {
  BUCKET_NAME: 'imagens-das-escolas',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_SCHOOL: 10,
  MIN_DIMENSIONS: { width: 200, height: 200 }
};

// Configurações para imagens dos professores
const PROFESSOR_IMAGE_CONFIG = {
  BUCKET_NAME: 'imagens-professores',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_SCHOOL: 5,
  MIN_DIMENSIONS: { width: 200, height: 200 }
};

/**
 * Valida um arquivo de imagem
 * @param {File} file - Arquivo a ser validado
 * @param {Object} config - Configuração de validação
 * @returns {Object} Resultado da validação
 */
const validateImageFile = (file, config) => {
  // Verificar tipo MIME
  if (!config.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de arquivo não suportado. Use apenas: ${config.ALLOWED_TYPES.map(t => t.split('/')[1].toUpperCase()).join(', ')}`
    };
  }

  // Verificar tamanho
  if (file.size > config.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${config.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Verificar extensão
  const extension = file.name.split('.').pop().toLowerCase();
  const allowedExtensions = config.ALLOWED_TYPES.map(t => t.split('/')[1]);
  if (!allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Extensão não permitida. Use apenas: ${allowedExtensions.join(', ')}`
    };
  }

  return { isValid: true };
};

/**
 * Gera nome único para o arquivo
 * @param {File} file - Arquivo
 * @param {number} escolaId - ID da escola
 * @returns {string} Nome único do arquivo
 */
const generateUniqueFileName = (file, escolaId) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop().toLowerCase();
  return `${escolaId}_${timestamp}_${random}.${extension}`;
};

/**
 * Verifica se a imagem tem as dimensões mínimas
 * @param {File} file - Arquivo de imagem
 * @param {Object} config - Configuração com dimensões mínimas
 * @returns {Promise<boolean>} Se a imagem tem dimensões válidas
 */
const validateImageDimensions = async (file, config) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isValid = img.width >= config.MIN_DIMENSIONS.width && 
                     img.height >= config.MIN_DIMENSIONS.height;
      resolve(isValid);
    };
    img.onerror = () => resolve(false);
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Upload de imagem da escola
 * @param {File} file - Arquivo de imagem
 * @param {number} escolaId - ID da escola
 * @param {string} descricao - Descrição da imagem
 * @returns {Promise<Object>} Dados da imagem salva
 */
export const uploadEscolaImage = async (file, escolaId, descricao = '') => {
  try {
    // Validar arquivo
    const validation = validateImageFile(file, ESCOLA_IMAGE_CONFIG);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Validar dimensões (opcional)
    const hasValidDimensions = await validateImageDimensions(file, ESCOLA_IMAGE_CONFIG);
    if (!hasValidDimensions) {
      console.warn('Imagem com dimensões menores que o recomendado');
    }

    // Gerar nome único
    const fileName = generateUniqueFileName(file, escolaId);
    const filePath = `${escolaId}/${fileName}`;

    // Upload ao bucket
    const { error: uploadError } = await supabase.storage
      .from(ESCOLA_IMAGE_CONFIG.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(ESCOLA_IMAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(filePath);

    // Inserir metadados na tabela
    const { data: metadata, error: metadataError } = await supabase
      .from('imagens_escola')
      .insert([{
        escola_id: escolaId,
        url: filePath,
        descricao: descricao.trim() || `Imagem da escola ${escolaId}`
      }])
      .select()
      .single();

    if (metadataError) {
      // Se falhar ao inserir metadados, deletar o arquivo
      await supabase.storage
        .from(ESCOLA_IMAGE_CONFIG.BUCKET_NAME)
        .remove([filePath]);
      throw new Error(`Erro ao salvar metadados: ${metadataError.message}`);
    }

    return {
      id: metadata.id,
      url: filePath,
      publicUrl,
      descricao: metadata.descricao,
      created_at: metadata.created_at
    };

  } catch (error) {
    console.error('Erro no upload da imagem da escola:', error);
    throw error;
  }
};

/**
 * Upload de imagem do professor
 * @param {File} file - Arquivo de imagem
 * @param {number} escolaId - ID da escola
 * @param {string} descricao - Descrição da imagem
 * @returns {Promise<Object>} Dados da imagem salva
 */
export const uploadProfessorImage = async (file, escolaId, descricao = '') => {
  try {
    // Validar arquivo
    const validation = validateImageFile(file, PROFESSOR_IMAGE_CONFIG);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Validar dimensões (opcional)
    const hasValidDimensions = await validateImageDimensions(file, PROFESSOR_IMAGE_CONFIG);
    if (!hasValidDimensions) {
      console.warn('Imagem com dimensões menores que o recomendado');
    }

    // Gerar nome único
    const fileName = generateUniqueFileName(file, escolaId);
    const filePath = `${escolaId}/${fileName}`;

    // Upload ao bucket
    const { error: uploadError } = await supabase.storage
      .from(PROFESSOR_IMAGE_CONFIG.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(PROFESSOR_IMAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(filePath);

    // Inserir metadados na tabela
    const { data: metadata, error: metadataError } = await supabase
      .from('imagens_escola')
      .insert([{
        escola_id: escolaId,
        url: filePath,
        descricao: descricao.trim() || `Imagem do professor da escola ${escolaId}`
      }])
      .select()
      .single();

    if (metadataError) {
      // Se falhar ao inserir metadados, deletar o arquivo
      await supabase.storage
        .from(PROFESSOR_IMAGE_CONFIG.BUCKET_NAME)
        .remove([filePath]);
      throw new Error(`Erro ao salvar metadados: ${metadataError.message}`);
    }

    return {
      id: metadata.id,
      url: filePath,
      publicUrl,
      descricao: metadata.descricao,
      created_at: metadata.created_at
    };

  } catch (error) {
    console.error('Erro no upload da imagem do professor:', error);
    throw error;
  }
};

/**
 * Buscar imagens da escola
 * @param {number} escolaId - ID da escola
 * @param {string} bucketName - Nome do bucket (opcional)
 * @returns {Promise<Array>} Lista de imagens
 */
export const getEscolaImages = async (escolaId, bucketName = ESCOLA_IMAGE_CONFIG.BUCKET_NAME) => {
  try {
    const queryPattern = `${escolaId}/%`;

    const { data, error } = await supabase
      .from('imagens_escola')
      .select('*')
      .like('url', queryPattern)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Adicionar URLs públicas
    const imagensComUrl = data.map((img) => {
      try {
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(img.url);

        return { ...img, publicUrl };
      } catch (err) {
        return { ...img, publicUrl: null, urlError: err.message };
      }
    });

    return imagensComUrl;

  } catch (error) {
    console.error('Erro ao buscar imagens da escola:', error);
    throw error;
  }
};

/**
 * Deletar imagem
 * @param {number} imageId - ID da imagem
 * @param {string} filePath - Caminho do arquivo
 * @param {string} bucketName - Nome do bucket
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageId, filePath, bucketName) => {
  try {
    // Deletar metadados
    const { error: metadataError } = await supabase
      .from('imagens_escola')
      .delete()
      .eq('id', imageId);

    if (metadataError) {
      throw new Error(`Erro ao deletar metadados: ${metadataError.message}`);
    }

    // Deletar arquivo do storage
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (storageError) {
      console.warn('Arquivo não encontrado no storage, mas metadados foram deletados');
    }

  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
};

/**
 * Atualizar descrição da imagem
 * @param {number} imageId - ID da imagem
 * @param {string} descricao - Nova descrição
 * @returns {Promise<Object>} Imagem atualizada
 */
export const updateImageDescription = async (imageId, descricao) => {
  try {
    const { data, error } = await supabase
      .from('imagens_escola')
      .update({ descricao: descricao.trim() })
      .eq('id', imageId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;

  } catch (error) {
    console.error('Erro ao atualizar descrição da imagem:', error);
    throw error;
  }
};

/**
 * Verificar limite de imagens
 * @param {number} escolaId - ID da escola
 * @param {string} bucketName - Nome do bucket
 * @returns {Promise<Object>} Informações sobre o limite
 */
export const checkImageLimit = async (escolaId, bucketName) => {
  try {
    const config = bucketName === PROFESSOR_IMAGE_CONFIG.BUCKET_NAME 
      ? PROFESSOR_IMAGE_CONFIG 
      : ESCOLA_IMAGE_CONFIG;

    const queryPattern = `${escolaId}/%`;
    const { count, error } = await supabase
      .from('imagens_escola')
      .select('*', { count: 'exact', head: true })
      .like('url', queryPattern);

    if (error) {
      throw error;
    }

    return {
      current: count || 0,
      limit: config.MAX_IMAGES_PER_SCHOOL,
      canUpload: (count || 0) < config.MAX_IMAGES_PER_SCHOOL
    };

  } catch (error) {
    console.error('Erro ao verificar limite de imagens:', error);
    throw error;
  }
}; 