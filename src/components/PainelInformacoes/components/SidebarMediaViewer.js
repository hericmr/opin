import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '../../shared/OptimizedImage';
import { formatDateForDisplay } from '../../../utils/dateUtils';
import { hasContent } from '../../../utils/contentValidation';
import useSidebarImages from '../../../hooks/useSidebarImages';

const SidebarMediaViewer = ({ escolaId, showTeacher = true, showSchool = true, scrollProgress, headerUrl, onCurrentItemChange, customMediaItems, dynamicBgColor }) => {
  const {
    loading,
    error,
    hasItems,
    currentItem,
    isTallImage,
    handleImageLoad,
    isImagePreloaded,
    prev,
    next,
    items,
    current,
  } = useSidebarImages({ escolaId, showTeacher, showSchool, scrollProgress, headerUrl, onCurrentItemChange, customMediaItems });

  if (error && !hasItems) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!loading && !hasItems) {
    return null;
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0">
        {hasItems && items.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              onClick={prev}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              onClick={next}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div
          className={`w-full h-full ${dynamicBgColor ? '' : 'bg-black/5'} overflow-y-auto overflow-x-hidden flex items-start justify-center`}
          style={dynamicBgColor ? { backgroundColor: dynamicBgColor, transition: 'background-color 0.5s ease' } : {}}
        >
          {currentItem && (
            <div className={`w-full h-full flex ${isTallImage ? 'flex-row gap-0' : 'flex-col'} items-center justify-center`}>
              <div className={`${isTallImage ? 'flex-1 h-full flex items-center justify-end overflow-hidden' : 'w-full h-full'}`}>
                {currentItem.origem === 'capa' ? (
                  <img
                    src={currentItem.url}
                    alt={currentItem.titulo || 'Imagem'}
                    className="w-full h-full object-contain"
                    style={{
                      display: 'block',
                      objectPosition: isTallImage ? 'center right' : 'center center',
                      filter: 'saturate(1.3)'
                    }}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    onLoad={handleImageLoad}
                  />
                ) : (
                  <OptimizedImage
                    src={currentItem.url}
                    alt={currentItem.titulo || 'Imagem'}
                    className="w-full h-full object-contain"
                    isPreloaded={isImagePreloaded(currentItem.url)}
                    priority="high"
                    style={{
                      objectPosition: isTallImage ? 'center right' : 'center center'
                    }}
                    onLoad={(e) => {
                      if (!currentItem || !currentItem.url) return;
                      const img = e?.target || document.querySelector(`img[src="${currentItem.url}"]`);
                      if (img && img.naturalWidth && img.naturalHeight) {
                        handleImageLoad({ target: img });
                      }
                    }}
                  />
                )}
              </div>

              {isTallImage && items[current + 1] && (
                <div className="flex-1 h-full flex items-center justify-start overflow-hidden">
                  {items[current + 1].origem === 'capa' ? (
                    <img
                      src={items[current + 1].url}
                      alt={items[current + 1].titulo || 'Imagem'}
                      className="w-full h-full object-contain"
                      style={{
                        display: 'block',
                        objectPosition: 'center left',
                        filter: 'saturate(1.3)'
                      }}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  ) : (
                    <OptimizedImage
                      src={items[current + 1].url}
                      alt={items[current + 1].titulo || 'Imagem'}
                      className="w-full h-full object-contain"
                      isPreloaded={isImagePreloaded(items[current + 1].url)}
                      priority="high"
                      style={{
                        objectPosition: 'center left'
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          )}
          {loading && hasItems && (
            <div className="absolute top-4 right-4 z-20 bg-white/90 px-3 py-1.5 rounded-full text-xs text-gray-600 shadow">
              Carregando mais imagens...
            </div>
          )}
        </div>

        {currentItem && (
          <div className="absolute bottom-3 left-3 right-3 z-10 flex">
            <div
              className="text-white px-3 py-2"
              style={{
                backgroundColor: 'rgba(0,0,0,0.88)',
                borderRadius: '8px',
                maxWidth: '80%',
              }}
            >
              {hasContent(currentItem.titulo) && (
                <h4 className="text-sm font-semibold m-0">{currentItem.titulo}</h4>
              )}
              {(hasContent(currentItem.autor) || currentItem.dataFoto) && (
                <div className="text-[11px] mt-0.5 space-x-2">
                  {hasContent(currentItem.autor) && <span>Por: {currentItem.autor}</span>}
                  {currentItem.dataFoto && (
                    <span>{formatDateForDisplay(currentItem.dataFoto)}</span>
                  )}
                </div>
              )}
              {hasContent(currentItem.descricao) && (
                <p className="text-xs mt-1 m-0">
                  {currentItem.descricao}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SidebarMediaViewer);
