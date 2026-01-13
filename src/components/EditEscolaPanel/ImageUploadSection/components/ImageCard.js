import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GripVertical, Check } from 'lucide-react';
import ImageActions from './ImageActions';
import LegendForm from './LegendForm';
import useImagePreloader from '../../../../hooks/useImagePreloader';
import { supabase } from '../../../../dbClient';
import { getLocalImageUrl } from '../../../../utils/imageUtils';

/**
 * Individual image card component with all functionality
 * @param {Object} props
 * @param {Object} props.image - Image object
 * @param {boolean} props.isHeader - Whether this image is the header image
 * @param {boolean} props.isDrawing - Whether this image is a drawing
 * @param {Function} props.onDelete - Delete handler (imageId: string, filePath: string) => void
 * @param {Function} props.onReplace - Replace handler (imageId: string) => void
 * @param {Function} props.onSetHeader - Set as header handler (imageUrl: string) => void
 * @param {Function} props.onRemoveHeader - Remove from header handler
 * @param {Function} props.onAddDrawing - Add to drawings handler (imageUrl: string) => void
 * @param {Function} props.onRemoveDrawing - Remove from drawings handler (imageUrl: string) => void
 * @param {Function} props.onLegendSave - Save legend handler (image: Object) => void
 * @param {Function} props.onLegendChange - Legend change handler (imageId: string, field: string, value: any) => void
 * @param {Object} props.dragHandlers - Drag & drop handlers
 * @param {number} props.index - Image index
 * @param {string|number} props.escolaId - School ID for preloader
 */
const ImageCard = ({
  image,
  isHeader,
  isDrawing,
  onDelete,
  onReplace,
  onSetHeader,
  onRemoveHeader,
  onAddDrawing,
  onRemoveDrawing,
  onLegendSave,
  onLegendChange,
  dragHandlers,
  index,
  escolaId,
}) => {
  const [expandedDetails, setExpandedDetails] = useState(false);
  const { isImagePreloaded } = useImagePreloader(escolaId, true);

  const toggleDetails = () => {
    setExpandedDetails(prev => !prev);
  };

  const handleLegendChange = (field, value) => {
    if (onLegendChange) {
      onLegendChange(image.id, field, value);
    }
  };

  const handleLegendSave = () => {
    if (onLegendSave) {
      onLegendSave(image);
    }
  };

  const handleReplace = () => {
    if (onReplace) {
      onReplace(image.id);
    }
  };

  const isDragged = dragHandlers?.draggedIndex === index;
  const isDragOver = dragHandlers?.dragOverIndex === index;

  // Get image URL - use helper to ensure Vite compatibility
  const imageUrl = (() => {
    // Try local resolution first
    const url = image.publicURL || image.publicUrl;
    const localUrl = getLocalImageUrl(url);
    if (localUrl !== url) return localUrl;

    if (!url) return '';

    // If it's already a full URL (http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If it's a relative path, prepend BASE_URL for Vite compatibility
    const baseUrl = import.meta.env.BASE_URL || '/opin/';
    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl.replace(/\/$/, '')}${normalizedUrl}`;
  })();

  // Debug log to verify URL is available
  if (!imageUrl && image.id) {
    console.warn('[ImageCard] Missing URL for image:', {
      id: image.id,
      url: image.url,
      publicURL: image.publicURL,
      publicUrl: image.publicUrl,
      image: image
    });
  }

  return (
    <div
      key={image.id}
      draggable
      onDragStart={(e) => dragHandlers?.handleDragStart(e, index)}
      onDragOver={(e) => dragHandlers?.handleDragOver(e, index)}
      onDragLeave={dragHandlers?.handleDragLeave}
      onDrop={(e) => dragHandlers?.handleDrop(e, index)}
      onDragEnd={dragHandlers?.handleDragEnd}
      className={`relative bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden shadow-sm transition-all cursor-move group ${isHeader ? 'ring-2 ring-blue-400' : ''
        } ${isDragged ? 'opacity-50 scale-95' : ''
        } ${isDragOver ? 'ring-2 ring-blue-500 scale-105' : ''
        }`}
    >
      {/* Image Container - EXATAMENTE como painel de informações */}
      <div
        className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '150px',
          display: 'block'
        }}
      >
        {/* Renderizar imagem EXATAMENTE como no painel de informações */}
        {!imageUrl ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-800 z-0">
            <div className="text-center">
              <p className="text-sm">Sem URL da imagem</p>
              <p className="text-xs text-gray-500 mt-1">ID: {image.id}</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={image.descricao || image.legendaData?.legenda || 'Imagem da escola'}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading={isImagePreloaded(imageUrl) ? "eager" : "lazy"}
            style={{
              display: 'block',
              visibility: 'visible',
              opacity: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              // Garantir que imagem fique acima de qualquer overlay quando necessário
              pointerEvents: 'auto'
            }}
            onError={(e) => {
              console.error('[ImageCard] Error loading image:', {
                src: imageUrl,
                imageId: image.id,
                publicURL: image.publicURL,
                publicUrl: image.publicUrl,
                url: image.url
              });
              e.target.style.opacity = '0.5';
            }}
            onLoad={(e) => {
              console.log('[ImageCard] Image loaded successfully:', {
                imageUrl,
                naturalWidth: e.target.naturalWidth,
                naturalHeight: e.target.naturalHeight
              });
              e.target.style.opacity = '1';
              e.target.style.display = 'block';
            }}
          />
        )}

        {/* Drag Handle */}
        <div className="absolute top-2 right-2 z-30 bg-gray-900/80 p-1 rounded cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {/* Header Badge */}
        {isHeader && (
          <div className="absolute top-2 left-2 z-20 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            Header
          </div>
        )}

        {/* Drawing Badge */}
        {isDrawing && (
          <div className="absolute top-2 left-2 z-20 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            Desenho
          </div>
        )}

        {/* Actions Overlay - Só interage quando em hover, não bloqueia imagem */}
        <ImageActions
          image={image}
          isHeader={isHeader}
          isDrawing={isDrawing}
          onDelete={onDelete}
          onReplace={handleReplace}
          onSetHeader={onSetHeader}
          onRemoveHeader={onRemoveHeader}
          onAddDrawing={onAddDrawing}
          onRemoveDrawing={onRemoveDrawing}
        />
      </div>

      {/* Caption below thumbnail */}
      {(image.legendaData?.legenda || image.descricao) && (
        <div className="px-4 pb-2 pt-1">
          <p className="text-sm font-medium text-gray-200 line-clamp-2">
            {image.legendaData?.legenda || image.descricao}
          </p>
        </div>
      )}

      {/* Legend Form */}
      <LegendForm
        image={image}
        legendData={image.legendaData}
        onChange={handleLegendChange}
        onSave={handleLegendSave}
        expanded={expandedDetails}
        onToggleExpand={toggleDetails}
      />
    </div>
  );
};

ImageCard.propTypes = {
  image: PropTypes.object.isRequired,
  isHeader: PropTypes.bool.isRequired,
  isDrawing: PropTypes.bool,
  onDelete: PropTypes.func,
  onReplace: PropTypes.func,
  onSetHeader: PropTypes.func,
  onRemoveHeader: PropTypes.func,
  onAddDrawing: PropTypes.func,
  onRemoveDrawing: PropTypes.func,
  onLegendSave: PropTypes.func.isRequired,
  onLegendChange: PropTypes.func.isRequired,
  dragHandlers: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ImageCard;

