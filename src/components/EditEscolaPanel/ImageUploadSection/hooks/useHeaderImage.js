import { useState, useEffect, useCallback } from 'react';
import { HeaderImageService } from '../../../../services/headerImageService';

/**
 * Hook for managing header image
 * @param {string|number} escolaId - School ID
 * @returns {Object} Header image state and functions
 */
export const useHeaderImage = (escolaId) => {
  const [headerImageUrl, setHeaderImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHeaderImage = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      const imagemUrl = await HeaderImageService.getImagemHeader(escolaId);
      setHeaderImageUrl(imagemUrl);
    } catch (err) {
      console.error('Erro ao buscar imagem do header:', err);
    }
  }, [escolaId]);

  useEffect(() => {
    fetchHeaderImage();
  }, [fetchHeaderImage]);

  const setHeaderImage = useCallback(async (imageUrl) => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      await HeaderImageService.setImagemHeader(escolaId, imageUrl);
      setHeaderImageUrl(imageUrl);
    } catch (err) {
      console.error('Erro ao definir imagem do header:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  const removeHeaderImage = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      await HeaderImageService.removeImagemHeader(escolaId);
      setHeaderImageUrl(null);
    } catch (err) {
      console.error('Erro ao remover imagem do header:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  return {
    headerImageUrl,
    loading,
    setHeaderImage,
    removeHeaderImage,
    refresh: fetchHeaderImage,
  };
};

