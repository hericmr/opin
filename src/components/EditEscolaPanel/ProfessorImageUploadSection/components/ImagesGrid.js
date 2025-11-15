import React from 'react';
import PropTypes from 'prop-types';
import ImageCard from './ImageCard';

/**
 * Grid component for displaying images
 * @param {Object} props
 * @param {Array<Object>} props.images - Array of image objects
 * @param {Function} props.onImageReorder - Callback when images are reordered (newOrder: Image[]) => void
 * @param {Function} props.renderImageCard - Function to render each image card
 * @param {Object} props.dragHandlers - Drag & drop handlers from useImageDragDrop
 * @param {string|number} props.escolaId - School ID
 * @param {Object} props.headerImage - Header image state and functions
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onReplace - Replace handler
 * @param {Function} props.onLegendSave - Legend save handler
 * @param {Function} props.onLegendChange - Legend change handler
 */
const ImagesGrid = ({
  images,
  onImageReorder,
  dragHandlers,
  escolaId,
  headerImage,
  onDelete,
  onReplace,
  onLegendSave,
  onLegendChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-100">
          Imagens dos Professores ({images.length})
        </h4>
        <p className="text-sm text-gray-400">Arraste as imagens para reordenar</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            isHeader={headerImage?.headerImageUrl === image.publicURL}
            onDelete={onDelete}
            onReplace={onReplace}
            onSetHeader={headerImage?.setHeaderImage}
            onRemoveHeader={headerImage?.removeHeaderImage}
            onLegendSave={onLegendSave}
            onLegendChange={onLegendChange}
            dragHandlers={dragHandlers}
            index={index}
            escolaId={escolaId}
          />
        ))}
      </div>
    </div>
  );
};

ImagesGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onImageReorder: PropTypes.func.isRequired,
  dragHandlers: PropTypes.object.isRequired,
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  headerImage: PropTypes.object,
  onDelete: PropTypes.func,
  onReplace: PropTypes.func,
  onLegendSave: PropTypes.func.isRequired,
  onLegendChange: PropTypes.func.isRequired,
};

export default ImagesGrid;

