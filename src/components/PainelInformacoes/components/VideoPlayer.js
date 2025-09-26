import React, { useState, useEffect } from 'react';
import { getTituloByVideoUrl } from '../../../services/legendasService';

/**
 * VideoPlayer
 * Componente para exibir vídeos do YouTube de forma responsiva e acessível.
 * Faz extração do ID do vídeo a partir de diferentes formatos de URL e exibe fallback amigável em caso de erro.
 * Props:
 *   - videoUrl: string (URL do vídeo)
 *   - title: string (opcional)
 *   - escolaId: number (ID da escola para buscar título personalizado)
 */

// Utility function to extract YouTube video ID
const extrairIdYoutube = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Remove query parameters to simplify
  const baseUrl = url.split('?')[0];

  // Patterns to extract video ID
  const patterns = [
    /youtube\.com\/embed\/([^/?&]+)/,                 // embed/ID
    /youtube\.com\/watch\?v=([^&]+)/,                 // watch?v=ID
    /youtu\.be\/([^?&]+)/,                            // youtu.be/ID
    /youtube\.com\/v\/([^?&]+)/                       // youtube.com/v/ID
  ];

  for (const pattern of patterns) {
    const match = baseUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const VideoPlayer = ({ videoUrl, title = "Vídeo", escolaId }) => {
  const [tituloPersonalizado, setTituloPersonalizado] = useState(null);
  const [, setLoading] = useState(false);

  // Buscar título personalizado da nova tabela
  useEffect(() => {
    const buscarTitulo = async () => {
      if (!videoUrl || !escolaId) return;

      try {
        setLoading(true);
        const titulo = await getTituloByVideoUrl(videoUrl, escolaId);
        setTituloPersonalizado(titulo);
      } catch (error) {
        console.warn('Erro ao buscar título personalizado:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarTitulo();
  }, [videoUrl, escolaId]);

  if (!videoUrl) return null;

  const videoId = extrairIdYoutube(videoUrl);
  
  if (!videoId) {
    return (
      <div className="mt-8 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-green-800 mb-4">
          {tituloPersonalizado?.titulo || title}:
        </h3>
        <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg">
          <p className="mb-3 text-lg">Link do vídeo inválido ou não suportado.</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-base font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            Tentar abrir no YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-green-800 mb-4">
        {tituloPersonalizado?.titulo || title}:
      </h3>
      
      {/* Informações adicionais do título personalizado */}
      {tituloPersonalizado && (
        <div className="mb-4 p-4 bg-green-100 rounded-lg">
          {tituloPersonalizado.descricao && (
            <p className="text-gray-700 mb-2">{tituloPersonalizado.descricao}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {tituloPersonalizado.categoria && (
              <span className="capitalize bg-green-200 text-green-800 px-2 py-1 rounded">
                {tituloPersonalizado.categoria}
              </span>
            )}
            {tituloPersonalizado.plataforma && (
              <span className="capitalize">
                {tituloPersonalizado.plataforma}
              </span>
            )}
            {tituloPersonalizado.duracao && (
              <span>Duração: {tituloPersonalizado.duracao}</span>
            )}
          </div>
        </div>
      )}
      
      <div className="rounded-lg overflow-hidden shadow-lg bg-white">
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={tituloPersonalizado?.titulo || title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="origin"
          />
        </div>
      </div>
      

    </div>
  );
};

export default React.memo(VideoPlayer); 