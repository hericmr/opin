import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../supabaseClient';
import { getLegendaByImageUrl } from '../../../services/legendasService';
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

    // Busca arquivos do bucket diretamente
    supabase
      .storage
      .from('imagens-professores')
      .list(`${escola_id}/`)
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          const imagensComUrl = await Promise.all(data.map(async (file, idx) => {
            const { data: { publicUrl } } = supabase
              .storage
              .from('imagens-professores')
              .getPublicUrl(`${escola_id}/${file.name}`);
            
            // Extrair gênero do nome do arquivo
            let genero = 'professor';
            if (file.name.startsWith('professora_')) {
              genero = 'professora';
            } else if (file.name.startsWith('professor_')) {
              genero = 'professor';
            }

            // Buscar legenda da nova tabela
            let legenda = null;
            try {
              legenda = await getLegendaByImageUrl(publicUrl, escola_id, 'professor');
            } catch (error) {
              console.warn('Erro ao buscar legenda:', error);
            }

            return {
              id: idx + 1,
              publicURL: publicUrl,
              genero,
              nome: file.name,
              created_at: file.created_at || '',
              legenda: legenda?.legenda || `Imagem do ${genero}`,
              descricaoDetalhada: legenda?.descricao_detalhada,
              autor: legenda?.autor_foto,
              dataFoto: legenda?.data_foto,
              categoria: legenda?.categoria,
            };
          }));
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
                alt={img.legenda}
                className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                loading="lazy"
                style={{ maxHeight: '350px' }}
              />
            </div>
            
            {/* Legenda da imagem */}
            {img.legenda && (
              <figcaption className="p-3 bg-white">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {img.legenda}
                </h4>
                
                {/* Informações adicionais */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {img.categoria && (
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                      {img.categoria}
                    </span>
                  )}
                  {img.autor && (
                    <span>Por: {img.autor}</span>
                  )}
                  {img.dataFoto && (
                    <span>{new Date(img.dataFoto).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
                
                {/* Descrição detalhada */}
                {img.descricaoDetalhada && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {img.descricaoDetalhada}
                  </p>
                )}
              </figcaption>
            )}
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
          
          <div className="max-w-4xl max-h-full">
          <img
            src={imagemZoom.publicURL}
              alt={imagemZoom.legenda}
            className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
            
            {/* Legenda no modal */}
            {imagemZoom.legenda && (
              <div className="mt-4 bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {imagemZoom.legenda}
                </h3>
                
                {/* Informações adicionais */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  {imagemZoom.categoria && (
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                      {imagemZoom.categoria}
                    </span>
                  )}
                  {imagemZoom.autor && (
                    <span>Fotógrafo: {imagemZoom.autor}</span>
                  )}
                  {imagemZoom.dataFoto && (
                    <span>Data: {new Date(imagemZoom.dataFoto).toLocaleDateString('pt-BR')}</span>
                  )}
                </div>
                
                {/* Descrição detalhada */}
                {imagemZoom.descricaoDetalhada && (
                  <p className="text-gray-700 leading-relaxed">
                    {imagemZoom.descricaoDetalhada}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

ImagemHistoriadoProfessor.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default React.memo(ImagemHistoriadoProfessor);
