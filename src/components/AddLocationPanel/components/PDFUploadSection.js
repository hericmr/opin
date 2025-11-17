import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Upload, File, X, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { uploadPDF } from '../../../services/uploadService';
import { FILE_RESTRICTIONS } from '../../../config/storage';
import { isGoogleDriveLink, validateGoogleDriveLink } from '../../../services/documentoService';

const PDFUploadSection = ({ onUploadComplete, onRemove, existingUrls = [] }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(existingUrls);
  const [googleDocsLink, setGoogleDocsLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

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

  const handleAddGoogleDocsLink = () => {
    if (!googleDocsLink.trim()) {
      setError('Por favor, insira um link do Google Drive ou Google Docs');
      return;
    }

    const validation = validateGoogleDriveLink(googleDocsLink.trim());
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    const allUrls = [...previewUrls, googleDocsLink.trim()];
    setPreviewUrls(allUrls);
    onUploadComplete(allUrls);
    setGoogleDocsLink('');
    setShowLinkInput(false);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block font-medium text-gray-800">
          Documentos PDF e Links do Google Drive
          <span className="text-sm text-gray-500 ml-2">
            (Máx. {FILE_RESTRICTIONS.PDF.MAX_SIZE / (1024 * 1024)}MB cada arquivo PDF)
          </span>
        </label>
        {error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle size={16} className="mr-1" />
            {error}
          </div>
        )}
      </div>

      {/* Botão para adicionar link do Google Docs */}
      {!showLinkInput && (
        <button
          type="button"
          onClick={() => setShowLinkInput(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:border-green-400 hover:bg-green-50 transition-colors"
        >
          <LinkIcon size={18} />
          <span>Adicionar link do Google Drive/Docs</span>
        </button>
      )}

      {/* Input para link do Google Docs */}
      {showLinkInput && (
        <div className="space-y-2 p-4 border-2 border-dashed border-green-300 rounded-lg bg-green-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link do Google Drive ou Google Docs
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={googleDocsLink}
              onChange={(e) => {
                setGoogleDocsLink(e.target.value);
                setError(null);
              }}
              placeholder="https://drive.google.com/file/d/..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={handleAddGoogleDocsLink}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setGoogleDocsLink('');
                setError(null);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Cole o link completo do documento no Google Drive ou Google Docs
          </p>
        </div>
      )}

      {/* File Input */}
      <div className="grid grid-cols-1 gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
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
                    {isGoogleDriveLink(url) ? (
                      <LinkIcon size={16} className="text-green-600" />
                    ) : (
                      <File size={16} className="text-gray-500" />
                    )}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate"
                      title={url}
                    >
                      {isGoogleDriveLink(url) ? 'Google Drive/Docs' : 'PDF'} - Documento {index + 1}
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