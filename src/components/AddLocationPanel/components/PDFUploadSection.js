import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { uploadPDF } from '../../../services/uploadService';
import { FILE_RESTRICTIONS } from '../../../config/storage';

const PDFUploadSection = ({ onUploadComplete, onRemove, existingUrls = [] }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(existingUrls);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate number of files
    if (selectedFiles.length + files.length > FILE_RESTRICTIONS.PDF.MAX_FILES) {
      setError(`Máximo de ${FILE_RESTRICTIONS.PDF.MAX_FILES} arquivos permitidos`);
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      const isValidType = FILE_RESTRICTIONS.PDF.ALLOWED_TYPES.includes(file.type);
      const isValidSize = file.size <= FILE_RESTRICTIONS.PDF.MAX_SIZE;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Alguns arquivos foram ignorados. Use apenas PDFs até 10MB.');
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError(null);
    const uploadedUrls = [];

    try {
      for (const file of selectedFiles) {
        const url = await uploadPDF(file);
        uploadedUrls.push(url);
      }

      const allUrls = [...previewUrls, ...uploadedUrls];
      setPreviewUrls(allUrls);
      onUploadComplete(allUrls);
      setSelectedFiles([]);
    } catch (err) {
      setError('Erro ao fazer upload dos arquivos. Tente novamente.');
      console.error('Erro no upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    onRemove(newUrls);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block font-medium text-gray-800">
          Documentos PDF
          <span className="text-sm text-gray-500 ml-2">
            (Máx. {FILE_RESTRICTIONS.PDF.MAX_FILES} arquivos, {FILE_RESTRICTIONS.PDF.MAX_SIZE / (1024 * 1024)}MB cada)
          </span>
        </label>
        {error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </div>
        )}
      </div>

      {/* File Input */}
      <div className="grid grid-cols-1 gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || selectedFiles.length >= FILE_RESTRICTIONS.PDF.MAX_FILES}
          />
          <div className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 
            ${isUploading ? 'border-gray-300 bg-gray-50' : 'border-blue-300 hover:border-blue-400 bg-blue-50'}`}>
            <Upload size={20} className={isUploading ? 'text-gray-400' : 'text-blue-500'} />
            <span className={isUploading ? 'text-gray-500' : 'text-blue-600'}>
              {isUploading ? 'Fazendo upload...' : 'Selecionar PDFs'}
            </span>
          </div>
        </label>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Arquivos selecionados:</h4>
            <div className="grid grid-cols-1 gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <File size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium
                ${isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              {isUploading ? 'Enviando...' : 'Fazer Upload'}
            </button>
          </div>
        )}

        {/* Uploaded Files Preview */}
        {previewUrls.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Documentos enviados:</h4>
            <div className="grid grid-cols-1 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <File size={16} className="text-gray-500" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Documento {index + 1}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PDFUploadSection.propTypes = {
  onUploadComplete: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  existingUrls: PropTypes.arrayOf(PropTypes.string),
};

export default PDFUploadSection; 