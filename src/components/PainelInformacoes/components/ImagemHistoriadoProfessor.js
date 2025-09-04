import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../supabaseClient';
import { getLegendaByImageUrl } from '../../../services/legendasService';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ImagemHistoriadoProfessor = ({ escola_id, refreshKey = 0 }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagemZoom, setImagemZoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageOrientations, setImageOrientations] = useState({});

  const fecharZoom = useCallback(() => {
    setImagemZoom(null);
    setCurrentImageIndex(0);
    setZoomLevel(1);
    setRotation(0);
  }, []);

  // Função para detectar orientação da imagem
  const detectImageOrientation = useCallback((url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isVertical = img.height > img.width;
        resolve(isVertical ? 'vertical' : 'horizontal');
      };
      img.onerror = () => {
        resolve('horizontal'); // fallback
      };
      img.src = url;
    });
  }, []);

  // Fecha modal com tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharZoom();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fecharZoom]);

  // Navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imagemZoom) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'Escape':
          fecharZoom();
          break;
        case '+':
        case '=':
          e.preventDefault();
          setZoomLevel(prev => Math.min(prev + 0.25, 3));
          break;
        case '-':
          e.preventDefault();
          setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation(prev => (prev + 90) % 360);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imagemZoom]);

  // Forçar recarga quando refreshKey mudar
  useEffect(() => {
    if (refreshKey > 0) {
      console.log('ImagemHistoriadoProfessor: refreshKey mudou, forçando recarga');
      setImagens([]);
      setLoading(true);
      setError(null);
      setImageOrientations({});
    }
  }, [refreshKey]);

  useEffect(() => {
    if (!escola_id) return;

    setLoading(true);
    setError(null);

    // Busca arquivos do bucket diretamente
    supabase
      .storage
      .from('imagens-professores')
      .list(`${escola_id}/`)
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          console.log('Arquivos de professores encontrados:', data.length);
          const imagensComUrl = await Promise.all(data.map(async (file, idx) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('imagens-professores')
              .getPublicUrl(`${escola_id}/${file.name}`);
            
            // Extrair gênero do nome do arquivo
            let genero = 'professor';
            if (file.name.startsWith('professora_')) {
              genero = 'professora';
            } else if (file.name.startsWith('professor_')) {
              genero = 'professor';
            }

            // Buscar legenda da nova tabela
            let legenda = null;
            try {
              const caminhoRelativo = `${escola_id}/${file.name}`;
              console.log('Buscando legenda para professor:', caminhoRelativo);
              legenda = await getLegendaByImageUrl(caminhoRelativo, escola_id, 'professor');
              console.log('Legenda encontrada para professor:', legenda);
            } catch (error) {
              console.warn('Erro ao buscar legenda:', error);
            }

            return {
              id: idx + 1,
              publicURL: publicUrl,
              genero,
              nome: file.name,
              created_at: file.created_at || '',
              legenda: legenda?.legenda || `Imagem do ${genero}`,
              descricaoDetalhada: legenda?.descricao_detalhada,
              autor: legenda?.autor_foto,
              dataFoto: legenda?.data_foto,
              categoria: legenda?.categoria,
            };
          }));

          // Detectar orientações das imagens
          const orientations = {};
          for (const img of imagensComUrl) {
            orientations[img.id] = await detectImageOrientation(img.publicURL);
          }
          setImageOrientations(orientations);
          setImagens(imagensComUrl);
        } else {
          setImagens([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(`Erro inesperado: ${err.message}`);
        setLoading(false);
      });
  }, [escola_id, detectImageOrientation]);

  const openImage = useCallback((image, index) => {
    setImagemZoom(image);
    setCurrentImageIndex(index);
    setZoomLevel(1);
    setRotation(0);
  }, []);

  const nextImage = useCallback(() => {
    if (imagens.length > 1) {
      const nextIndex = (currentImageIndex + 1) % imagens.length;
      setCurrentImageIndex(nextIndex);
      setImagemZoom(imagens[nextIndex]);
      setZoomLevel(1);
      setRotation(0);
    }
  }, [imagens, currentImageIndex]);

  const prevImage = useCallback(() => {
    if (imagens.length > 1) {
      const prevIndex = currentImageIndex === 0 ? imagens.length - 1 : currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setImagemZoom(imagens[prevIndex]);
      setZoomLevel(1);
      setRotation(0);
    }
  }, [imagens, currentImageIndex]);

  const resetImage = useCallback(() => {
    setZoomLevel(1);
    setRotation(0);
  }, []);

  if (loading) {
    return <div className="text-gray-500">Carregando imagens do professor...</div>;
  }

  if (error) {
    return <div className="text-red-600">Erro ao carregar imagens: {error}</div>;
  }

  if (!imagens.length) {
    return null;
  }

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imagens.map((img, index) => (
          <figure
            key={img.id}
            className="rounded-lg overflow-hidden border bg-white shadow-sm flex flex-col cursor-pointer transition hover:shadow-md"
            onClick={() => img.publicURL && openImage(img, index)}
          >
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img
                src={img.publicURL}
                alt={img.legenda}
                className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                loading="lazy"
                style={{ maxHeight: '350px' }}
              />
            </div>
            
            {/* Legenda da imagem */}
            {img.legenda && (
              <figcaption className="p-3 bg-white">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {img.legenda}
                </h4>
                
                {/* Informações adicionais */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {img.categoria && (
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                      {img.categoria}
                    </span>
                  )}
                  {img.autor && (
                    <span>Por: {img.autor}</span>
                  )}
                  {img.dataFoto && (
                    <span>{new Date(img.dataFoto).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
                
                {/* Descrição detalhada */}
                {img.descricaoDetalhada && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {img.descricaoDetalhada}
                  </p>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Modal de Zoom Melhorado */}
      {imagemZoom && (
        <div
          className="image-zoom-modal"
          onClick={fecharZoom}
        >
          {/* Botão Fechar */}
          <button
            onClick={fecharZoom}
            className="image-zoom-close"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>

          {/* Controles de Zoom */}
          <div className="image-zoom-controls">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(prev => Math.min(prev + 0.25, 3));
              }}
              className="image-zoom-control-button"
              aria-label="Aumentar zoom"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
              }}
              className="image-zoom-control-button"
              aria-label="Diminuir zoom"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRotation(prev => (prev + 90) % 360);
              }}
              className="image-zoom-control-button"
              aria-label="Rotacionar"
            >
              <RotateCw size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetImage();
              }}
              className="image-zoom-control-button text-xs px-3"
              aria-label="Resetar"
            >
              Reset
            </button>
          </div>

          {/* Navegação entre imagens */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="image-zoom-navigation prev"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="image-zoom-navigation next"
                aria-label="Próxima imagem"
              >
                <ChevronRight size={24} />
              </button>
              
              {/* Indicador de posição */}
              <div className="image-zoom-counter">
                {currentImageIndex + 1} de {imagens.length}
              </div>
            </>
          )}
          
          {/* Container da imagem */}
          <div 
            className="image-zoom-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imagemZoom.publicURL}
              alt={imagemZoom.legenda}
              className={`image-zoom-image ${imageOrientations[imagemZoom.id] || 'horizontal'}`}
              style={{
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-in-out'
              }}
            />
          </div>
            
          {/* Legenda no modal */}
          {imagemZoom.legenda && (
            <div className="image-zoom-caption">
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                {imagemZoom.legenda}
              </h3>
              
              {/* Informações adicionais */}
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-1 flex-wrap">
                {imagemZoom.categoria && (
                  <span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    {imagemZoom.categoria}
                  </span>
                )}
                {imagemZoom.autor && (
                  <span>Fotógrafo: {imagemZoom.autor}</span>
                )}
                {imagemZoom.dataFoto && (
                  <span>Data: {new Date(imagemZoom.dataFoto).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
              
              {/* Descrição detalhada */}
              {imagemZoom.descricaoDetalhada && (
                <p className="text-gray-700 leading-tight text-xs">
                  {imagemZoom.descricaoDetalhada}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

ImagemHistoriadoProfessor.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshKey: PropTypes.number,
};

export default React.memo(ImagemHistoriadoProfessor);
