import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Upload } from 'lucide-react';

/**
 * Upload area with drag & drop support
 * @param {Object} props
 * @param {Function} props.onFilesSelected - Callback when files are selected via input
 * @param {Function} props.onDrop - Callback when files are dropped
 * @param {boolean} props.disabled - Whether upload is disabled
 * @param {string} [props.accept] - Accepted file types
 * @param {number} [props.maxSize] - Maximum file size in bytes
 */
const UploadArea = ({ 
  onFilesSelected, 
  onDrop, 
  disabled = false,
  accept = 'image/jpeg,image/jpg,image/png,image/webp,image/gif',
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const handleFileSelect = useCallback((event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files);
    }
    // Reset input so same file can be selected again
    event.target.value = '';
  }, [onFilesSelected]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    if (files.length > 0 && onDrop) {
      // Filter only images
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        onDrop(imageFiles);
      }
    }
  }, [onDrop]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        disabled 
          ? 'border-gray-600 bg-gray-800/50' 
          : 'border-gray-600 bg-gray-800/50 hover:border-green-400 hover:bg-gray-700/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="w-8 h-8 text-green-400 mx-auto mb-2" />
      <p className="text-gray-300 mb-2">
        Arraste imagens dos professores aqui ou clique para selecionar
      </p>
      <p className="text-sm text-gray-400 mb-4">
        JPG, PNG, WEBP, GIF • Máximo {maxSize / (1024 * 1024)}MB por arquivo • Máximo 5 imagens
      </p>
      
      <label className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors">
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        Selecionar Arquivos
      </label>
    </div>
  );
};

UploadArea.propTypes = {
  onFilesSelected: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
};

export default UploadArea;

