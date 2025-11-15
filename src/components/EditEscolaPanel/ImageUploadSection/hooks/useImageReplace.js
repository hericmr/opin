import { useState, useCallback } from 'react';
import { replaceImage as replaceImageService } from '../services/imageUploadService';

/**
 * Hook for managing image replacement
 * @param {string|number} escolaId - School ID
 * @param {string} bucketName - Storage bucket name
 * @returns {Object} Replace image state and functions
 */
export const useImageReplace = (escolaId, bucketName = 'imagens-das-escolas') => {
  const [replacingImageId, setReplacingImageId] = useState(null);
  const [replacementFile, setReplacementFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const startReplace = useCallback((imageId) => {
    setReplacingImageId(imageId);
    setReplacementFile(null);
  }, []);

  const cancelReplace = useCallback(() => {
    setReplacingImageId(null);
    setReplacementFile(null);
  }, []);

  const selectReplacementFile = useCallback((file) => {
    setReplacementFile(file);
  }, []);

  const replaceImage = useCallback(async (imageId, oldFilePath, descricao = '') => {
    if (!replacementFile) {
      throw new Error('Selecione uma nova imagem para substituir');
    }

    try {
      setUploading(true);
      
      const newImage = await replaceImageService(
        replacementFile,
        oldFilePath,
        escolaId,
        bucketName,
        descricao
      );

      // Clear state
      setReplacingImageId(null);
      setReplacementFile(null);
      setUploading(false);

      return newImage;
    } catch (err) {
      console.error('Erro ao substituir imagem:', err);
      setUploading(false);
      throw err;
    }
  }, [replacementFile, escolaId, bucketName]);

  return {
    replacingImageId,
    replacementFile,
    uploading,
    startReplace,
    cancelReplace,
    selectReplacementFile,
    replaceImage,
  };
};

