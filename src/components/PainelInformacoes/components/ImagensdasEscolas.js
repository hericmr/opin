import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, RefreshCw } from 'lucide-react';
import { getLegendaByImageUrl } from '../../../services/legendasService';
import { supabase } from '../../../supabaseClient';

const ImagensdasEscolas = ({ escola_id, refreshKey = 0 }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemZoom, setImagemZoom] = useState(null);
  const [error, setError] = useState('');
  const cacheRef = useRef({});
  const [cacheVersion, setCacheVersion] = useState(0); // Para forçar recarga

  // Forçar recarga quando refreshKey mudar
  useEffect(() => {
    if (refreshKey > 0) {
      console.log('ImagensdasEscolas: refreshKey mudou, forçando recarga');
      limparCacheERecarregar();
    }
  }, [refreshKey]);

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

  // Função para limpar cache e recarregar
  const limparCacheERecarregar = useCallback(() => {
    console.log('Limpando cache e recarregando imagens...');
    cacheRef.current = {};
    setCacheVersion(prev => prev + 1);
    setImagens([]);
    setLoading(true);
    setError('');
  }, []);

  useEffect(() => {
    if (!escola_id) {
      setLoading(false);
      return;
    }

    // Verificar se há cache válido (com versão)
    const cacheKey = `${escola_id}_v${cacheVersion}`;
    if (cacheRef.current[cacheKey]) {
      console.log('Usando cache para escola', escola_id);
      setImagens(cacheRef.current[cacheKey]);
      setLoading(false);
      return;
    }

    const buscarImagens = async () => {
      console.log('Buscando imagens para escola', escola_id);
      
      try {
        // Usar a mesma abordagem do painel de edição: listar arquivos do bucket
        const { data: files, error } = await supabase.storage
          .from('imagens-das-escolas')
          .list(`${escola_id}/`);

        if (error) {
          throw error;
        }

        if (!files || files.length === 0) {
          console.log('Nenhum arquivo encontrado para escola', escola_id);
          setImagens([]);
          setLoading(false);
          return;
        }

        console.log('Arquivos encontrados:', files.length);

        // Processar cada arquivo encontrado
        const imagensEncontradas = await Promise.all(
          files.map(async (file, index) => {
            const filePath = `${escola_id}/${file.name}`;
            const { data: { publicUrl } } = supabase.storage
              .from('imagens-das-escolas')
              .getPublicUrl(filePath);

            // Buscar legenda da nova tabela
            let legenda = null;
            try {
              console.log('Buscando legenda para:', filePath);
              legenda = await getLegendaByImageUrl(filePath, escola_id, 'escola');
              console.log('Legenda encontrada:', legenda);
            } catch (error) {
              console.warn('Erro ao buscar legenda para', filePath, ':', error);
            }

            return {
              id: `${escola_id}-${file.name}`,
              publicURL: publicUrl,
              descricao: legenda?.legenda || `Imagem ${index + 1}`,
              descricaoDetalhada: legenda?.descricao_detalhada,
              autor: legenda?.autor_foto,
              dataFoto: legenda?.data_foto,
              categoria: legenda?.categoria,
              urlError: null,
            };
          })
        );

        console.log('Imagens processadas:', imagensEncontradas.length);
        
        // Salvar no cache com versão
        cacheRef.current[cacheKey] = imagensEncontradas;
        setImagens(imagensEncontradas);
        
        if (imagensEncontradas.length === 0) {
          setError('Nenhuma imagem encontrada para esta escola.');
        }
      } catch (error) {
        console.error('Erro ao processar imagens:', error);
        setError('Erro ao carregar imagens da escola.');
      } finally {
        setLoading(false);
      }
    };

    buscarImagens();
  }, [escola_id, cacheVersion]);

  if (loading) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
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
            
            {/* Legenda da imagem */}
            {img.descricao && (
              <figcaption className="p-3 bg-white">
                <h4 className="font-medium text-gray-900 text-sm mb-1">
                  {img.descricao}
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
            alt={imagemZoom.descricao}
            className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
            
            {/* Legenda no modal */}
            {imagemZoom.descricao && (
              <div className="mt-4 bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {imagemZoom.descricao}
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

ImagensdasEscolas.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshKey: PropTypes.number,
};

export default React.memo(ImagensdasEscolas);
