import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../dbClient';
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

  // Refs para prevenir múltiplas execuções no React 19 Strict Effects
  const isFetchingRef = useRef(false);
  const lastFetchedEscolaIdRef = useRef(null);
  const lastFetchedBucketRef = useRef(null);
  const hasInitialLoadRef = useRef(false);

  const { loadOrder, saveOrder } = useImageOrder(escolaId, tipoFoto);
  const { fetchLegends } = useImageLegends(escolaId, tipoFoto);

  const fetchImages = useCallback(async (showLoading = true) => {
    if (!escolaId) return;

    // Proteção contra múltiplas execuções simultâneas
    if (isFetchingRef.current) {
      console.log('[useImageManagement] Fetch já em progresso, ignorando...');
      return;
    }

    // Proteção contra re-execução desnecessária (React 19 Strict Effects)
    const cacheKey = `${escolaId}-${bucketName}`;
    if (hasInitialLoadRef.current && 
        lastFetchedEscolaIdRef.current === escolaId && 
        lastFetchedBucketRef.current === bucketName) {
      console.log('[useImageManagement] Já carregado para este escolaId/bucket, ignorando re-execução...');
      return;
    }

    isFetchingRef.current = true;
    lastFetchedEscolaIdRef.current = escolaId;
    lastFetchedBucketRef.current = bucketName;

    try {
      if (showLoading) {
        setLoading(true);
      }
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
        hasInitialLoadRef.current = true;
        if (showLoading) {
          setLoading(false);
        }
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

      // CRÍTICO: Só atualizar estado se realmente mudou (proteção contra sobrescrita)
      setImages(prevImages => {
        // Se já temos imagens carregadas e são as mesmas, não sobrescrever
        if (hasInitialLoadRef.current && prevImages.length > 0) {
          const prevIds = new Set(prevImages.map(img => img.id));
          const newIds = new Set(imagesWithLegends.map(img => img.id));
          
          // Se os IDs são os mesmos, preservar o estado anterior (evita re-render desnecessário)
          if (prevIds.size === newIds.size && 
              [...prevIds].every(id => newIds.has(id))) {
            console.log('[useImageManagement] Imagens já carregadas, preservando estado anterior');
            return prevImages;
          }
        }
        
        hasInitialLoadRef.current = true;
        return imagesWithLegends;
      });
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
      setError('Erro ao carregar imagens existentes');
    } finally {
      isFetchingRef.current = false;
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [escolaId, bucketName, loadOrder, fetchLegends]);

  // Efeito inicial - só roda quando escolaId ou bucketName mudarem
  useEffect(() => {
    // Reset flags quando escolaId ou bucketName mudarem
    if (lastFetchedEscolaIdRef.current !== escolaId || 
        lastFetchedBucketRef.current !== bucketName) {
      hasInitialLoadRef.current = false;
      isFetchingRef.current = false;
    }

    fetchImages(true); // Show loading on initial fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escolaId, bucketName]); // Removido fetchImages das dependências para evitar loops

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
    setImages(prevImages => {
      const updatedImages = [...prevImages, ...newImages];
      // Save order async (não bloquear)
      saveOrder(updatedImages).catch(err => {
        console.error('Erro ao salvar ordem:', err);
      });
      return updatedImages;
    });
    
    // Refresh legends in background (sem sobrescrever imagens já carregadas)
    // Não chamar fetchImages() completo para evitar sobrescrita
  }, [saveOrder]);

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

  const refresh = useCallback((showLoading = false) => {
    // Reset flag para permitir refresh manual
    hasInitialLoadRef.current = false;
    isFetchingRef.current = false;
    return fetchImages(showLoading);
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    refresh,
    deleteImage: deleteImageById,
    addImages,
    updateImages,
    updateImageLocal,
  };
};

