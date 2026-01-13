import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../dbClient';
import { getLocalImageUrl, isLocalImage } from '../../../utils/imageUtils';
import { getLegendaByImageUrlFlexivel } from '../../../services/legendasService';
import ReusableImageZoom from '../../ReusableImageZoom';
import OptimizedImage from '../../shared/OptimizedImage';
import useImagePreloader from '../../../hooks/useImagePreloader';
import { formatDateForDisplay } from '../../../utils/dateUtils';
import '../../ReusableImageZoom.css';

// Helper function to check if a value has actual content
const hasContent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

const ImagemHistoriadoProfessor = ({ escola_id, refreshKey = 0, isMaximized = false, hideInlineMedia = false }) => {
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

    // URL base do storage remoto (produção)
    const REMOTE_STORAGE_URL = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-professores/';

    // Busca arquivos da tabela imagens_professores
    supabase
      .from('imagens_professores')
      .select('*')
      .eq('escola_id', escola_id)
      .eq('ativo', true)
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data && data.length > 0) {
          console.log('Arquivos de professores encontrados:', data.length);
          const imagensComUrl = await Promise.all(data.map(async (img, idx) => {
            let publicUrl = img.imagem_url;

            if (publicUrl && !publicUrl.startsWith('http')) {
              publicUrl = `${REMOTE_STORAGE_URL}${img.imagem_url}`;
            }

            // Extrair gênero do nome do arquivo (se disponível no nome do arquivo ou usar padrão)
            const fileName = img.nome_arquivo || img.imagem_url || '';
            let genero = 'professor';
            if (fileName.includes('professora')) {
              genero = 'professora';
            }

            // Buscar legenda da nova tabela (se necessário, mas imagens_professores já tem autor)
            // Mantendo lógica para compatibilidade se houver dados em legendas_fotos para professores
            let legenda = null;
            try {
              const caminhoRelativo = img.imagem_url;
              // Se não tiver imagem_url, não tem como buscar legenda por caminho
              if (caminhoRelativo) {
                // Tentar buscar legenda se existir
                // Nota: A tabela imagens_professores já tem 'autor', mas 'legenda' pode vir de legendas_fotos
                // ou ser construída.
              }
            } catch (error) {
              console.warn('Erro ao buscar legenda:', error);
            }

            // Construir legenda/descrição
            // Se imagens_professores não tem campo 'legenda' explícito, usamos o que temos
            // O código original buscava legenda em 'legendas_fotos' usando o caminho.
            // Podemos manter isso se 'imagens_professores' não for suficiente.

            // Para simplificar e seguir o padrão, vamos usar os dados que já temos na tabela imagens_professores
            // ou buscar em legendas_fotos se precisarmos de mais detalhes.
            // O código original fazia getLegendaByImageUrlFlexivel.

            // Vamos tentar manter a busca de legenda para garantir que descrições detalhadas apareçam
            if (img.imagem_url) {
              try {
                const caminhoRelativo = `${escola_id}/${img.imagem_url.split('/').pop()}`;
                legenda = await getLegendaByImageUrlFlexivel(caminhoRelativo, escola_id, {
                  categoria: 'professor',
                  tipo_foto: 'professor'
                });
              } catch (e) { }
            }

            const legendaFinal = hasContent(legenda?.legenda) ? legenda.legenda.trim() : (img.autor ? `Foto de ${img.autor}` : null);

            return {
              id: img.id || idx + 1,
              publicURL: publicUrl,
              genero,
              nome: img.nome_arquivo || `Imagem ${idx + 1}`,
              created_at: img.created_at || '',
              legenda: legendaFinal,
              descricao: legendaFinal,
              descricaoDetalhada: legenda?.descricao_detalhada,
              autor: img.autor || legenda?.autor_foto,
              dataFoto: img.data_upload || legenda?.data_foto,
              categoria: 'professor',
            };
          }));

          // Filtrar apenas imagens que existem localmente (consistência com ImagensdasEscolas)
          const imagensValidas = imagensComUrl.filter(img => {
            if (img.publicURL) return isLocalImage(img.publicURL);
            return false;
          });

          console.log('Arquivos de professores VALIDADOS:', imagensValidas.length);
          setImagens(imagensValidas);
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

  // Don't show thumbnails when media is handled by sidebar layout
  if (hideInlineMedia) {
    return null;
  }

  return (
    <section className="my-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imagens.map((img, index) => (
          <figure
            key={img.id}
            className="rounded-lg overflow-hidden bg-white shadow-sm flex flex-col cursor-pointer"
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
                className="w-full h-full object-cover object-center"
                isPreloaded={isImagePreloaded(img.publicURL)}
                style={{ maxHeight: '350px' }}
              />
            </div>

            {/* Legenda da imagem - só mostra se tiver conteúdo real */}
            {hasContent(img.legenda) && (
              <figcaption className="p-3 bg-white">
                <p className="text-sm text-black mb-1">
                  {img.legenda}
                </p>

                {/* Informações adicionais */}
                {(hasContent(img.autor) || img.dataFoto) && (
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {hasContent(img.autor) && (
                      <span>Por: {img.autor}</span>
                    )}
                    {img.dataFoto && (
                      <span>{formatDateForDisplay(img.dataFoto)}</span>
                    )}
                  </div>
                )}

                {/* Descrição detalhada */}
                {hasContent(img.descricaoDetalhada) && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
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
  hideInlineMedia: PropTypes.bool,
};

export default React.memo(ImagemHistoriadoProfessor);
