import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { RefreshCw } from 'lucide-react';
import { getLegendaByImageUrlFlexivel } from '../../../services/legendasService';
import { supabase } from '../../../dbClient';
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

const ImagensdasEscolas = ({ escola_id, refreshKey = 0, isMaximized = false, hideInlineMedia = false }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemZoom, setImagemZoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState('');
  const cacheRef = useRef({});
  const [cacheVersion, setCacheVersion] = useState(0); // Para forçar recarga

  // Hook de preload de imagens
  const { isImagePreloaded } = useImagePreloader(escola_id, true);

  // Função para limpar cache e recarregar
  const limparCacheERecarregar = useCallback(() => {
    console.log('Limpando cache e recarregando imagens...');
    cacheRef.current = {};
    setCacheVersion(prev => prev + 1);
  }, []);

  // Forçar recarga quando refreshKey mudar
  useEffect(() => {
    if (refreshKey > 0) {
      console.log('ImagensdasEscolas: refreshKey mudou, forçando recarga');
      limparCacheERecarregar();
    }
  }, [refreshKey, limparCacheERecarregar]);

  // Adicionar timestamp ao cache key para invalidar quando necessário
  // Isso garante que mudanças na ordem sejam refletidas
  useEffect(() => {
    // Invalidar cache periodicamente ou quando refreshKey muda
    if (refreshKey > 0) {
      setCacheVersion(prev => prev + 1);
    }
  }, [refreshKey]);

  const fecharZoom = useCallback(() => {
    setImagemZoom(null);
    setCurrentImageIndex(0);
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

    // Sempre buscar ordem do banco para garantir que está atualizada
    // Não usar cache para ordem, apenas para otimização de performance
    const cacheKey = `${escola_id}_v${cacheVersion}_rk${refreshKey}`;

    const buscarImagens = async () => {
      console.log('Buscando imagens para escola', escola_id, 'refreshKey:', refreshKey);

      try {
        // Buscar imagens da tabela legendas_fotos (que contém os caminhos das imagens)
        const { data: legendas, error } = await supabase
          .from('legendas_fotos')
          .select('*')
          .eq('escola_id', escola_id)
          .eq('tipo_foto', 'escola')
          .eq('ativo', true)
          .order('ordem', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        if (!legendas || legendas.length === 0) {
          console.log('Nenhuma imagem encontrada em legendas_fotos para escola', escola_id);
          setImagens([]);
          setLoading(false);
          return;
        }

        console.log('Imagens encontradas em legendas_fotos:', legendas.length);

        // URL base do storage remoto (produção)
        const REMOTE_STORAGE_URL = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/';

        // Processar cada imagem encontrada
        const imagensEncontradas = legendas.map((legenda, index) => {
          let publicUrl = null;

          if (legenda.imagem_url) {
            if (legenda.imagem_url.startsWith('http')) {
              publicUrl = legenda.imagem_url;
            } else {
              // Construir URL usando o bucket remoto
              publicUrl = `${REMOTE_STORAGE_URL}${legenda.imagem_url}`;
            }
          }

          return {
            id: legenda.id || `${escola_id}-${index}`,
            publicURL: publicUrl,
            filePath: legenda.imagem_url,
            descricao: hasContent(legenda.legenda) ? legenda.legenda.trim() : null,
            descricaoDetalhada: hasContent(legenda.descricao_detalhada) ? legenda.descricao_detalhada.trim() : null,
            autor: hasContent(legenda.autor_foto) ? legenda.autor_foto.trim() : null,
            dataFoto: legenda.data_foto,
            categoria: legenda.categoria,
            ordem: legenda.ordem !== null && legenda.ordem !== undefined ? legenda.ordem : index,
            urlError: null,
          };
        });

        // A ordenação já é feita na query do banco de dados, mas mantemos aqui para consistência
        // com a lógica anterior, caso a ordem do banco não seja suficiente ou para fallback.
        // No entanto, com a ordenação na query, esta etapa pode ser menos crítica.
        imagensEncontradas.sort((a, b) => {
          // Primeiro ordenar por ordem (menor primeiro)
          if (a.ordem !== b.ordem) {
            return a.ordem - b.ordem;
          }
          // Se ordem for igual ou não existir, manter ordem original (por nome do arquivo)
          return 0;
        });

        console.log('Imagens processadas e ordenadas:', imagensEncontradas.length);
        console.log('Ordem das imagens:', imagensEncontradas.map(img => ({ file: img.filePath.split('/').pop(), ordem: img.ordem })));

        // Salvar no cache com versão
        cacheRef.current[cacheKey] = imagensEncontradas;
        setImagens(imagensEncontradas);

        if (imagensEncontradas.length === 0) {
          setError('Nenhuma imagem encontrada para esta escola.');
        }
      } catch (error) {
        console.error('Erro ao processar imagens:', error);
        setError(`Erro ao carregar imagens da escola: ${error.message || JSON.stringify(error)}`);
      } finally {
        setLoading(false);
      }
    };

    buscarImagens();
  }, [escola_id, cacheVersion, refreshKey]);

  if (loading) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        Carregando imagens da escola...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 flex items-center gap-2">
        <span>{error}</span>
        <button
          onClick={limparCacheERecarregar}
          className="text-blue-600 hover:text-blue-800"
          title="Tentar novamente"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (!imagens.length) {
    return (
      <div className="text-yellow-700 flex items-center gap-2">
        <span>Nenhuma imagem encontrada para esta escola.</span>
        <button
          onClick={limparCacheERecarregar}
          className="text-blue-600 hover:text-blue-800"
          title="Tentar novamente"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Don't show thumbnails when media is handled by sidebar layout
  if (hideInlineMedia) {
    return null;
  }

  return (
    <section className="my-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {imagens.map((img) => (
          <figure
            key={img.id}
            className="rounded-lg overflow-hidden bg-white shadow-sm flex flex-col cursor-pointer"
            onClick={() => {
              if (img.publicURL) {
                const index = imagens.findIndex(i => i.publicURL === img.publicURL);
                setCurrentImageIndex(index);
                setImagemZoom(img);
              }
            }}
          >
            <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
              <OptimizedImage
                src={img.publicURL}
                alt={img.descricao}
                className="w-full h-full object-cover object-center"
                isPreloaded={isImagePreloaded(img.publicURL)}
                style={{ maxHeight: '350px' }}
              />
            </div>

            {/* Legenda da imagem - só mostra se tiver conteúdo real */}
            {hasContent(img.descricao) && (
              <figcaption className="p-3 bg-white">
                <p className="text-sm text-black mb-1">
                  {img.descricao}
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

ImagensdasEscolas.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshKey: PropTypes.number,
  hideInlineMedia: PropTypes.bool,
};

export default React.memo(ImagensdasEscolas);
