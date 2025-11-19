import { uploadEscolaImage, replaceImage as replaceImageService } from '../../../../services/escolaImageService';

/**
 * Service for uploading images
 */

/**
 * Upload multiple image files
 * @param {File[]} files - Array of files to upload
 * @param {string|number} escolaId - School ID
 * @param {Function} onProgress - Progress callback (progress: number) => void
 * @returns {Promise<Array<Object>>} Array of uploaded image objects
 */
export const uploadImages = async (files, escolaId, onProgress) => {
  const uploadedImages = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const progress = ((i + 1) / files.length) * 100;
    
    if (onProgress) {
      onProgress(progress);
    }
    
    const uploadedImage = await uploadEscolaImage(file, escolaId);
    uploadedImages.push(uploadedImage);
  }
  
  return uploadedImages;
};

/**
 * Replace an existing image
 * @param {File} newFile - New image file
 * @param {string} oldFilePath - Path of old image
 * @param {string|number} escolaId - School ID
 * @param {string} bucketName - Storage bucket name
 * @param {string} descricao - Description for new image
 * @param {Object} options - Additional options
 * @param {string} options.tipoFoto - Photo type ('escola' or 'professor')
 * @returns {Promise<Object>} New image object
 */
export const replaceImage = async (newFile, oldFilePath, escolaId, bucketName, descricao = '', options = {}) => {
  const tipoFoto = options.tipoFoto || (bucketName === 'imagens-professores' ? 'professor' : 'escola');
  return await replaceImageService(newFile, oldFilePath, escolaId, bucketName, descricao, {
    transferLegend: true,
    tipoFoto
  });
};

