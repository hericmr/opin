import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

const EXTENSOES = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_IMAGENS = 10;

const ImagensdasEscolas = ({ escola_id }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemZoom, setImagemZoom] = useState(null);
  const cacheRef = useRef({});

  const fecharZoom = useCallback(() => {
    setImagemZoom(null);
    document.body.style.overflow = 'auto';
  }, []);

  // ESC para fechar
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') fecharZoom();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fecharZoom]);

  useEffect(() => {
    if (!escola_id) {
      setLoading(false);
      return;
    }

    if (cacheRef.current[escola_id]) {
      setImagens(cacheRef.current[escola_id]);
      setLoading(false);
      return;
    }

    const buscarImagens = async () => {
      const imagensEncontradas = [];
      const fetchQueue = [];
      let active = 0;

      const fetchWithThrottle = async (url) => {
        while (active >= 3) {
          await new Promise(res => setTimeout(res, 30));
        }
        active++;
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return response.ok;
        } finally {
          active--;
        }
      };

      for (let i = 1; i <= MAX_IMAGENS; i++) {
        let encontrou = false;
        for (const ext of EXTENSOES) {
          const url = `https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/${escola_id}/${i}.${ext}`;
          fetchQueue.push(
            (async () => {
              if (encontrou) return;
              const ok = await fetchWithThrottle(url);
              if (ok) {
                imagensEncontradas.push({
                  id: `${escola_id}-${i}.${ext}`,
                  publicURL: url,
                  descricao: `Imagem ${i}`,
                  urlError: null,
                });
                encontrou = true;
              }
            })()
          );
        }
      }

      await Promise.all(fetchQueue);
      cacheRef.current[escola_id] = imagensEncontradas;
      setImagens(imagensEncontradas);
      setLoading(false);
    };

    buscarImagens();
  }, [escola_id]);

  if (loading) {
    return <div className="text-gray-500">Carregando imagens da escola...</div>;
  }

  if (!imagens.length) {
    return <div className="text-yellow-700">Nenhuma imagem encontrada para esta escola.</div>;
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
                alt={img.descricao}
                className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                loading="lazy"
                style={{ maxHeight: '350px' }}
              />
            </div>
          </figure>
        ))}
      </div>

      {/* Modal de Zoom */}
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
            alt={imagemZoom.descricao}
            className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

ImagensdasEscolas.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default React.memo(ImagensdasEscolas);
