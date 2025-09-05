import React, { memo, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getHistoriasProfessor } from '../../../../services/historiaProfessorService';
import ImagemHistoriadoProfessor from '../ImagemHistoriadoProfessor';
import FotoProfessor from '../FotoProfessor';
import './HistoriadoProfessor.css';

const HistoriadoProfessor = memo(({ escola, refreshKey = 0 }) => {
  const [historias, setHistorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentHistoriaIndex, setCurrentHistoriaIndex] = useState(0);
  const [imagemZoom, setImagemZoom] = useState(null);

  const fecharZoom = useCallback(() => setImagemZoom(null), []);

  // Fecha modal com tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        fecharZoom();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [fecharZoom]);

  // Carregar histórias do professor
  useEffect(() => {
    if (!escola?.id) {
      setLoading(false);
      return;
    }
    const carregarHistorias = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHistoriasProfessor(escola.id);
        setHistorias(data || []);
        setCurrentHistoriaIndex(0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    carregarHistorias();
  }, [escola?.id, refreshKey]);

  // Navegação entre histórias
  const nextHistoria = useCallback(() => {
    setCurrentHistoriaIndex(prev =>
      prev < historias.length - 1 ? prev + 1 : 0
    );
  }, [historias.length]);

  const prevHistoria = useCallback(() => {
    setCurrentHistoriaIndex(prev =>
      prev > 0 ? prev - 1 : historias.length - 1
    );
  }, [historias.length]);

  // Navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (historias.length <= 1) return;
      if (e.key === 'ArrowRight') {
        nextHistoria();
      } else if (e.key === 'ArrowLeft') {
        prevHistoria();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historias.length, nextHistoria, prevHistoria]);

  if (loading) {
    return (
      <div className="mt-8 mb-12 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 bg-white rounded-2xl shadow-lg border border-green-100/50">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">Carregando histórias do professor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 mb-12 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 bg-white rounded-2xl shadow-lg border border-red-100/50">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar histórias do professor: {error}</p>
        </div>
      </div>
    );
  }

  if (!historias.length) {
    return null;
  }

  const currentHistoria = historias[currentHistoriaIndex];
  const hasMultipleHistorias = historias.length > 1;

  return (
    <article
      className="
        mt-8 mb-12 max-w-4xl mx-auto
        px-4 sm:px-6 md:px-8 py-6
        bg-white rounded-2xl shadow-lg
        prose prose-sm sm:prose-base md:prose-lg lg:prose-xl
        prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
        prose-img:rounded-xl prose-img:shadow-lg
        prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
      "
    >
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <span className="bg-green-300 rounded-full flex items-center justify-center w-16 h-16 sm:w-28 sm:h-28">
              <img 
                src={`${process.env.PUBLIC_URL}/passaro.svg`} 
                alt="Ícone de pássaro" 
                className="w-12 h-12 sm:w-24 sm:h-24" 
                style={{ 
                  filter: 'none', 
                  borderRadius: '0', 
                  boxShadow: 'none', 
                  margin: '0',
                  padding: '0',
                  border: 'none',
                  outline: 'none'
                }}
                aria-hidden="true"
              />
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-black m-0">
              Depoimento dos Professores
            </h2>
          </div>
          {hasMultipleHistorias && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{currentHistoriaIndex + 1} de {historias.length}</span>
            </div>
          )}
        </div>
        <div className="h-1 w-20 sm:w-24 bg-green-300 rounded-full" />
      </header>

      {/* Conteúdo da história atual */}
      <section className="text-base sm:text-lg leading-relaxed text-neutral-800">
        {currentHistoria.nome_professor && (
          <div className="flex items-center gap-4 mb-6">
            <FotoProfessor 
              fotoUrl={currentHistoria.foto_rosto}
              nomeProfessor={currentHistoria.nome_professor}
              tamanho="medium"
              className="flex-shrink-0"
            />
            <h3 className="text-lg sm:text-xl font-semibold text-green-800 m-0">
              {currentHistoria.nome_professor}
            </h3>
          </div>
        )}
        <div 
          className="historia-professor-content prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none
            prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
            prose-img:rounded-xl prose-img:shadow-lg
            prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
            prose-strong:text-green-800 prose-em:text-green-700
            prose-blockquote:border-l-green-300 prose-blockquote:bg-green-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
            prose-ul:text-black prose-ol:text-black prose-li:text-black
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: currentHistoria.historia }}
        />
        {currentHistoria.imagem_public_url && (
          <figure className="my-6">
            <div className="relative">
              <img
                src={currentHistoria.imagem_public_url}
                alt={currentHistoria.descricao_imagem || 'Imagem da história do professor'}
                className="w-full max-w-2xl mx-auto rounded-xl shadow-lg cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => setImagemZoom(currentHistoria)}
                loading="lazy"
              />
              {currentHistoria.descricao_imagem && (
                <figcaption className="text-center text-sm text-gray-600 mt-2">
                  {currentHistoria.descricao_imagem}
                </figcaption>
              )}
            </div>
          </figure>
        )}
      </section>

      {/* Navegação entre histórias */}
      {hasMultipleHistorias && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={prevHistoria}
            className="flex items-center gap-2 px-4 py-2 text-green-700 hover:text-green-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="História anterior"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <div className="flex gap-2">
            {historias.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHistoriaIndex(index)}
                className={`w-3 h-3 rounded-full border-2 ${index === currentHistoriaIndex ? 'bg-green-600 border-green-600' : 'bg-white border-gray-300'} transition-colors`}
                aria-label={`Ir para história ${index + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextHistoria}
            className="flex items-center gap-2 px-4 py-2 text-green-700 hover:text-green-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Próxima história"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modal de zoom da imagem */}
      {imagemZoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" onClick={fecharZoom}>
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 z-10"
              onClick={fecharZoom}
              aria-label="Fechar zoom"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={imagemZoom.imagem_public_url}
              alt={imagemZoom.descricao_imagem || 'Imagem da história do professor'}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl border-4 border-white"
            />
            {imagemZoom.descricao_imagem && (
              <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-sm text-white bg-black bg-opacity-50 rounded-lg px-3 py-1.5 max-w-2xl">
                {imagemZoom.descricao_imagem}
              </figcaption>
            )}
          </div>
        </div>
      )}

      <ImagemHistoriadoProfessor escola_id={escola.id} refreshKey={refreshKey} />
    </article>
  );
});

export default HistoriadoProfessor;
