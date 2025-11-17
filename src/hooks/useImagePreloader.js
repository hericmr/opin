import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import logger from '../utils/logger';

/**
 * Hook para preload de imagens antecipado
 * Carrega imagens antes que o usuário role até elas
 */
const useImagePreloader = (escolaId, enabled = true) => {
  const [preloadedImages, setPreloadedImages] = useState(new Map());
  const [isPreloading, setIsPreloading] = useState(false);
  const preloadTimeoutRef = useRef(null);
  const preloadingEscolaIdRef = useRef(null); // Track which escolaId is currently being preloaded
  const completedPreloadsRef = useRef(new Set()); // Track completed preloads per escolaId

  // Função para preload de uma imagem específica
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  // Função para preload de múltiplas imagens
  const preloadImages = async (urls) => {
    const promises = urls.map(url => 
      preloadImage(url).catch(error => {
        logger.warn('Erro ao preload da imagem:', url, error);
        return null; // Continua mesmo se uma imagem falhar
      })
    );
    
    const results = await Promise.all(promises);
    return results.filter(Boolean); // Remove URLs que falharam
  };

  // Função principal de preload
  const startPreload = async (targetEscolaId = escolaId) => {
    if (!targetEscolaId || !enabled) return;

    // Prevent duplicate preloads for the same escolaId
    if (preloadingEscolaIdRef.current === targetEscolaId) {
      logger.debug('🖼️ Preload já em progresso para escola:', targetEscolaId);
      return;
    }

    // Skip if already completed (CRÍTICO: proteção contra re-execução no React 19 Strict Effects)
    if (completedPreloadsRef.current.has(targetEscolaId)) {
      logger.debug('🖼️ Preload já concluído para escola:', targetEscolaId);
      return;
    }

    preloadingEscolaIdRef.current = targetEscolaId;
    setIsPreloading(true);
    logger.debug('🖼️ Iniciando preload de imagens para escola:', targetEscolaId);

    try {
      // Preload de imagens da escola
      const { data: escolaFiles } = await supabase.storage
        .from('imagens-das-escolas')
        .list(`${targetEscolaId}/`);

      // Preload de imagens dos professores
      const { data: professorFiles } = await supabase.storage
        .from('imagens-professores')
        .list(`${targetEscolaId}/`);

      const urlsToPreload = [];

      // Adicionar URLs das imagens da escola
      if (escolaFiles && escolaFiles.length > 0) {
        escolaFiles.forEach(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('imagens-das-escolas')
            .getPublicUrl(`${targetEscolaId}/${file.name}`);
          urlsToPreload.push(publicUrl);
        });
      }

      // Adicionar URLs das imagens dos professores
      if (professorFiles && professorFiles.length > 0) {
        professorFiles.forEach(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('imagens-professores')
            .getPublicUrl(`${targetEscolaId}/${file.name}`);
          urlsToPreload.push(publicUrl);
        });
      }

      logger.debug(`🖼️ Preload: ${urlsToPreload.length} imagens encontradas`);

      if (urlsToPreload.length > 0) {
        // Preload em lotes para não sobrecarregar
        const batchSize = 5;
        const batches = [];
        
        for (let i = 0; i < urlsToPreload.length; i += batchSize) {
          batches.push(urlsToPreload.slice(i, i + batchSize));
        }

        // Processar lotes com delay entre eles
        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];
          logger.debug(`🖼️ Preload lote ${i + 1}/${batches.length}: ${batch.length} imagens`);
          
          await preloadImages(batch);
          
          // Delay entre lotes para não sobrecarregar
          if (i < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        // Atualizar estado com imagens preloadadas
        const preloadedMap = new Map();
        urlsToPreload.forEach(url => {
          preloadedMap.set(url, true);
        });
        setPreloadedImages(preloadedMap);

        logger.debug('✅ Preload concluído:', urlsToPreload.length, 'imagens');
      }

      // Mark this escolaId as completed
      completedPreloadsRef.current.add(targetEscolaId);

    } catch (error) {
      logger.error('❌ Erro durante preload:', error);
    } finally {
      setIsPreloading(false);
      // Clear the preloading flag if this was the current preload
      if (preloadingEscolaIdRef.current === targetEscolaId) {
        preloadingEscolaIdRef.current = null;
      }
    }
  };

  // Iniciar preload quando escolaId mudar
  // Proteção contra múltiplas execuções no React 19 Strict Effects
  useEffect(() => {
    if (!escolaId || !enabled) return;

    // Skip if already preloading or completed for this escolaId
    if (preloadingEscolaIdRef.current === escolaId) {
      logger.debug('🖼️ Preload já em progresso, ignorando...');
      return;
    }

    // Skip if already completed (proteção contra re-execução no React 19)
    if (completedPreloadsRef.current.has(escolaId)) {
      logger.debug('🖼️ Preload já concluído para escola:', escolaId);
      return;
    }

    // Limpar timeout anterior se existir
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
      preloadTimeoutRef.current = null;
    }

    // Reset preloading flag if escolaId changed
    if (preloadingEscolaIdRef.current && preloadingEscolaIdRef.current !== escolaId) {
      preloadingEscolaIdRef.current = null;
    }

    // Delay inicial para não bloquear a UI
    // Capture escolaId in a const to ensure we use the correct value
    const currentEscolaId = escolaId;
    preloadTimeoutRef.current = setTimeout(() => {
      startPreload(currentEscolaId);
    }, 500); // 500ms de delay inicial

    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
        preloadTimeoutRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [escolaId, enabled]);

  // Verificar se uma imagem específica foi preloadada
  const isImagePreloaded = (url) => {
    return preloadedImages.has(url);
  };

  return {
    isPreloading,
    preloadedImages,
    isImagePreloaded,
    startPreload
  };
};

export default useImagePreloader;