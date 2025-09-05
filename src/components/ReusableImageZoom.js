import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

const ReusableImageZoom = ({ 
  images = [], 
  currentImageIndex = 0, 
  isOpen = false, 
  onClose,
  onImageChange,
  showNavigation = true,
  showControls = true,
  showCounter = true,
  showCaption = true
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(currentImageIndex);

  // Reset zoom e rotação quando a imagem muda
  useEffect(() => {
    setZoomLevel(1);
    setRotation(0);
    setCurrentIndex(currentImageIndex);
  }, [currentImageIndex, isOpen]);

  const currentImage = images[currentIndex];

  const fecharZoom = useCallback(() => {
    setZoomLevel(1);
    setRotation(0);
    onClose();
  }, [onClose]);

  const resetImage = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      if (onImageChange) onImageChange(newIndex);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      if (onImageChange) onImageChange(newIndex);
    }
  };

  // Fecha modal com tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharZoom();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, fecharZoom]);

  // Navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          setRotation(prev => (prev + 90) % 360);
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
        case '0':
          e.preventDefault();
          resetImage();
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || !currentImage) return null;

  return (
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
      {showControls && (
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
      )}

      {/* Navegação entre imagens */}
      {showNavigation && images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="image-zoom-navigation prev"
            disabled={currentIndex === 0}
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
            disabled={currentIndex === images.length - 1}
            aria-label="Próxima imagem"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Contador de imagens */}
      {showCounter && images.length > 1 && (
        <div className="image-zoom-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Container da imagem */}
      <div className="image-zoom-container">
        <img
          src={currentImage.url || currentImage.publicURL || currentImage.imagem_public_url}
          alt={currentImage.descricao || currentImage.descricao_imagem || 'Imagem'}
          className="image-zoom-image"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            cursor: 'grab'
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => {
            e.preventDefault();
            // Implementar drag se necessário
          }}
        />

        {/* Legenda */}
        {showCaption && (currentImage.descricao || currentImage.descricao_imagem) && (
          <div className="image-zoom-caption">
            <h3 className="font-semibold text-white mb-2">
              {currentImage.descricao || currentImage.descricao_imagem}
            </h3>
            
            {/* Informações adicionais */}
            <div className="flex items-center gap-4 text-sm text-gray-300 mb-2">
              {currentImage.categoria && (
                <span className="capitalize bg-gray-600 px-2 py-1 rounded">
                  {currentImage.categoria}
                </span>
              )}
              {currentImage.autor && (
                <span>Fotógrafo: {currentImage.autor}</span>
              )}
              {currentImage.dataFoto && (
                <span>Data: {new Date(currentImage.dataFoto).toLocaleDateString('pt-BR')}</span>
              )}
            </div>
            
            {/* Descrição detalhada */}
            {currentImage.descricaoDetalhada && (
              <p className="text-gray-300 leading-relaxed">
                {currentImage.descricaoDetalhada}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Instruções de teclado */}
      <div className="image-zoom-instructions">
        <div className="text-xs text-gray-400 space-y-1">
          <div>ESC: Fechar | ← →: Navegar | R: Rotacionar</div>
          <div>+ -: Zoom | 0: Reset</div>
        </div>
      </div>
    </div>
  );
};

ReusableImageZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    url: PropTypes.string,
    publicURL: PropTypes.string,
    imagem_public_url: PropTypes.string,
    descricao: PropTypes.string,
    descricao_imagem: PropTypes.string,
    categoria: PropTypes.string,
    autor: PropTypes.string,
    dataFoto: PropTypes.string,
    descricaoDetalhada: PropTypes.string
  })).isRequired,
  currentImageIndex: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImageChange: PropTypes.func,
  showNavigation: PropTypes.bool,
  showControls: PropTypes.bool,
  showCounter: PropTypes.bool,
  showCaption: PropTypes.bool
};

export default ReusableImageZoom;
