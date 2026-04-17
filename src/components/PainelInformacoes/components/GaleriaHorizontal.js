import React from 'react';
import { ChevronRight } from 'lucide-react';
import useSidebarImages from '../../../hooks/useSidebarImages';

const VISIBLE_COUNT = 9;

/**
 * Layout bento:
 *   [  0 (2col × 2row)  ][1]
 *   [  0 (2col × 2row)  ][2]
 *   [3][4][5]
 *   [6][7][8]
 *
 * Primeira foto em destaque, restante em grade uniforme.
 * Só fotos da escola (showTeacher: false).
 */
const getGridStyle = (index) => {
  if (index === 0) return { gridColumn: '1 / 3', gridRow: '1 / 3' };
  if (index === 1) return { gridColumn: '3',     gridRow: '1' };
  if (index === 2) return { gridColumn: '3',     gridRow: '2' };
  return {}; // índices 3–8: auto-placement nas linhas 3–4
};

const GaleriaHorizontal = ({ escola_id, onOpenGaleria, hideInlineMedia }) => {
  const { items, loading, hasItems } = useSidebarImages({
    escolaId: escola_id,
    showTeacher: false,
    showSchool: true,
  });

  if (hideInlineMedia) return null;
  if (!loading && !hasItems) return null;

  const visible = items.slice(0, VISIBLE_COUNT);
  const useBento = visible.length >= 4;

  return (
    <section className="my-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight leading-tight">
            Galeria de fotos
          </span>
          {hasItems && (
            <span className="text-xs text-gray-400 font-normal">
              {items.length} {items.length === 1 ? 'foto' : 'fotos'}
            </span>
          )}
        </div>
        {hasItems && onOpenGaleria && (
          <button
            type="button"
            onClick={onOpenGaleria}
            className="flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Skeleton */}
      {loading && items.length === 0 && (
        <div
          className="grid gap-1 rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            height: '460px',
          }}
        >
          <div style={{ gridColumn: '1 / 3', gridRow: '1 / 3' }} className="bg-gray-200 animate-pulse" />
          <div className="bg-gray-200 animate-pulse" />
          <div className="bg-gray-200 animate-pulse" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-200 animate-pulse" />
          ))}
        </div>
      )}

      {/* Bento grid (4+ fotos) */}
      {hasItems && useBento && (
        <div
          className="grid gap-1 rounded-lg overflow-hidden cursor-pointer"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(4, 1fr)',
            height: '460px',
          }}
          onClick={onOpenGaleria}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOpenGaleria?.()}
          aria-label="Abrir galeria de fotos"
        >
          {visible.map((item, i) => (
            <div key={item.id} style={getGridStyle(i)} className="overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={item.url}
                alt={item.titulo || ''}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Grade simples (1–3 fotos) */}
      {hasItems && !useBento && (
        <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={onOpenGaleria}
              className="aspect-square overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
              aria-label={item.titulo || 'Abrir galeria'}
            >
              <img
                src={item.url}
                alt=""
                className="w-full h-full object-cover block"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default React.memo(GaleriaHorizontal);
