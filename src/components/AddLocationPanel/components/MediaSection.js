import React from 'react';
import PropTypes from 'prop-types';

const MediaSection = ({ type, preview, onUpload, onRemove }) => (
  <div>
    <label className="block font-medium" htmlFor={`${type}Upload`}>
      {type === 'image' ? 'Imagens' : 'Vídeo (YouTube URL)'}
    </label>
    {type === 'image' ? (
      <>
        <input
          id={`${type}Upload`}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onUpload}
          className="hidden"
        />
        <label
          htmlFor={`${type}Upload`}
          className="cursor-pointer flex items-center justify-center border rounded p-4 bg-gray-100 text-black"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
          ) : (
            <span>📷 Tirar Foto ou Escolher Imagem</span>
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
    {preview && (
      <button
        type="button"
        onClick={onRemove}
        className="mt-2 text-red-500 hover:text-red-700"
      >
        Remover {type === 'image' ? 'Imagem' : 'Vídeo'}
      </button>
    )}
  </div>
);

MediaSection.propTypes = {
  type: PropTypes.oneOf(['image', 'video']).isRequired,
  preview: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default MediaSection; 