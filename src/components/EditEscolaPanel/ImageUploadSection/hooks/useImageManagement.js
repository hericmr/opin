import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../../supabaseClient';
import { deleteImage } from '../../../../services/escolaImageService';
import { transformFilesToImages, mergeLegendsIntoImages } from '../utils/imageTransformers';
import { useImageOrder } from './useImageOrder';
import { useImageLegends } from './useImageLegends';

/**
 * Hook for managing image lifecycle
 * @param {string|number} escolaId - School ID
 * @param {string} bucketName - Storage bucket name
 * @param {string} tipoFoto - Photo type ('escola' or 'professor')
 * @returns {Object} Image management functions and state
 */
export const useImageManagement = (escolaId, bucketName = 'imagens-das-escolas', tipoFoto = 'escola') => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { loadOrder, saveOrder } = useImageOrder(escolaId, tipoFoto);
  const { fetchLegends } = useImageLegends(escolaId, tipoFoto);

  const fetchImages = useCallback(async () => {
    if (!escolaId) return;

    try {
      setLoading(true);
      setError(null);

      // List files from storage
      const { data: files, error: storageError } = await supabase.storage
        .from(bucketName)
        .list(`${escolaId}/`);

      if (storageError) {
        throw storageError;
      }

      if (!files || files.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }

      // Transform files to image objects
      const imageObjects = transformFilesToImages(files, escolaId, bucketName);
      
      console.log('[useImageManagement] Images after transform:', imageObjects.map(img => ({
        id: img.id,
        url: img.url,
        publicURL: img.publicURL || 'MISSING',
        hasPublicURL: !!img.publicURL
      })));

      // Load order from database
      const orderedImages = await loadOrder(imageObjects);
      
      console.log('[useImageManagement] Images after ordering:', orderedImages.map(img => ({
        id: img.id,
        url: img.url,
        publicURL: img.publicURL || 'MISSING',
        hasPublicURL: !!img.publicURL
      })));

      // Fetch legends for images
      const imageUrls = orderedImages.map(img => img.url);
      const legendsMap = await fetchLegends(imageUrls);

      // Merge legends into images
      const imagesWithLegends = mergeLegendsIntoImages(orderedImages, legendsMap);
      
      console.log('[useImageManagement] Final images:', imagesWithLegends.map(img => ({
        id: img.id,
        url: img.url,
        publicURL: img.publicURL || 'MISSING',
        hasPublicURL: !!img.publicURL
      })));

      setImages(imagesWithLegends);
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
      setError('Erro ao carregar imagens existentes');
    } finally {
      setLoading(false);
    }
  }, [escolaId, bucketName, loadOrder, fetchLegends]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const deleteImageById = useCallback(async (imageId, filePath) => {
    try {
      await deleteImage(imageId, filePath, bucketName);
      
      // Refresh images list
      await fetchImages();
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      throw err;
    }
  }, [bucketName, fetchImages]);

  const addImages = useCallback(async (newImages) => {
    // Add new images to the list
    const updatedImages = [...images, ...newImages];
    
    // Save order
    await saveOrder(updatedImages);
    
    // Refresh to get legends
    await fetchImages();
  }, [images, saveOrder, fetchImages]);

  const updateImages = useCallback(async (updatedImages) => {
    try {
      // Save order first
      await saveOrder(updatedImages);
      
      // Then update state
      setImages(updatedImages);
    } catch (err) {
      console.error('Erro ao atualizar imagens:', err);
      throw err;
    }
  }, [saveOrder]);

  const updateImageLocal = useCallback((imageId, updater) => {
    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const updated = updater(img);
        // Ensure publicURL is preserved
        return {
          ...updated,
          publicURL: updated.publicURL || img.publicURL,
          publicUrl: updated.publicURL || updated.publicUrl || img.publicURL || img.publicUrl,
        };
      }
      return img;
    }));
  }, []);

  return {
    images,
    loading,
    error,
    refresh: fetchImages,
    deleteImage: deleteImageById,
    addImages,
    updateImages,
    updateImageLocal,
  };
};

