import { useState, useCallback } from 'react';
import { uploadProfessorImages } from '../services/professorImageUploadService';
import { validateImageFiles } from '../../ImageUploadSection/services/imageValidationService';

/**
 * Hook for managing professor image uploads
 * @param {string|number} escolaId - School ID
 * @returns {Object} Upload functions and state
 */
export const useProfessorImageUpload = (escolaId) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFiles = useCallback(async (files) => {
    if (!files || files.length === 0) {
      return [];
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validate files
      const { validFiles, errors } = validateImageFiles(files);
      
      if (errors.length > 0) {
        setError(errors[0]); // Show first error
        setUploading(false);
        return [];
      }

      if (validFiles.length === 0) {
        setUploading(false);
        return [];
      }

      // Upload files with progress tracking
      const uploadedImages = await uploadProfessorImages(
        validFiles,
        escolaId,
        (progressValue) => setProgress(progressValue)
      );

      setProgress(100);
      setUploading(false);
      
      return uploadedImages;
    } catch (err) {
      console.error('Erro no upload:', err);
      setError(err.message || 'Erro ao fazer upload');
      setUploading(false);
      setProgress(0);
      return [];
    }
  }, [escolaId]);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploadFiles,
    uploading,
    progress,
    error,
    reset,
  };
};

