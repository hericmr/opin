import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../supabaseClient';
import { getLegendaByImageUrlFlexivel } from '../../../services/legendasService';
import ReusableImageZoom from '../../ReusableImageZoom';
import OptimizedImage from '../../shared/OptimizedImage';
import useImagePreloader from '../../../hooks/useImagePreloader';
import '../../ReusableImageZoom.css';

const ImagemHistoriadoProfessor = ({ escola_id, refreshKey = 0, isMaximized = false }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagemZoom, setImagemZoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hook de preload de imagens
  const { isImagePreloaded } = useImagePreloader(escola_id, true);

  const fecharZoom = useCallback(() => {
    setImagemZoom(null);
    setCurrentImageIndex(0);
  }, []);



  // Forçar recarga quando refreshKey mudar
  useEffect(() => {
    if (refreshKey > 0) {
      console.log('ImagemHistoriadoProfessor: refreshKey mudou, forçando recarga');
      setImagens([]);
      setLoading(true);
      setError(null);
    }
  }, [refreshKey]);

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
          console.log('Arquivos de professores encontrados:', data.length);
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
              const caminhoRelativo = `${escola_id}/${file.name}`;
              console.log('Buscando legenda para professor:', caminhoRelativo);
              legenda = await getLegendaByImageUrlFlexivel(caminhoRelativo, escola_id, {
                categoria: 'professor',
                tipo_foto: 'professor'
              });
              console.log('Legenda encontrada:', legenda);
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

  // Don't show thumbnails when maximized (images are shown in sidebar)
  if (isMaximized) {
    return null;
  }

  return (
    <section className="my-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imagens.map((img, index) => (
          <figure
            key={img.id}
            className="rounded-lg overflow-hidden bg-white shadow-sm flex flex-col cursor-pointer transition hover:shadow-md"
            onClick={() => {
              if (img.publicURL) {
                setCurrentImageIndex(index);
                setImagemZoom(img);
              }
            }}
          >
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <OptimizedImage
                src={img.publicURL}
                alt={img.legenda}
                className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                isPreloaded={isImagePreloaded(img.publicURL)}
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

      {/* Modal de Zoom Reutilizável */}
      <ReusableImageZoom
        images={imagens}
        currentImageIndex={currentImageIndex}
        isOpen={!!imagemZoom}
        onClose={fecharZoom}
        onImageChange={setCurrentImageIndex}
        showNavigation={true}
        showControls={true}
        showCounter={true}
        showCaption={true}
      />
    </section>
  );
};

ImagemHistoriadoProfessor.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshKey: PropTypes.number,
};

export default React.memo(ImagemHistoriadoProfessor);
