import React, { useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Download, Share2 } from 'lucide-react';
import useSidebarImages from '../../../hooks/useSidebarImages';
import { hasContent } from '../../../utils/contentValidation';
import { formatDateForDisplay } from '../../../utils/dateUtils';

/**
 * GaleriaPanel — janela de galeria com a mesma estrutura visual do PainelContainer.
 * Usa as mesmas classes CSS (.mj-panel) e posicionamento, ficando acima do painel
 * de informações (z-[10001] vs z-[9999]).
 */
const GaleriaPanel = ({ escolaId, headerUrl, titulo, isOpen, onClose, isMobilePortrait }) => {
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(0);

  const { items, loading, hasItems } = useSidebarImages({ escolaId, headerUrl });

  const openLightbox = useCallback((index) => {
    setSelected(index);
    setView('lightbox');
  }, []);

  const closeLightbox = useCallback(() => {
    setView('grid');
  }, []);

  const prevPhoto = useCallback(() => {
    setSelected((i) => (i > 0 ? i - 1 : items.length - 1));
  }, [items.length]);

  const nextPhoto = useCallback(() => {
    setSelected((i) => (i < items.length - 1 ? i + 1 : 0));
  }, [items.length]);

  const currentItem = items[selected] || null;

  const handleDownload = useCallback(async () => {
    if (!currentItem?.url) return;
    try {
      const response = await fetch(currentItem.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = blob.type.split('/')[1] || 'jpg';
      a.download = currentItem.titulo
        ? `${currentItem.titulo.replace(/[^a-z0-9]/gi, '_')}.${ext}`
        : `foto_${selected + 1}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(currentItem.url, '_blank');
    }
  }, [currentItem, selected]);

  const handleShare = useCallback(async () => {
    if (!currentItem?.url) return;
    const shareData = {
      title: currentItem.titulo || 'Foto',
      text: [currentItem.titulo, currentItem.autor ? `Por: ${currentItem.autor}` : null]
        .filter(Boolean).join(' — '),
      url: currentItem.url,
    };
    if (navigator.share && navigator.canShare?.(shareData)) {
      try { await navigator.share(shareData); } catch { /* cancelado */ }
    } else {
      await navigator.clipboard.writeText(currentItem.url);
      alert('Link da imagem copiado!');
    }
  }, [currentItem]);

  // Mesmas classes de posicionamento do PainelContainer
  const baseClasses = [
    'fixed',
    isMobilePortrait
      ? 'inset-x-0 top-0 w-full'
      : 'top-0 bottom-0 right-0 w-full sm:w-3/4 lg:w-[49%]',
    'bg-white border-t-4 border-white mj-panel',
    'z-[10001]',
  ].join(' ');

  const visibilityClass = isOpen
    ? 'translate-y-0 opacity-100'
    : 'translate-y-full opacity-0 pointer-events-none';

  return (
    <div
      className={`${baseClasses} ${visibilityClass}`}
      style={{
        height: '100vh',
        maxHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        ...(isMobilePortrait && { borderRadius: '1rem 1rem 0 0' }),
      }}
      role="dialog"
      aria-label="Galeria de fotos"
      aria-modal="true"
    >
      {/* ── Header ── */}
      <header className="relative border-b border-green-100 flex-shrink-0" style={{ zIndex: 1000 }}>
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center gap-2 pr-20">
            {view === 'lightbox' && (
              <button
                type="button"
                onClick={closeLightbox}
                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Voltar para grade"
              >
                <ArrowLeft className="w-4 h-4 stroke-2" />
              </button>
            )}
            <div>
              <h2 className="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl md:text-4xl">
                Galeria de fotos
              </h2>
              {titulo && (
                <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">
                  {titulo}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Botão fechar */}
        <div
          className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2"
          style={{ zIndex: 1005 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-green-100 rounded-lg transition-colors"
            aria-label="Fechar galeria"
          >
            <X size={20} className="stroke-2" />
          </button>
        </div>
      </header>

      {/* ── Conteúdo ── */}
      <div className="flex-1 overflow-y-auto mj-panel-content" style={{ minHeight: 0 }}>
        {view === 'grid' ? (
          /* ── Grade de miniaturas ── */
          <div className="p-3 sm:p-4">
            {/* Skeleton enquanto carrega */}
            {loading && items.length === 0 && (
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            )}

            {hasItems && (
              <>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {items.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openLightbox(i)}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <img
                        src={item.url}
                        alt={item.titulo || 'Foto'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      {hasContent(item.titulo) && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="text-white text-xs font-medium leading-snug line-clamp-2">
                            {item.titulo}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <p className="text-center text-xs text-gray-400 mt-4 pb-2">
                  {items.length} {items.length === 1 ? 'foto' : 'fotos'}
                </p>
              </>
            )}
          </div>
        ) : (
          /* ── Lightbox: foto individual ── */
          <div className="flex flex-col" style={{ height: '100%' }}>
            {/* Imagem */}
            <div
              className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden"
              style={{ minHeight: 0 }}
            >
              {currentItem && (
                <img
                  src={currentItem.url}
                  alt={currentItem.titulo || 'Foto'}
                  className="max-w-full max-h-full object-contain"
                  style={{ filter: 'saturate(1.2)' }}
                />
              )}

              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-colors"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-colors"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute top-3 right-3 text-xs text-white bg-black/60 rounded px-2 py-1 font-medium">
                {selected + 1} / {items.length}
              </div>
            </div>

            {/* Legenda + ações */}
            {currentItem && (
              <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white">
                <div className="flex items-start justify-between gap-3">
                  {/* Texto */}
                  <div className="flex-1 min-w-0">
                    {hasContent(currentItem.titulo) && (
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                        {currentItem.titulo}
                      </h3>
                    )}
                    {hasContent(currentItem.descricao) && (
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        {currentItem.descricao}
                      </p>
                    )}
                    {(hasContent(currentItem.autor) || currentItem.dataFoto) && (
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        {hasContent(currentItem.autor) && (
                          <span>Por: {currentItem.autor}</span>
                        )}
                        {currentItem.dataFoto && (
                          <span>{formatDateForDisplay(currentItem.dataFoto)}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botões de ação */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="Compartilhar foto"
                      title="Compartilhar"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleDownload}
                      className="p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      aria-label="Baixar foto"
                      title="Baixar"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(GaleriaPanel);
