import logger from "../../../utils/logger";
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

// Utility function to extract video ID and platform
const extrairVideoInfo = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // YouTube
  const ytPatterns = [
    /(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/v\/)([^/?&]+)/,
  ];

  for (const pattern of ytPatterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      return { platform: 'youtube', id: match[1] };
    }
  }

  // Vimeo
  const vimeoPatterns = [
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
  ];

  for (const pattern of vimeoPatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return { platform: 'vimeo', id: match[1] };
    }
  }

  return null;
};

const VideoPlayer = ({ videoUrl, title = null, participantes = [], escolaId }) => {
  const [tituloPersonalizado, setTituloPersonalizado] = useState(null);
  const [, setLoading] = useState(false);

  // Buscar título personalizado da nova tabela (LEGACY SUPPORT)
  useEffect(() => {
    const buscarTitulo = async () => {
      if (!videoUrl || !escolaId) return;

      try {
        setLoading(true);
        const titulo = await getTituloByVideoUrl(videoUrl, escolaId);
        if (titulo) {
          setTituloPersonalizado(titulo);
        }
      } catch (error) {
        logger.warn('Erro ao buscar título personalizado de legenda:', error);
      } finally {
        setLoading(false);
      }
    };

    buscarTitulo();
  }, [videoUrl, escolaId]);

  if (!videoUrl) return null;

  const videoInfo = extrairVideoInfo(videoUrl);
  // Sem título próprio, os participantes viram o título; com título, aparecem abaixo dele
  const nomes = participantes.join(' e ');
  const displayTitle = tituloPersonalizado?.titulo || title || nomes || null;
  const subtitulo = displayTitle !== nomes ? nomes : '';

  if (!videoInfo) {
    return (
      <div className="not-prose max-w-4xl">
        {displayTitle && (
          <div className="mb-2">
            <h4 className="text-base font-medium text-gray-900 leading-snug">{displayTitle}</h4>
            {subtitulo && <p className="text-sm text-gray-600 mt-0.5">Com {subtitulo}</p>}
          </div>
        )}
        <div className="p-6 text-center text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
          <p className="mb-3 text-lg">Vídeo disponível externamente.</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-base font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors duration-200 shadow-md"
          >
            Abrir vídeo em nova aba
          </a>
        </div>
      </div>
    );
  }

  const embedUrl = videoInfo.platform === 'youtube' 
    ? `https://www.youtube.com/embed/${videoInfo.id}`
    : `https://player.vimeo.com/video/${videoInfo.id}`;

  return (
    <div className="not-prose max-w-4xl">
      {displayTitle && (
        <div className="mb-2">
          <h4 className="text-base font-medium text-gray-900 leading-snug">{displayTitle}</h4>
          {subtitulo && <p className="text-sm text-gray-600 mt-0.5">Com {subtitulo}</p>}
        </div>
      )}

      {/* Informações adicionais se disponíveis */}
      {tituloPersonalizado && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
          {tituloPersonalizado.descricao && (
            <p className="text-gray-700 mb-2">{tituloPersonalizado.descricao}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600">
            {tituloPersonalizado.categoria && (
              <span className="capitalize bg-green-200 text-green-800 px-2 py-1 rounded">
                {tituloPersonalizado.categoria}
              </span>
            )}
            <span className="capitalize">
              {videoInfo.platform}
            </span>
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200">
        <div className="relative pb-[56.25%] h-0">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={displayTitle}
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