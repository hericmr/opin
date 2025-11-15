import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import FilePreview from '../../../shared/FilePreview';

/**
 * Modal for replacing an existing image
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {Object} props.currentImage - Current image object
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onReplace - Replace handler (file: File) => void
 * @param {boolean} props.uploading - Whether replacement is in progress
 */
const ReplaceImageModal = ({ isOpen, currentImage, onClose, onReplace, uploading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleReplace = useCallback(async () => {
    if (selectedFile && onReplace) {
      await onReplace(selectedFile);
      setSelectedFile(null);
    }
  }, [selectedFile, onReplace]);

  const handleClose = useCallback(() => {
    setSelectedFile(null);
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Trocar Imagem</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selecione a nova imagem
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              className="w-full bg-gray-700 border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-100"
            />
          </div>
          
          {selectedFile && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pré-visualização
              </label>
              <FilePreview
                file={selectedFile}
                alt="Nova imagem"
                className="w-full h-32 object-cover rounded-lg border border-gray-600"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={handleReplace}
            disabled={!selectedFile || uploading}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {uploading ? 'Trocando...' : 'Trocar Imagem'}
          </button>
        </div>
      </div>
    </div>
  );
};

ReplaceImageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currentImage: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
  uploading: PropTypes.bool.isRequired,
};

export default ReplaceImageModal;

