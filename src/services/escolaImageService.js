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
  BUCKET_NAME: 'imagens-professores', // Usando bucket existente
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
 * Gera nome único para o arquivo (sem gênero, para imagens de escola)
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
 * Gera nome único para o arquivo, incluindo o gênero
 * @param {File} file - Arquivo
 * @param {number} escolaId - ID da escola
 * @param {string} genero - 'professor' ou 'professora'
 * @returns {string} Nome único do arquivo
 */
const generateUniqueFileNameWithGenero = (file, escolaId, genero) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop().toLowerCase();
  return `${genero}_${escolaId}_${timestamp}_${random}.${extension}`;
};

/**
 * Upload de imagem da escola (versão simplificada sem tabela de metadados)
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

    return {
      id: Date.now(), // ID temporário
      url: filePath,
      publicUrl,
      descricao: descricao.trim() || `Imagem da escola ${escolaId}`,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('Erro no upload da imagem da escola:', error);
    throw error;
  }
};

/**
 * Upload de imagem do professor (com gênero no nome do arquivo)
 * @param {File} file - Arquivo de imagem
 * @param {number} escolaId - ID da escola
 * @param {string} descricao - Descrição da imagem
 * @param {string} genero - 'professor' ou 'professora'
 * @returns {Promise<Object>} Dados da imagem salva
 */
export const uploadProfessorImage = async (file, escolaId, descricao = '', genero = 'professor') => {
  try {
    // Validar arquivo
    const validation = validateImageFile(file, PROFESSOR_IMAGE_CONFIG);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Gerar nome único com gênero
    const fileName = generateUniqueFileNameWithGenero(file, escolaId, genero);
    const filePath = `${escolaId}/${fileName}`;

    // Upload ao bucket
    const { error: uploadError } = await supabase.storage
      .from(PROFESSOR_IMAGE_CONFIG.BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro detalhado do upload:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(PROFESSOR_IMAGE_CONFIG.BUCKET_NAME)
      .getPublicUrl(filePath);

    // Retornar objeto simulado (sem metadados na tabela)
    return {
      id: Date.now(), // ID temporário
      url: filePath,
      publicUrl,
      descricao: descricao.trim() || `Imagem do ${genero} da escola ${escolaId}`,
      genero,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    console.error('Erro no upload da imagem do professor:', error);
    throw error;
  }
};

/**
 * Buscar imagens da escola (versão simplificada)
 * @param {number} escolaId - ID da escola
 * @param {string} bucketName - Nome do bucket
 * @returns {Promise<Array>} Lista de imagens
 */
export const getEscolaImages = async (escolaId, bucketName = ESCOLA_IMAGE_CONFIG.BUCKET_NAME) => {
  try {
    // Listar arquivos no bucket para a escola específica
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list(`${escolaId}/`);

    if (error) {
      throw error;
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Criar objetos de imagem com URLs públicas
    const imagens = files.map((file, index) => {
      const filePath = `${escolaId}/${file.name}`;
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        id: index + 1, // ID temporário
        url: filePath,
        publicUrl,
        descricao: `Imagem ${index + 1}`,
        created_at: file.created_at || new Date().toISOString()
      };
    });

    return imagens;

  } catch (error) {
    console.error('Erro ao buscar imagens da escola:', error);
    throw error;
  }
};

/**
 * Deletar imagem (versão simplificada)
 * @param {number} imageId - ID da imagem
 * @param {string} filePath - Caminho do arquivo
 * @param {string} bucketName - Nome do bucket
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageId, filePath, bucketName) => {
  try {
    // Deletar arquivo do storage
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (storageError) {
      throw new Error(`Erro ao deletar arquivo: ${storageError.message}`);
    }

  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
};

/**
 * Atualizar descrição da imagem (versão simplificada)
 * @param {number} imageId - ID da imagem
 * @param {string} descricao - Nova descrição
 * @returns {Promise<Object>} Imagem atualizada
 */
export const updateImageDescription = async (imageId, descricao) => {
  try {
    // Como não temos tabela de metadados, retornamos um objeto simulado
    return {
      id: imageId,
      descricao: descricao.trim()
    };

  } catch (error) {
    console.error('Erro ao atualizar descrição da imagem:', error);
    throw error;
  }
};

/**
 * Verificar limite de imagens (versão simplificada)
 * @param {number} escolaId - ID da escola
 * @param {string} bucketName - Nome do bucket
 * @returns {Promise<Object>} Informações sobre o limite
 */
export const checkImageLimit = async (escolaId, bucketName) => {
  try {
    const config = bucketName === PROFESSOR_IMAGE_CONFIG.BUCKET_NAME 
      ? PROFESSOR_IMAGE_CONFIG 
      : ESCOLA_IMAGE_CONFIG;

    // Listar arquivos no bucket para a escola específica
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list(`${escolaId}/`);

    if (error) {
      throw error;
    }

    const currentCount = files ? files.length : 0;

    return {
      current: currentCount,
      limit: config.MAX_IMAGES_PER_SCHOOL,
      canUpload: currentCount < config.MAX_IMAGES_PER_SCHOOL
    };

  } catch (error) {
    console.error('Erro ao verificar limite de imagens:', error);
    throw error;
  }
}; 