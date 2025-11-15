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
  const startPreload = async () => {
    if (!escolaId || !enabled) return;

    setIsPreloading(true);
    logger.debug('🖼️ Iniciando preload de imagens para escola:', escolaId);

    try {
      // Preload de imagens da escola
      const { data: escolaFiles } = await supabase.storage
        .from('imagens-das-escolas')
        .list(`${escolaId}/`);

      // Preload de imagens dos professores
      const { data: professorFiles } = await supabase.storage
        .from('imagens-professores')
        .list(`${escolaId}/`);

      const urlsToPreload = [];

      // Adicionar URLs das imagens da escola
      if (escolaFiles && escolaFiles.length > 0) {
        escolaFiles.forEach(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('imagens-das-escolas')
            .getPublicUrl(`${escolaId}/${file.name}`);
          urlsToPreload.push(publicUrl);
        });
      }

      // Adicionar URLs das imagens dos professores
      if (professorFiles && professorFiles.length > 0) {
        professorFiles.forEach(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('imagens-professores')
            .getPublicUrl(`${escolaId}/${file.name}`);
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

    } catch (error) {
      logger.error('❌ Erro durante preload:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  // Iniciar preload quando escolaId mudar
  useEffect(() => {
    if (!escolaId || !enabled) return;

    // Limpar timeout anterior se existir
    if (preloadTimeoutRef.current) {
      clearTimeout(preloadTimeoutRef.current);
    }

    // Delay inicial para não bloquear a UI
    preloadTimeoutRef.current = setTimeout(() => {
      startPreload();
    }, 500); // 500ms de delay inicial

    return () => {
      if (preloadTimeoutRef.current) {
        clearTimeout(preloadTimeoutRef.current);
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