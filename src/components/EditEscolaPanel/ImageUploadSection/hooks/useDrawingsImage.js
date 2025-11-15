import { useState, useEffect, useCallback } from 'react';
import { DrawingsImageService } from '../../../../services/drawingsImageService';

/**
 * Hook for managing drawings images
 * @param {string|number} escolaId - School ID
 * @returns {Object} Drawings images state and functions
 */
export const useDrawingsImage = (escolaId) => {
  const [drawingsImageUrls, setDrawingsImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDrawingsImages = useCallback(async () => {
    if (!escolaId) return;
    
    try {
      const urls = await DrawingsImageService.getDrawingsImages(escolaId);
      setDrawingsImageUrls(urls);
    } catch (err) {
      console.error('Erro ao buscar imagens de desenhos:', err);
    }
  }, [escolaId]);

  useEffect(() => {
    fetchDrawingsImages();
  }, [fetchDrawingsImages]);

  const addDrawingImage = useCallback(async (imageUrl) => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      await DrawingsImageService.addDrawingImage(escolaId, imageUrl);
      setDrawingsImageUrls(prev => {
        if (!prev.includes(imageUrl)) {
          return [...prev, imageUrl];
        }
        return prev;
      });
    } catch (err) {
      console.error('Erro ao adicionar imagem aos desenhos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  const removeDrawingImage = useCallback(async (imageUrl) => {
    if (!escolaId) return;
    
    try {
      setLoading(true);
      await DrawingsImageService.removeDrawingImage(escolaId, imageUrl);
      setDrawingsImageUrls(prev => prev.filter(url => url !== imageUrl));
    } catch (err) {
      console.error('Erro ao remover imagem dos desenhos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [escolaId]);

  const isDrawingImage = useCallback((imageUrl) => {
    return drawingsImageUrls.includes(imageUrl);
  }, [drawingsImageUrls]);

  return {
    drawingsImageUrls,
    loading,
    addDrawingImage,
    removeDrawingImage,
    isDrawingImage,
    refresh: fetchDrawingsImages,
  };
};

