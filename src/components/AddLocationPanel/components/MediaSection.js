import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadImage, uploadAudio } from '../../../services/uploadService';

const MediaSection = ({ type, preview, onUpload, onRemove, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      let url;
      if (type === 'image') {
        url = await uploadImage(file);
      } else if (type === 'audio') {
        url = await uploadAudio(file);
      }

      onUploadComplete(url);
      onUpload(event);
    } catch (err) {
      setError('Erro ao fazer upload do arquivo. Tente novamente.');
      console.error('Erro no upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block font-medium" htmlFor={`${type}Upload`}>
        {type === 'image' ? 'Imagens' : type === 'audio' ? 'Áudio' : 'Vídeo (YouTube URL)'}
      </label>
      {type === 'image' || type === 'audio' ? (
        <>
          <input
            id={`${type}Upload`}
            type="file"
            accept={type === 'image' ? 'image/*' : 'audio/*'}
            capture={type === 'image' ? 'environment' : undefined}
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <label
            htmlFor={`${type}Upload`}
            className={`cursor-pointer flex items-center justify-center border rounded p-4 bg-gray-100 text-black ${
              isUploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {preview ? (
              type === 'image' ? (
                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
              ) : (
                <audio controls src={preview} className="w-full" />
              )
            ) : (
              <span>
                {isUploading ? 'Fazendo upload...' : type === 'image' ? '📷 Tirar Foto ou Escolher Imagem' : '🎵 Escolher Arquivo de Áudio'}
              </span>
            )}
          </label>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Cole a URL do YouTube"
            className="w-full border rounded p-2 text-black"
            onChange={onUpload}
          />
          {preview && (
            <div className="mt-2">
              <iframe
                width="100%"
                height="200"
                src={preview}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      {preview && (
        <button
          type="button"
          onClick={onRemove}
          className="mt-2 text-red-500 hover:text-red-700"
        >
          Remover {type === 'image' ? 'Imagem' : type === 'audio' ? 'Áudio' : 'Vídeo'}
        </button>
      )}
    </div>
  );
};

MediaSection.propTypes = {
  type: PropTypes.oneOf(['image', 'video', 'audio']).isRequired,
  preview: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUploadComplete: PropTypes.func.isRequired,
};

export default MediaSection; 