import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../supabaseClient';

const ImagemHistoriadoProfessor = ({ escola_id }) => {
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 [ImagemHistoriadoProfessor] useEffect iniciado');
    console.log('📊 [ImagemHistoriadoProfessor] escola_id:', escola_id);
    console.log('📊 [ImagemHistoriadoProfessor] tipo de escola_id:', typeof escola_id);
    
    if (!escola_id) {
      console.log('❌ [ImagemHistoriadoProfessor] escola_id não fornecido, saindo do useEffect');
      return;
    }

    console.log('🚀 [ImagemHistoriadoProfessor] Iniciando busca de imagens');
    setLoading(true);
    setError(null);

    const queryPattern = `${escola_id}/%`;
    console.log('🔍 [ImagemHistoriadoProfessor] Padrão de busca:', queryPattern);

    supabase
      .from('imagens_escola')
      .select('*')
      .like('url', queryPattern)
      .order('created_at', { ascending: true })
      .then(async ({ data, error }) => {
        console.log('📥 [ImagemHistoriadoProfessor] Resposta do Supabase recebida');
        console.log('📊 [ImagemHistoriadoProfessor] data:', data);
        console.log('📊 [ImagemHistoriadoProfessor] error:', error);

        if (error) {
          console.error('❌ [ImagemHistoriadoProfessor] Erro na consulta:', error);
          console.error('❌ [ImagemHistoriadoProfessor] Erro detalhado:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          setError(error.message);
          setLoading(false);
          return;
        }

        console.log('✅ [ImagemHistoriadoProfessor] Consulta bem-sucedida');
        console.log('📊 [ImagemHistoriadoProfessor] Número de registros encontrados:', data?.length || 0);

        // Teste de conectividade com o Storage
        console.log('🧪 [ImagemHistoriadoProfessor] Testando conectividade com Storage...');
        try {
          const testResponse = supabase.storage.from('imagens-professores').getPublicUrl('test');
          console.log('🧪 [ImagemHistoriadoProfessor] Resposta do teste de Storage:', testResponse);
        } catch (testError) {
          console.error('🧪 [ImagemHistoriadoProfessor] Erro no teste de Storage:', testError);
        }

        if (data && data.length > 0) {
          console.log('📋 [ImagemHistoriadoProfessor] Primeiros registros:', data.slice(0, 3));
          
          const imagensComUrl = data.map((img, index) => {
            console.log(`🖼️ [ImagemHistoriadoProfessor] Processando imagem ${index + 1}:`, img);
            console.log(`🔗 [ImagemHistoriadoProfessor] URL original da imagem ${index + 1}:`, img.url);

            try {
              console.log(`🔧 [ImagemHistoriadoProfessor] Chamando getPublicUrl para:`, img.url);
              
              const response = supabase
                .storage
                .from('imagens-professores')
                .getPublicUrl(img.url);

              console.log(`🔍 [ImagemHistoriadoProfessor] Resposta completa do getPublicUrl:`, response);
              
              // Tentar diferentes formas de acessar a URL
              const publicURL = response.publicURL || response.publicUrl || response.data?.publicUrl || response.data?.publicURL;
              
              console.log(`🌐 [ImagemHistoriadoProfessor] URL pública extraída para imagem ${index + 1}:`, publicURL);
              
              // Se ainda não temos URL, vamos tentar construir manualmente
              let finalURL = publicURL;
              if (!finalURL) {
                const baseURL = supabase.storage.from('imagens-professores').getPublicUrl('').publicURL || supabase.storage.from('imagens-professores').getPublicUrl('').data?.publicUrl;
                if (baseURL) {
                  finalURL = baseURL.replace(/\/$/, '') + '/' + img.url;
                  console.log(`🔨 [ImagemHistoriadoProfessor] URL construída manualmente:`, finalURL);
                }
              }
              
              const imagemComUrl = { ...img, publicURL: finalURL };
              console.log(`✅ [ImagemHistoriadoProfessor] Imagem ${index + 1} processada:`, imagemComUrl);
              
              return imagemComUrl;
            } catch (err) {
              console.error(`❌ [ImagemHistoriadoProfessor] Erro ao gerar URL pública para imagem ${index + 1}:`, err);
              return { ...img, publicURL: null, urlError: err.message };
            }
          });

          console.log('🎯 [ImagemHistoriadoProfessor] Todas as imagens processadas:', imagensComUrl);
          setImagens(imagensComUrl);
        } else {
          console.log('📭 [ImagemHistoriadoProfessor] Nenhuma imagem encontrada');
          setImagens([]);
        }

        setLoading(false);
        console.log('🏁 [ImagemHistoriadoProfessor] Processo finalizado');
      })
      .catch(err => {
        console.error('💥 [ImagemHistoriadoProfessor] Erro inesperado na consulta:', err);
        setError(`Erro inesperado: ${err.message}`);
        setLoading(false);
      });
  }, [escola_id]);

  console.log('🎨 [ImagemHistoriadoProfessor] Renderizando componente');
  console.log('📊 [ImagemHistoriadoProfessor] Estado atual:', {
    loading,
    error,
    imagensCount: imagens.length,
    imagens: imagens.slice(0, 2) // Mostra apenas as 2 primeiras para não poluir
  });

  if (loading) {
    console.log('⏳ [ImagemHistoriadoProfessor] Renderizando estado de loading');
    return <div className="text-gray-500">Carregando imagens do professor...</div>;
  }

  if (error) {
    console.log('❌ [ImagemHistoriadoProfessor] Renderizando estado de erro');
    return <div className="text-red-600">Erro ao carregar imagens: {error}</div>;
  }

  if (!imagens.length) {
    console.log('📭 [ImagemHistoriadoProfessor] Nenhuma imagem para renderizar');
    return null;
  }

  console.log('✅ [ImagemHistoriadoProfessor] Renderizando galeria de imagens');
  
  return (
    <section className="my-6">
      <h3 className="text-lg font-semibold text-green-800 mb-3">História do Professor - Imagens</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {imagens.map((img, index) => {
          console.log(`🖼️ [ImagemHistoriadoProfessor] Renderizando imagem ${index + 1}:`, {
            id: img.id,
            publicURL: img.publicURL,
            descricao: img.descricao,
            urlError: img.urlError
          });

          return (
            <figure key={img.id} className="rounded-lg overflow-hidden border bg-white shadow-sm flex flex-col">
              <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <img
                  src={img.publicURL}
                  alt={img.descricao || 'Imagem do professor'}
                  className="w-full h-full object-cover object-center transition-transform duration-200 hover:scale-105"
                  loading="lazy"
                  style={{ maxHeight: '350px' }}
                />
              </div>
              {img.urlError && (
                <div className="p-2 text-xs text-red-600 bg-red-50 border-t">
                  Erro na URL: {img.urlError}
                </div>
              )}
              {img.descricao && (
                <figcaption className="p-2 text-sm text-gray-700 bg-gray-50 border-t">
                  {img.descricao}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
};

ImagemHistoriadoProfessor.propTypes = {
  escola_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ImagemHistoriadoProfessor;