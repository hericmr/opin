import React from 'react';
import { ChevronRight } from 'lucide-react';
import useSidebarImages from '../../../hooks/useSidebarImages';

const GaleriaStrip = ({ escolaId, headerUrl, onOpenGaleria }) => {
  const { items, loading, hasItems } = useSidebarImages({ escolaId, headerUrl });

  // Não exibe se ainda carregando sem nenhuma imagem, ou se tiver só 1 foto
  if ((!hasItems && !loading) || items.length < 2) return null;

  const thumbs = items.slice(0, 5);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
      {/* Miniaturas */}
      <div className="flex gap-1 flex-shrink-0">
        {thumbs.map((item) => (
          <div
            key={item.id}
            className="w-9 h-9 rounded overflow-hidden bg-gray-200 flex-shrink-0"
          >
            <img
              src={item.url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Contagem */}
      {hasItems && (
        <span className="text-xs text-gray-500 flex-shrink-0">
          {items.length} {items.length === 1 ? 'foto' : 'fotos'}
        </span>
      )}

      <div className="flex-1" />

      {/* CTA */}
      <button
        type="button"
        onClick={onOpenGaleria}
        className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 transition-colors flex-shrink-0"
      >
        Ir para galeria
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default React.memo(GaleriaStrip);
