import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../../../../dbClient';
import { deleteImage } from '../../../../services/escolaImageService';
import { getLegendasByEscolaOrdered, deleteLegendaFoto } from '../../../../services/legendasService';
import { getProfessorImagesByEscola, deleteProfessorImageMeta } from '../../../../services/professorImageMetaService';
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

  const { saveOrder } = useImageOrder(escolaId, tipoFoto);
  const { saveLegend } = useImageLegends(escolaId, tipoFoto);

  const fetchImages = useCallback(async (showLoading = true) => {
    if (!escolaId) return;

    // Proteção contra múltiplas execuções simultâneas
    if (isFetchingRef.current) {
      console.log('[useImageManagement] Fetch já em progresso, ignorando...');
      return;
    }

    // Proteção contra re-execução desnecessária (React 19 Strict Effects)
    // Se já carregamos e os parâmetros são os mesmos, e não estamos forçando (showLoading=false costuma ser refresh)
    if (hasInitialLoadRef.current &&
      lastFetchedEscolaIdRef.current === escolaId &&
      lastFetchedBucketRef.current === bucketName &&
      showLoading === true) { // Apenas evita se for load inicial
      // Mas se for refresh explícito (showLoading=false), deixamos passar
    }

    isFetchingRef.current = true;
    lastFetchedEscolaIdRef.current = escolaId;
    lastFetchedBucketRef.current = bucketName;

    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      let dbImages = [];

      if (tipoFoto === 'professor' || bucketName === 'imagens-professores') {
        // Buscar imagens de professores
        dbImages = await getProfessorImagesByEscola(escolaId);
      } else {
        // Buscar imagens da escola (legendas_fotos)
        dbImages = await getLegendasByEscolaOrdered(escolaId, tipoFoto);
      }

      console.log('[useImageManagement] DB Images:', dbImages.length);

      // Mapear para estrutura esperada pelo componente
      const mappedImages = dbImages.map(img => {
        // Determinar campos baseados na origem (legendas_fotos ou imagens_professores)
        const isProfessorTable = !!img.nome_arquivo; // imagens_professores tem nome_arquivo

        return {
          id: img.id,
          url: img.imagem_url,
          publicURL: img.publicUrl, // Enriquecido pelo service
          publicUrl: img.publicUrl,
          filePath: img.imagem_url, // Usado para deleção no storage
          descricao: img.legenda || img.nome_arquivo || 'Imagem',
          created_at: img.created_at,
          legendaData: {
            legenda: img.legenda || '',
            descricao_detalhada: img.descricao_detalhada || '',
            autor_foto: isProfessorTable ? img.autor : (img.autor_foto || ''),
            data_foto: img.data_foto || '',
            categoria: img.categoria || 'geral',
          }
        };
      });

      // CRÍTICO: Só atualizar estado se realmente mudou (proteção contra sobrescrita)
      setImages(prevImages => {
        // Se já temos imagens carregadas e são as mesmas, não sobrescrever
        if (hasInitialLoadRef.current && prevImages.length > 0) {
          const prevIds = new Set(prevImages.map(img => img.id));
          const newIds = new Set(mappedImages.map(img => img.id));

          // Se os IDs são os mesmos, preservar o estado anterior (evita re-render desnecessário)
          if (prevIds.size === newIds.size &&
            [...prevIds].every(id => newIds.has(id))) {
            console.log('[useImageManagement] Imagens já carregadas, preservando estado anterior');
            return prevImages;
          }
        }

        hasInitialLoadRef.current = true;
        return mappedImages;
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
  }, [escolaId, bucketName, tipoFoto]);

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
  }, [escolaId, bucketName]);

  const deleteImageById = useCallback(async (imageId, filePath) => {
    try {
      // 1. Deletar do Storage (arquivo físico)
      // Nota: deleteImage do service espera filePath relativo ao bucket
      await deleteImage(imageId, filePath, bucketName);

      // 2. Deletar do Banco de Dados (metadados)
      if (tipoFoto === 'professor' || bucketName === 'imagens-professores') {
        await deleteProfessorImageMeta(imageId);
      } else {
        await deleteLegendaFoto(imageId);
      }

      // Refresh images list
      await fetchImages(false);
    } catch (err) {
      console.error('Erro ao deletar imagem:', err);
      throw err;
    }
  }, [bucketName, tipoFoto, fetchImages]);

  const addImages = useCallback(async (newImages) => {
    // Refresh completo para pegar os IDs do banco
    await fetchImages(false);
  }, [fetchImages]);

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

