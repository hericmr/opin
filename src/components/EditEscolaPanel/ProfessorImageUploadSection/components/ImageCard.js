import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GripVertical, Check } from 'lucide-react';
import OptimizedImage from '../../../shared/OptimizedImage';
import ImageActions from './ImageActions';
import LegendForm from './LegendForm';
import useImagePreloader from '../../../../hooks/useImagePreloader';

/**
 * Individual image card component with all functionality
 * @param {Object} props
 * @param {Object} props.image - Image object
 * @param {boolean} props.isHeader - Whether this image is the header image
 * @param {Function} props.onDelete - Delete handler (imageId: string, filePath: string) => void
 * @param {Function} props.onReplace - Replace handler (imageId: string) => void
 * @param {Function} props.onSetHeader - Set as header handler (imageUrl: string) => void
 * @param {Function} props.onRemoveHeader - Remove from header handler
 * @param {Function} props.onLegendSave - Save legend handler (image: Object) => void
 * @param {Function} props.onLegendChange - Legend change handler (imageId: string, field: string, value: any) => void
 * @param {Object} props.dragHandlers - Drag & drop handlers
 * @param {number} props.index - Image index
 * @param {string|number} props.escolaId - School ID for preloader
 */
const ImageCard = ({
  image,
  isHeader,
  onDelete,
  onReplace,
  onSetHeader,
  onRemoveHeader,
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

  return (
    <div
      key={image.id}
      draggable
      onDragStart={(e) => dragHandlers?.handleDragStart(e, index)}
      onDragOver={(e) => dragHandlers?.handleDragOver(e, index)}
      onDragLeave={dragHandlers?.handleDragLeave}
      onDrop={(e) => dragHandlers?.handleDrop(e, index)}
      onDragEnd={dragHandlers?.handleDragEnd}
      className={`relative bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden shadow-sm transition-all cursor-move group ${
        isHeader ? 'ring-2 ring-blue-400' : ''
      } ${
        isDragged ? 'opacity-50 scale-95' : ''
      } ${
        isDragOver ? 'ring-2 ring-blue-500 scale-105' : ''
      }`}
    >
      {/* Image Container - EXATAMENTE como painel de informações */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        {/* Drag Handle */}
        <div className="absolute top-2 right-2 z-10 bg-gray-900/80 p-1 rounded cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        
        {/* Renderizar imagem EXATAMENTE como no painel de informações */}
        <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center relative">
          {(() => {
            // Try multiple URL sources - exactly like information panel
            const imageUrl = image.publicURL || image.publicUrl || image.url;
            
            if (!imageUrl) {
              console.warn('[ImageCard] No URL found for image:', image);
              return (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <p className="text-sm">Sem URL da imagem</p>
                    <p className="text-xs text-gray-500 mt-1">ID: {image.id}</p>
                    <p className="text-xs text-gray-500">URL: {image.url || 'N/A'}</p>
                    <p className="text-xs text-gray-500">publicURL: {image.publicURL || 'N/A'}</p>
                    <p className="text-xs text-gray-500">publicUrl: {image.publicUrl || 'N/A'}</p>
                  </div>
                </div>
              );
            }
            
            return (
              <OptimizedImage
                src={imageUrl}
                alt={image.descricao || image.legendaData?.legenda || 'Imagem da escola'}
                className="w-full h-full object-cover object-center"
                isPreloaded={isImagePreloaded(imageUrl)}
                style={{ maxHeight: '350px', display: 'block' }}
                onError={(e) => {
                  console.error('[ImageCard] Error loading image:', {
                    src: imageUrl,
                    image: image,
                    error: e
                  });
                }}
                onLoad={() => {
                  console.log('[ImageCard] Image loaded successfully:', imageUrl);
                }}
              />
            );
          })()}
        </div>
        
        {/* Header Badge */}
        {isHeader && (
          <div className="absolute top-2 left-2 z-20 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Check className="w-3 h-3" />
            Header
          </div>
        )}
        
        {/* Actions Overlay */}
        <ImageActions
          image={image}
          isHeader={isHeader}
          onDelete={onDelete}
          onReplace={handleReplace}
          onSetHeader={onSetHeader}
          onRemoveHeader={onRemoveHeader}
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
  onDelete: PropTypes.func,
  onReplace: PropTypes.func,
  onSetHeader: PropTypes.func,
  onRemoveHeader: PropTypes.func,
  onLegendSave: PropTypes.func.isRequired,
  onLegendChange: PropTypes.func.isRequired,
  dragHandlers: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ImageCard;

