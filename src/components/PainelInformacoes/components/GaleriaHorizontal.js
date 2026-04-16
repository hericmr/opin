import React from 'react';
import { ChevronRight } from 'lucide-react';
import useSidebarImages from '../../../hooks/useSidebarImages';

const VISIBLE_COUNT = 9; // fotos visíveis antes do botão "+X"

/**
 * Grade compacta de miniaturas — mostra até 9 fotos + célula "ver todas".
 * Fica entre HistoriaEscola e HistoriadoProfessor.
 * Só exibe fotos da escola (showTeacher: false).
 */
const GaleriaHorizontal = ({ escola_id, onOpenGaleria, hideInlineMedia }) => {
  const { items, loading, hasItems } = useSidebarImages({
    escolaId: escola_id,
    showTeacher: false,
    showSchool: true,
  });

  if (hideInlineMedia) return null;
  if (!loading && !hasItems) return null;

  const visible = items.slice(0, VISIBLE_COUNT);
  const remaining = items.length - VISIBLE_COUNT;

  return (
    <section className="my-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 bg-green-600 rounded-full" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            Galeria de fotos
          </span>
          {hasItems && (
            <span className="text-xs text-gray-400">
              · {items.length} {items.length === 1 ? 'foto' : 'fotos'}
            </span>
          )}
        </div>
        {hasItems && onOpenGaleria && (
          <button
            type="button"
            onClick={onOpenGaleria}
            className="flex items-center gap-0.5 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors"
          >
            Ver todas
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grade */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-5 gap-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-1">
          {visible.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={onOpenGaleria}
              className="aspect-square rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
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
