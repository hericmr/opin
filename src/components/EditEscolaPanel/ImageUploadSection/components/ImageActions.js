import React from 'react';
import PropTypes from 'prop-types';
import { Trash2, RefreshCw, Check, X, Palette } from 'lucide-react';

/**
 * Action buttons overlay for image card
 * @param {Object} props
 * @param {Object} props.image - Image object
 * @param {boolean} props.isHeader - Whether this image is the header image
 * @param {boolean} props.isDrawing - Whether this image is a drawing
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onReplace - Replace handler
 * @param {Function} props.onSetHeader - Set as header handler
 * @param {Function} props.onRemoveHeader - Remove from header handler
 * @param {Function} props.onAddDrawing - Add to drawings handler
 * @param {Function} props.onRemoveDrawing - Remove from drawings handler
 * @param {boolean} [props.loading] - Whether action is loading
 */
const ImageActions = ({
  image,
  isHeader,
  isDrawing,
  onDelete,
  onReplace,
  onSetHeader,
  onRemoveHeader,
  onAddDrawing,
  onRemoveDrawing,
  loading = false,
}) => {
  // Debug: verificar se handlers estão disponíveis
  if (process.env.NODE_ENV === 'development') {
    console.log('[ImageActions] Handlers disponíveis:', {
      hasOnSetHeader: !!onSetHeader,
      hasOnRemoveHeader: !!onRemoveHeader,
      hasOnAddDrawing: !!onAddDrawing,
      hasOnRemoveDrawing: !!onRemoveDrawing,
      isHeader,
      isDrawing
    });
  }

  return (
    <div 
      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center pointer-events-none"
      style={{
        // CRÍTICO: Garantir que quando não está em hover, não bloqueie NADA
        pointerEvents: 'none',
        // Garantir que não interfira visualmente quando transparente
        willChange: 'opacity',
        // z-index menor que a imagem quando não está em hover (imagem tem zIndex: 1)
        // Quando em hover, o CSS group-hover pode aumentar se necessário
        zIndex: 0
      }}
      aria-hidden="true"
    >
      <div 
        className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20"
        style={{
          // Só permitir pointer events quando visível (hover) - controlado pelo parent
          pointerEvents: 'inherit',
          // Garantir que botões sejam sempre clicáveis quando visíveis
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Classification Buttons - Header */}
        {/* Button to set as header - SEMPRE mostrar se handler disponível */}
        {!isHeader && onSetHeader && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetHeader(image.publicURL);
            }}
            disabled={loading}
            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg"
            title="Usar como imagem do header"
            type="button"
          >
            <Check className="w-5 h-5" />
          </button>
        )}
        
        {/* Button to remove from header - SEMPRE mostrar se é header e handler disponível */}
        {isHeader && onRemoveHeader && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveHeader();
            }}
            disabled={loading}
            className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-700 disabled:opacity-50 transition-colors shadow-lg"
            title="Remover do header"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Classification Buttons - Drawings */}
        {/* Button to add to drawings - SEMPRE mostrar se handler disponível */}
        {!isDrawing && onAddDrawing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddDrawing(image.publicURL);
            }}
            disabled={loading}
            className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-lg"
            title="Adicionar aos Desenhos"
            type="button"
          >
            <Palette className="w-5 h-5" />
          </button>
        )}
        
        {/* Button to remove from drawings - SEMPRE mostrar se é drawing e handler disponível */}
        {isDrawing && onRemoveDrawing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveDrawing(image.publicURL);
            }}
            disabled={loading}
            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-800 disabled:opacity-50 transition-colors shadow-lg"
            title="Remover dos Desenhos"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Button to replace image */}
        {onReplace && (
          <button
            onClick={onReplace}
            className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-700"
            title="Trocar imagem"
            type="button"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        )}
        
        {/* Button to delete image */}
        {onDelete && (
          <button
            onClick={() => onDelete(image.id, image.url)}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-700"
            title="Excluir imagem"
            type="button"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

ImageActions.propTypes = {
  image: PropTypes.object.isRequired,
  isHeader: PropTypes.bool.isRequired,
  isDrawing: PropTypes.bool,
  onDelete: PropTypes.func,
  onReplace: PropTypes.func,
  onSetHeader: PropTypes.func,
  onRemoveHeader: PropTypes.func,
  onAddDrawing: PropTypes.func,
  onRemoveDrawing: PropTypes.func,
  loading: PropTypes.bool,
};

export default ImageActions;

