import { useState, useEffect } from 'react';
import { supabase } from '../dbClient';
import logger from '../utils/logger';

/**
 * Hook para carregar e pré-carregar imagens de header do Dashboard
 * 
 * @returns {Object} Objeto com headerImages, descriptionImage, imagesReady e imagesPreloaded
 */
export const useDashboardImages = () => {
  const [headerImages, setHeaderImages] = useState([]);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    const loadHeaderImages = async () => {
      // Timeout de segurança: garantir que a página não trave
      const timeoutId = setTimeout(() => {
        logger.warn('Timeout no carregamento de imagens. Continuando sem imagens.');
        setImagesPreloaded(true);
        setImagesReady(true);
      }, 10000); // 10 segundos de timeout máximo

      try {
        // Aguardar um pouco para garantir que o Supabase esteja inicializado
        // Especialmente importante quando acessado diretamente pela URL
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verificar se o Supabase está disponível
        if (!supabase) {
          logger.warn('Supabase client não está disponível. Pulando carregamento de imagens.');
          clearTimeout(timeoutId);
          setImagesPreloaded(true);
          setImagesReady(true);
          return;
        }

        // Verificar se as credenciais do Supabase estão configuradas
        const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl.includes('seu-projeto') || 
            supabaseKey.includes('sua_chave_anonima')) {
          logger.warn('Credenciais do Supabase não configuradas. Pulando carregamento de imagens.');
          clearTimeout(timeoutId);
          setImagesPreloaded(true);
          setImagesReady(true);
          return;
        }

        // Fazer query com timeout individual
        const queryPromise = supabase
          .from('escolas_completa')
          .select('id, Escola, imagem_header')
          .not('imagem_header', 'is', null)
          .neq('imagem_header', '')
          .limit(100);

        const queryTimeout = new Promise((resolve) => 
          setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 5000)
        );

        // Usar Promise.race para aplicar timeout na query
        const result = await Promise.race([
          queryPromise.then(result => result),
          queryTimeout
        ]).catch(err => {
          logger.warn('Erro na query do Supabase:', err.message || err);
          return { data: null, error: err };
        });

        const { data: escolasData, error: escolasError } = result;

        clearTimeout(timeoutId);

        if (escolasError) {
          logger.warn('Erro ao carregar imagens de header do Supabase:', escolasError.message || escolasError);
          setImagesPreloaded(true);
          setImagesReady(true);
          return;
        }

        if (escolasData && escolasData.length > 0) {
          // Remover duplicatas baseado na URL da imagem
          const uniqueImages = [];
          const seenUrls = new Set();
          
          escolasData.forEach(escola => {
            if (escola.imagem_header && !seenUrls.has(escola.imagem_header)) {
              seenUrls.add(escola.imagem_header);
              uniqueImages.push(escola);
            }
          });

          // Selecionar aleatoriamente algumas imagens únicas (máximo 6 para garantir variedade)
          const shuffled = [...uniqueImages].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, Math.min(6, shuffled.length));
          
          // Garantir que não há duplicatas na seleção final
          const finalSelected = [];
          const finalSeenUrls = new Set();
          selected.forEach(img => {
            if (!finalSeenUrls.has(img.imagem_header)) {
              finalSeenUrls.add(img.imagem_header);
              finalSelected.push(img);
            }
          });
          
          // Setar imagens no estado IMEDIATAMENTE (antes do pré-carregamento)
          // Isso permite que a página renderize mesmo se o pré-carregamento demorar
          const headerImagesForDisplay = finalSelected.slice(0, 5);
          const headerImageUrls = new Set(headerImagesForDisplay.map(img => img.imagem_header));
          
          setHeaderImages(headerImagesForDisplay);
          
          // Selecionar uma imagem aleatória para exibir após a descrição
          const availableForDescription = finalSelected.filter(img => 
            !headerImageUrls.has(img.imagem_header)
          );
          
          if (availableForDescription.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableForDescription.length);
            setDescriptionImage(availableForDescription[randomIndex]);
          } else if (finalSelected.length > 5) {
            const extraImages = finalSelected.slice(5);
            const randomIndex = Math.floor(Math.random() * extraImages.length);
            setDescriptionImage(extraImages[randomIndex]);
          } else if (finalSelected.length > 1) {
            const candidates = finalSelected.slice(1);
            const randomIndex = Math.floor(Math.random() * candidates.length);
            setDescriptionImage(candidates[randomIndex]);
          }

          // Marcar como pronto para renderizar IMEDIATAMENTE
          setImagesPreloaded(true);
          setImagesReady(true);
          
          // PRÉ-CARREGAR imagens em background (não bloqueante)
          const imageUrls = finalSelected.map(img => img.imagem_header).filter(Boolean);
          
          // Pré-carregar imagens de forma não-bloqueante
          if (typeof document !== 'undefined' && imageUrls.length > 0) {
            // Método 1: Preload links no head (mais rápido)
            imageUrls.forEach((url) => {
              try {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = url;
                if ('fetchPriority' in link) {
                  link.fetchPriority = 'high';
                }
                document.head.appendChild(link);
              } catch (e) {
                // Ignorar erros de preload
              }
            });
            
            // Método 2: Pré-carregar via Image objects em paralelo (não bloqueante)
            // Usar Promise.allSettled para não travar se alguma falhar
            Promise.allSettled(
              imageUrls.map(url => {
                return new Promise((resolve) => {
                  const img = new Image();
                  const timeout = setTimeout(() => resolve(url), 3000); // Timeout de 3s por imagem
                  
                  img.onload = () => {
                    clearTimeout(timeout);
                    resolve(url);
                  };
                  img.onerror = () => {
                    clearTimeout(timeout);
                    resolve(url); // Continua mesmo se falhar
                  };
                  
                  if ('fetchPriority' in img) {
                    img.fetchPriority = 'high';
                  }
                  img.src = url;
                });
              })
            ).catch(() => {
              // Ignorar erros - já marcamos como ready
            });
          }
        } else {
          logger.warn('Nenhuma imagem de header encontrada no Supabase.');
          setImagesPreloaded(true);
          setImagesReady(true);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        logger.warn('Erro ao carregar imagens de header (não crítico):', err.message || err);
        setImagesPreloaded(true);
        setImagesReady(true); // Continua mesmo se falhar
      }
    };

    // Carregar imagens de forma não-bloqueante
    loadHeaderImages();
  }, []);

  return {
    headerImages,
    descriptionImage,
    imagesReady,
    imagesPreloaded
  };
};

