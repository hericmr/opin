import React, { memo, useEffect, useState, useCallback } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getHistoriasProfessor } from '../../../../services/historiaProfessorService';

const HistoriaDoProfessor = memo(({ escola }) => {
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
        
        const historiasData = await getHistoriasProfessor(escola.id);
        setHistorias(historiasData);
        setCurrentHistoriaIndex(0);
      } catch (err) {
        console.error('Erro ao carregar histórias do professor:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorias();
  }, [escola?.id]);

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

  // Se não há histórias, não renderizar nada
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
        bg-white rounded-2xl shadow-lg border border-green-100/50
        prose prose-sm sm:prose-base md:prose-lg lg:prose-xl
        prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-justify
        prose-img:rounded-xl prose-img:shadow-lg
        prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
      "
    >
      <header className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <BookOpen
              className="w-6 h-6 sm:w-8 sm:h-8 text-green-700"
              aria-hidden="true"
            />
            <h2 className="text-xl sm:text-2xl font-bold text-black m-0">
              História do Professor
            </h2>
          </div>
          
          {/* Indicadores de navegação */}
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
        {currentHistoria.titulo && (
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">
            {currentHistoria.titulo}
          </h3>
        )}
        
        <p className="mb-6">{currentHistoria.historia}</p>

        {/* Imagem da história */}
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
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-green-100">
          <button
            onClick={prevHistoria}
            className="flex items-center gap-2 px-4 py-2 text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
            aria-label="História anterior"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Indicadores de página */}
          <div className="flex gap-2">
            {historias.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHistoriaIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentHistoriaIndex
                    ? 'bg-green-600'
                    : 'bg-green-200 hover:bg-green-300'
                }`}
                aria-label={`Ir para história ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextHistoria}
            className="flex items-center gap-2 px-4 py-2 text-green-700 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
            aria-label="Próxima história"
          >
            <span className="hidden sm:inline">Próxima</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Modal de zoom da imagem */}
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
            src={imagemZoom.imagem_public_url}
            alt={imagemZoom.descricao_imagem || 'Imagem em destaque'}
            className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </article>
  );
});

export default HistoriaDoProfessor; 