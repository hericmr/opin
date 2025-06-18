import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../supabaseClient';
import { X } from 'lucide-react';

const ImagemHistoriadoProfessor = ({ escola_id }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagemZoom, setImagemZoom] = useState(null);

  const fecharZoom = useCallback(() => setImagemZoom(null), []);

  // Fecha modal com tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharZoom();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fecharZoom]);

  useEffect(() => {
    if (!escola_id) return;

    setLoading(true);
    setError(null);
    const queryPattern = `${escola_id}/%`;

    supabase
      .from('imagens_escola')
      .select('*')
      .like('url', queryPattern)
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const imagensComUrl = data.map((img) => {
            try {
              const response = supabase.storage.from('imagens-professores').getPublicUrl(img.url);
              const publicURL =
                response.publicURL ||
                response.publicUrl ||
                response.data?.publicUrl ||
                response.data?.publicURL;

              let finalURL = publicURL;
              if (!finalURL) {
                const baseURL = supabase.storage.from('imagens-professores').getPublicUrl('').publicURL;
                if (baseURL) {
                  finalURL = baseURL.replace(/\/$/, '') + '/' + img.url;
                }
              }

              return { ...img, publicURL: finalURL };
            } catch (err) {
              return { ...img, publicURL: null, urlError: err.message };
            }
          });
          setImagens(imagensComUrl);
        } else {
          setImagens([]);
        }

        setLoading(false);
      })
      .catch(err => {
        setError(`Erro inesperado: ${err.message}`);
        setLoading(false);
      });
  }, [escola_id]);

  if (loading) {
    return <div className="text-gray-500">Carregando imagens do professor...</div>;
  }

  if (error) {
    return <div className="text-red-600">Erro ao carregar imagens: {error}</div>;
  }

  if (!imagens.length) {
    return null;
  }

  return (
    <section className="my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imagens.map((img) => (
          <figure
            key={img.id}
            className="rounded-lg overflow-hidden border bg-white shadow-sm flex flex-col cursor-pointer transition hover:shadow-md"
            onClick={() => img.publicURL && setImagemZoom(img)}
          >
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <img
                src={img.publicURL}
                alt={img.descricao || 'Imagem do professor'}
                className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                loading="lazy"
                style={{ maxHeight: '350px' }}
              />
            </div>
            {img.descricao && (
              <figcaption className="p-2 text-sm text-gray-700 bg-gray-50 border-t">
                {img.descricao}
              </figcaption>
            )}
            {img.urlError && (
              <div className="p-2 text-xs text-red-600 bg-red-50 border-t">
                Erro na URL: {img.urlError}
              </div>
            )}
          </figure>
        ))}
      </div>

      {/* Modal de zoom */}
      {imagemZoom && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={fecharZoom}
        >
          <button
            onClick={fecharZoom}
            className="absolute top-4 right-4 text-white hover:text-red-400 transition"
            aria-label="Fechar"
          >
            <X size={32} />
          </button>
          <img
            src={imagemZoom.publicURL}
            alt={imagemZoom.descricao || 'Imagem em destaque'}
            className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

ImagemHistoriadoProfessor.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default React.memo(ImagemHistoriadoProfessor);
