import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const EXTENSOES = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_IMAGENS = 10; // Ajuste conforme necessário

const ImagensdasEscolas = ({ escola_id }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemAmpliada, setImagemAmpliada] = useState(null);
  const cacheRef = useRef({});

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
      let i = 1;
      let stopped = false;

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

      for (i = 1; i <= MAX_IMAGENS; i++) {
        for (const ext of EXTENSOES) {
          const url = `https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/${escola_id}/${i}.${ext}`;
          fetchQueue.push(
            (async () => {
              if (stopped) return;
              const ok = await fetchWithThrottle(url);
              if (ok) {
                imagensEncontradas.push({
                  id: `${escola_id}-${i}.${ext}`,
                  publicURL: url,
                  descricao: `Imagem ${i}`,
                  urlError: null,
                });
                stopped = true; // Stop further extensions for this i
              }
            })()
          );
        }
        stopped = false;
      }
      await Promise.all(fetchQueue);
      cacheRef.current[escola_id] = imagensEncontradas;
      setImagens(imagensEncontradas);
      setLoading(false);
    };

    buscarImagens();
  }, [escola_id]);

  const abrirModal = (imagem) => {
    setImagemAmpliada(imagem);
    document.body.style.overflow = 'hidden'; // Previne scroll da página
  };

  const fecharModal = () => {
    setImagemAmpliada(null);
    document.body.style.overflow = 'auto'; // Restaura scroll da página
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      fecharModal();
    }
  };

  if (loading) {
    return <div className="text-gray-500">Carregando imagens da escola...</div>;
  }

  if (!imagens.length) {
    return <div className="text-yellow-700">Nenhuma imagem encontrada para esta escola.</div>;
  }

  return (
    <>
      <section className="my-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagens.map((img, index) => (
            <figure key={img.id} className="rounded-lg overflow-hidden border bg-gray-50 shadow-sm flex flex-col cursor-pointer group">
              <div 
                className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center relative"
                onClick={() => abrirModal(img)}
              >
                <img
                  src={img.publicURL}
                  alt={img.descricao}
                  className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                  style={{ maxHeight: '350px' }}
                />
                {/* Overlay sutil para indicar que é clicável */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* Modal para imagem ampliada */}
      {imagemAmpliada && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={fecharModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative max-w-full max-h-full">
            {/* Botão fechar */}
            <button
              onClick={fecharModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              aria-label="Fechar imagem"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Imagem ampliada */}
            <img
              src={imagemAmpliada.publicURL}
              alt={imagemAmpliada.descricao}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Previne fechamento ao clicar na imagem
            />
            
            {/* Indicador de que pode clicar fora para fechar */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
              Clique fora ou pressione ESC para fechar
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ImagensdasEscolas.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ImagensdasEscolas;