import { useState, useEffect, useRef } from 'react';

// Hook para carregamento inteligente de imagens
export const useImageLoader = (src, priority = 'normal') => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef(null);
  const imgRef = useRef(null);

  // Estratégias de carregamento baseadas na prioridade
  const getLoadingStrategy = () => {
    switch (priority) {
      case 'high':
        return {
          loadImmediately: true,
          rootMargin: '0px',
          loading: 'eager'
        };
      case 'normal':
        return {
          loadImmediately: false,
          rootMargin: '400px 0px', // Carrega bem antes
          loading: 'lazy'
        };
      case 'low':
        return {
          loadImmediately: false,
          rootMargin: '100px 0px',
          loading: 'lazy'
        };
      default:
        return {
          loadImmediately: false,
          rootMargin: '200px 0px',
          loading: 'lazy'
        };
    }
  };

  useEffect(() => {
    const strategy = getLoadingStrategy();

    // Carregar imediatamente se for alta prioridade
    if (strategy.loadImmediately) {
      setIsInView(true);
      return;
    }

    // Intersection Observer para lazy loading
    if ('IntersectionObserver' in window) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: strategy.rootMargin,
          threshold: 0.01
        }
      );

      if (imgRef.current) {
        observerRef.current.observe(imgRef.current);
      }
    } else {
      // Fallback para navegadores sem Intersection Observer
      setIsInView(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return {
    isLoaded,
    hasError,
    isInView,
    imgRef,
    handleLoad,
    handleError,
    loading: getLoadingStrategy().loading
  };
};

// Hook para pré-carregar imagens importantes
export const useImagePreloader = (imageUrls) => {
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, url]));
          resolve(url);
        };
        img.onerror = () => reject(url);
        img.src = url;
      });
    };

    // Pré-carregar imagens em paralelo
    Promise.allSettled(imageUrls.map(preloadImage))
      .then((results) => {
        console.log('Pré-carregamento concluído:', results.length, 'imagens');
      });
  }, [imageUrls]);

  return preloadedImages;
};

// Hook para detectar se a imagem está visível na viewport
export const useImageVisibility = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasIntersected(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return { ref, isVisible, hasIntersected };
};

// Hook para gerenciar cache de imagens
export const useImageCache = () => {
  const [cache, setCache] = useState(new Map());

  const addToCache = (key, imageData) => {
    setCache(prev => new Map(prev).set(key, imageData));
  };

  const getFromCache = (key) => {
    return cache.get(key);
  };

  const clearCache = () => {
    setCache(new Map());
  };

  return {
    cache,
    addToCache,
    getFromCache,
    clearCache
  };
};

const ImageLoaderHooks = {
  useImageLoader,
  useImagePreloader,
  useImageVisibility,
  useImageCache
};

export default ImageLoaderHooks; 