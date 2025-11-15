import { uploadProfessorImage, replaceImage as replaceImageService } from '../../../../services/escolaImageService';
import { addProfessorImageMeta } from '../../../../services/professorImageMetaService';

/**
 * Service for uploading professor images
 */

/**
 * Upload multiple professor image files
 * @param {File[]} files - Array of files to upload
 * @param {string|number} escolaId - School ID
 * @param {Function} onProgress - Progress callback (progress: number) => void
 * @returns {Promise<Array<Object>>} Array of uploaded image objects
 */
export const uploadProfessorImages = async (files, escolaId, onProgress) => {
  const uploadedImages = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = ((i + 1) / files.length) * 100;
    
    if (onProgress) {
      onProgress(progress);
    }
    
    // Upload image
    const uploadedImage = await uploadProfessorImage(file, escolaId, '', 'professor', '');
    
    // Create professor image meta record
    await addProfessorImageMeta({
      escola_id: escolaId,
      imagem_url: uploadedImage.url,
      nome_arquivo: file.name,
      autor: '',
      ativo: true
    });
    
    uploadedImages.push(uploadedImage);
  }
  
  return uploadedImages;
};

/**
 * Replace an existing professor image
 * @param {File} newFile - New image file
 * @param {string} oldFilePath - Path of old image
 * @param {string|number} escolaId - School ID
 * @param {string} descricao - Description for new image
 * @returns {Promise<Object>} New image object
 */
export const replaceProfessorImage = async (newFile, oldFilePath, escolaId, descricao = '') => {
  return await replaceImageService(newFile, oldFilePath, escolaId, 'imagens-professores', descricao);
};

