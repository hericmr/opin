import { useState, useCallback } from 'react';
import { replaceProfessorImage } from '../services/professorImageUploadService';

/**
 * Hook for managing professor image replacement
 * @param {string|number} escolaId - School ID
 * @returns {Object} Replace image state and functions
 */
export const useProfessorImageReplace = (escolaId) => {
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
      
      const newImage = await replaceProfessorImage(
        replacementFile,
        oldFilePath,
        escolaId,
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
  }, [replacementFile, escolaId]);

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

