import React, { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Download, Share2, Maximize2, Minimize2 } from 'lucide-react';
import useSidebarImages from '../../../hooks/useSidebarImages';
import { hasContent } from '../../../utils/contentValidation';
import { formatDateForDisplay } from '../../../utils/dateUtils';

const GaleriaPanel = ({ escolaId, headerUrl, titulo, isOpen, onClose, isMobilePortrait }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = fechado
  const [isMaximized, setIsMaximized] = useState(() => {
    try { return localStorage.getItem('opin:galeriaIsMaximized') === 'true'; } catch { return false; }
  });

  const { items, loading, hasItems } = useSidebarImages({ escolaId, headerUrl });

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  }, [items.length]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((i) => (i < items.length - 1 ? i + 1 : 0));
  }, [items.length]);

  // Navegação por teclado no lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') prevPhoto();
      else if (e.key === 'ArrowRight') nextPhoto();
      else if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, prevPhoto, nextPhoto, closeLightbox]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => {
      const next = !prev;
      try { localStorage.setItem('opin:galeriaIsMaximized', String(next)); } catch {}
      return next;
    });
  }, []);

  const currentItem = lightboxIndex !== null ? items[lightboxIndex] : null;

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
        : `foto_${lightboxIndex + 1}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(currentItem.url, '_blank');
    }
  }, [currentItem, lightboxIndex]);

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

  const baseClasses = [
    'fixed',
    isMaximized
      ? 'inset-0 w-full'
      : isMobilePortrait
        ? 'inset-x-0 top-0 w-full'
        : 'top-0 bottom-0 right-0 w-full sm:w-3/4 lg:w-[49%]',
    'bg-white border-t-4 border-white mj-panel',
    'z-[10001]',
  ].join(' ');

  const visibilityClass = isOpen
    ? 'translate-y-0 opacity-100'
    : 'translate-y-full opacity-0 pointer-events-none';

  /* ── Grade de thumbnails (usada nos dois layouts) ── */
  const ThumbnailGrid = ({ cols = 2, selectedIndex = null, onSelect }) => (
    <div className={`grid grid-cols-${cols} gap-2 sm:gap-3`}>
      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(i)}
          className={`relative aspect-square rounded-lg overflow-hidden bg-gray-200 group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all ${
            selectedIndex === i ? 'ring-2 ring-green-500 ring-offset-2' : ''
          }`}
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
              <p className="text-white text-xs font-medium leading-snug line-clamp-2">{item.titulo}</p>
            </div>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* ── Painel principal ── */}
      <div
        className={`${baseClasses} ${visibilityClass}`}
        style={{
          height: '100vh',
          maxHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          ...(!isMaximized && isMobilePortrait && { borderRadius: '1rem 1rem 0 0' }),
        }}
        role="dialog"
        aria-label="Galeria de fotos"
        aria-modal="true"
      >
        {/* ── Header (fundo claro) ── */}
        <header className="relative border-b border-green-100 flex-shrink-0 bg-white" style={{ zIndex: 1000 }}>
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
            <div className="flex items-center gap-2 pr-24">
              <div>
                <h2 className="font-bold text-gray-900 leading-tight text-2xl sm:text-3xl md:text-4xl">
                  Galeria de fotos
                </h2>
                {titulo && (
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mt-0.5">{titulo}</p>
                )}
              </div>
            </div>
          </div>

          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-2" style={{ zIndex: 1005 }}>
            {!isMobilePortrait && (
              <button
                type="button"
                onClick={toggleMaximize}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-green-100 rounded-lg transition-colors"
                aria-label={isMaximized ? 'Minimizar galeria' : 'Maximizar galeria'}
              >
                {isMaximized
                  ? <Minimize2 size={20} className="stroke-2" />
                  : <Maximize2 size={20} className="stroke-2" />
                }
              </button>
            )}
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
        {isMaximized ? (
          /* ── Layout split (maximizado) ── */
          <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            {/* Thumbnails */}
            <div className="w-[500px] flex-shrink-0 overflow-y-auto border-r border-gray-100 bg-gray-50 p-3">
              {loading && items.length === 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              )}
              {hasItems && (
                <>
                  <ThumbnailGrid cols={2} selectedIndex={lightboxIndex} onSelect={openLightbox} />
                  <p className="text-center text-xs text-gray-400 mt-4 pb-2">
                    {items.length} {items.length === 1 ? 'foto' : 'fotos'}
                  </p>
                </>
              )}
            </div>

            {/* Foto + metadados (dark) */}
            <div className="flex-1 flex flex-col overflow-hidden bg-black" style={{ minHeight: 0 }}>
              {lightboxIndex !== null && currentItem ? (
                <>
                  <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ minHeight: 0 }}>
                    <img
                      src={currentItem.url}
                      alt={currentItem.titulo || 'Foto'}
                      className="max-w-full max-h-full object-contain"
                      style={{ filter: 'saturate(1.1)' }}
                    />
                    {items.length > 1 && (
                      <>
                        <button type="button" onClick={prevPhoto}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 shadow-md transition-colors"
                          aria-label="Foto anterior">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button type="button" onClick={nextPhoto}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 shadow-md transition-colors"
                          aria-label="Próxima foto">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <div className="absolute top-3 right-3 text-xs text-white bg-black/60 rounded px-2 py-1 font-medium">
                      {lightboxIndex + 1} / {items.length}
                    </div>
                  </div>
                  <div className="flex-shrink-0 p-5 border-t border-zinc-700 bg-zinc-900">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {hasContent(currentItem.titulo) && (
                          <h3 className="font-bold text-white text-base leading-snug mb-1">{currentItem.titulo}</h3>
                        )}
                        {hasContent(currentItem.descricao) && (
                          <p className="text-sm text-zinc-300 leading-relaxed mt-1.5">{currentItem.descricao}</p>
                        )}
                        {(hasContent(currentItem.autor) || currentItem.dataFoto) && (
                          <div className="flex items-center gap-4 mt-2.5 text-xs font-medium text-zinc-400">
                            {hasContent(currentItem.autor) && (
                              <span>Por: <span className="text-zinc-200">{currentItem.autor}</span></span>
                            )}
                            {currentItem.dataFoto && <span>{formatDateForDisplay(currentItem.dataFoto)}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button type="button" onClick={handleShare}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-600 hover:border-zinc-500"
                          aria-label="Compartilhar foto">
                          <Share2 className="w-4 h-4" /> Compartilhar
                        </button>
                        <button type="button" onClick={handleDownload}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-600 hover:border-zinc-500"
                          aria-label="Baixar foto">
                          <Download className="w-4 h-4" /> Baixar
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
                  Selecione uma foto
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ── Layout normal: grade de thumbnails (fundo claro) ── */
          <div className="flex-1 overflow-y-auto mj-panel-content bg-white" style={{ minHeight: 0 }}>
            <div className="p-3 sm:p-4">
              {loading && items.length === 0 && (
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                  ))}
                </div>
              )}
              {hasItems && (
                <>
                  <ThumbnailGrid cols={2} onSelect={openLightbox} />
                  <p className="text-center text-xs text-gray-400 mt-4 pb-2">
                    {items.length} {items.length === 1 ? 'foto' : 'fotos'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Lightbox fullscreen (estilo NASA) ── */}
      {lightboxIndex !== null && currentItem && (
        <div
          className="fixed inset-0 z-[10002] flex flex-col bg-black"
          role="dialog"
          aria-label={currentItem.titulo || 'Foto'}
          aria-modal="true"
        >
          {/* Barra superior */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-3 bg-black/80 backdrop-blur-sm">
            <button
              type="button"
              onClick={closeLightbox}
              className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
              aria-label="Voltar para galeria"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <span className="text-zinc-400 text-sm font-medium">
              {lightboxIndex + 1} / {items.length}
            </span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-500"
                aria-label="Compartilhar">
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>
              <button type="button" onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-zinc-700 hover:border-zinc-500"
                aria-label="Baixar">
                <Download className="w-4 h-4" /> Baixar
              </button>
            </div>
          </div>

          {/* Foto centralizada */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden px-12" style={{ minHeight: 0 }}>
            <img
              src={currentItem.url}
              alt={currentItem.titulo || 'Foto'}
              className="max-w-full max-h-full object-contain"
              style={{ filter: 'saturate(1.1)' }}
            />
            {items.length > 1 && (
              <>
                <button type="button" onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors"
                  aria-label="Foto anterior">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button type="button" onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors"
                  aria-label="Próxima foto">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Metadados embaixo */}
          <div className="flex-shrink-0 bg-zinc-950 border-t border-zinc-800 px-6 sm:px-12 py-5">
            <div className="max-w-4xl">
              {hasContent(currentItem.titulo) && (
                <h2 className="text-white font-bold text-lg sm:text-xl leading-snug mb-1">
                  {currentItem.titulo}
                </h2>
              )}
              {hasContent(currentItem.descricao) && (
                <p className="text-zinc-400 text-sm leading-relaxed mt-1.5 max-w-2xl">
                  {currentItem.descricao}
                </p>
              )}
              {(hasContent(currentItem.autor) || currentItem.dataFoto) && (
                <div className="flex items-center gap-6 mt-3 text-xs text-zinc-500 font-medium">
                  {hasContent(currentItem.autor) && (
                    <span>Por: <span className="text-zinc-300">{currentItem.autor}</span></span>
                  )}
                  {currentItem.dataFoto && <span>{formatDateForDisplay(currentItem.dataFoto)}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(GaleriaPanel);
