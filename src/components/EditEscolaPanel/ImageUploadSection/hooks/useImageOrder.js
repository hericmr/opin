import { useCallback } from 'react';
import { loadImageOrder as loadOrder, saveImageOrder as saveOrder } from '../services/imageOrderService';

/**
 * Hook for managing image order
 * @param {string|number} escolaId - School ID
 * @param {string} tipoFoto - Photo type ('escola' or 'professor')
 * @returns {Object} Order management functions
 */
export const useImageOrder = (escolaId, tipoFoto = 'escola') => {
  const loadOrderForImages = useCallback(async (images) => {
    return await loadOrder(images, escolaId, tipoFoto);
  }, [escolaId, tipoFoto]);

  const saveOrderForImages = useCallback(async (images) => {
    return await saveOrder(images, escolaId);
  }, [escolaId]);

  return {
    loadOrder: loadOrderForImages,
    saveOrder: saveOrderForImages,
  };
};

