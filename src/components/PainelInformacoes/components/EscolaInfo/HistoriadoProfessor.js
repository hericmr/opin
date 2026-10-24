import React, { memo, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { TituloDiscreto } from '../Ficha';
import { getHistoriasProfessor } from '../../../../services/historiaProfessorService';
import { useRefresh } from '../../../../contexts/RefreshContext';
import { getLocalImageUrl } from '../../../../utils/imageUtils';
import { sanitizeHtml } from '../../../../utils/sanitizeHtml';
import FotoProfessor from '../FotoProfessor';
import './HistoriadoProfessor.css';

const HistoriadoProfessor = memo(({ escola, title, id }) => {
  const { refreshKey } = useRefresh();
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

  // (sem dots laterais aqui; manter navegação simples local)

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

  const Wrapper = ({ children }) => {
    if (id) {
      return (
        <section id={id} className="py-12 scroll-mt-16 border-b border-gray-100 last:border-0 w-full">
          {title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 max-w-7xl mx-auto">{title}</h2>}
          {children}
        </section>
      );
    }
    return <>{title && <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 w-full max-w-4xl mx-auto">{title}</h2>}{children}</>;
  };

  if (loading) {
    return (
      <Wrapper>
        <div className="mt-8 mb-12 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 bg-white rounded-2xl shadow-lg border border-green-100/50">
          <div className="flex items-center justify-center py-8">
            <span className="ml-2 text-gray-600">Carregando histórias do professor...</span>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="mt-8 mb-12 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 bg-white rounded-2xl shadow-lg border border-red-100/50">
          <div className="text-center py-8">
            <p className="text-red-600">Erro ao carregar histórias do professor: {error}</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (!historias.length) {
    return null;
  }

  const currentHistoria = historias[currentHistoriaIndex];
  const hasMultipleHistorias = historias.length > 1;

  return (
    <Wrapper>
      <div className="flex flex-col items-center w-full">
        <div className="w-full">
          <TituloDiscreto extra={hasMultipleHistorias ? `${currentHistoriaIndex + 1} de ${historias.length}` : null}>
            {historias.length > 1 ? 'Histórias dos professores' : 'História do professor'}
          </TituloDiscreto>
        </div>

      {/* Card com conteúdo - sem borda, inline com o resto, largura otimizada para leitura */}
      <article
        className="
          prose prose-lg
          prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-left
          prose-img:rounded-xl prose-img:shadow-lg
          prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
          max-w-3xl mx-auto w-full
        "
        style={{ maxWidth: '65ch' }}
      >

        {/* Conteúdo da história atual */}
        <section className="text-lg leading-relaxed text-neutral-800">
          {currentHistoria.nome_professor && (
            <div className="flex flex-col items-center mb-6">
              <div className="flex-shrink-0">
                <FotoProfessor
                  fotoUrl={currentHistoria.foto_rosto}
                  nomeProfessor={currentHistoria.nome_professor}
                  customSize="200px"
                  className="shadow-lg"
                  escolaId={escola.id}
                />
              </div>
              <div className="w-full text-center">
                <h4 className="not-prose text-lg font-semibold text-gray-900 mt-4 mb-3">
                  {currentHistoria.nome_professor}
                </h4>
                <div
                  className="historia-professor-content prose prose-lg max-w-none
                  prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-left
                  prose-img:rounded-xl prose-img:shadow-lg
                  prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
                  prose-strong:text-green-800 prose-em:text-green-700
                  prose-blockquote:border-l-green-300 prose-blockquote:bg-green-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                  prose-ul:text-black prose-ol:text-black prose-li:text-black
                  prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentHistoria.historia ? currentHistoria.historia.replace(/Aborda\./g, '').trim() : '') }}
                />
              </div>
            </div>
          )}
          {!currentHistoria.nome_professor && (
            <div
              className="historia-professor-content prose prose-lg max-w-none
              prose-headings:text-green-900 prose-p:text-black prose-p:leading-relaxed prose-p:text-left
              prose-img:rounded-xl prose-img:shadow-lg
              prose-a:text-green-700 prose-a:no-underline prose-a:border-b-2 prose-a:border-green-100 hover:prose-a:border-green-600
              prose-strong:text-green-800 prose-em:text-green-700
              prose-blockquote:border-l-green-300 prose-blockquote:bg-green-50 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
              prose-ul:text-black prose-ol:text-black prose-li:text-black
              prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(currentHistoria.historia ? currentHistoria.historia.replace(/Aborda\./g, '').trim() : '') }}
            />
          )}
          {currentHistoria.imagem_public_url && (
            <figure className="my-6">
              <div className="relative">
                <img
                  src={getLocalImageUrl(currentHistoria.imagem_public_url)}
                  alt={currentHistoria.descricao_imagem || 'Imagem da história do professor'}
                  className="w-full max-w-2xl mx-auto rounded-xl shadow-lg cursor-pointer"
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
                src={getLocalImageUrl(imagemZoom.imagem_public_url)}
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

      </article>
    </div>
    </Wrapper>
  );
});

export default HistoriadoProfessor;
