import { supabase } from '../supabaseClient';
import { 
  STORAGE_BUCKETS, 
  FILE_PATHS, 
  validateFile, 
  generateUniqueFileName,
  getFileType 
} from '../config/storage';
import logger from '../utils/logger';

/**
 * Uploads a file to the specified bucket
 * @param {File} file - The file to upload
 * @param {string} bucket - The bucket to upload to (defaults to 'pdfs')
 * @returns {Promise<string>} The public URL of the uploaded file
 */
export const uploadFile = async (file, bucket = STORAGE_BUCKETS.PDFS) => {
  try {
    const fileType = getFileType(file);
    if (!fileType) {
      throw new Error('Tipo de arquivo não suportado');
    }

    const validation = validateFile(file, fileType);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const fileName = generateUniqueFileName(file, `${fileType.toLowerCase()}_`);
    const filePath = `${FILE_PATHS[fileType]}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    logger.error('Erro ao fazer upload:', error);
    throw error;
  }
};

/**
 * Uploads a PDF file to the pdfs bucket
 * @param {File} file - The PDF file to upload
 * @returns {Promise<string>} The public URL of the uploaded PDF
 */
export const uploadPDF = async (file) => {
  return uploadFile(file, STORAGE_BUCKETS.PDFS);
};

/**
 * Uploads an image file to the media bucket
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} The public URL of the uploaded image
 */
export const uploadImage = async (file) => {
  return uploadFile(file, STORAGE_BUCKETS.MEDIA);
};

/**
 * Uploads an audio file to the media bucket
 * @param {File} file - The audio file to upload
 * @returns {Promise<string>} The public URL of the uploaded audio
 */
export const uploadAudio = async (file) => {
  return uploadFile(file, STORAGE_BUCKETS.MEDIA);
};

/**
 * Deletes a file from the specified bucket
 * @param {string} filePath - The path of the file to delete
 * @param {string} bucket - The bucket containing the file
 * @returns {Promise<void>}
 */
export const deleteFile = async (filePath, bucket = STORAGE_BUCKETS.PDFS) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    logger.error('Erro ao deletar arquivo:', error);
    throw error;
  }
}; 