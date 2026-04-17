import React from 'react';
import { Images } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useSidebarImages from '../../hooks/useSidebarImages';
import { escolaUrlSlug } from '../../utils/slug';

/**
 * Galeria editorial para páginas estáticas de escola.
 * Clicar em qualquer imagem ou em "Ver todas" navega para /galeria/:slug.
 *
 * Layout (5+ fotos):
 *   col: [1fr 1fr 2fr 2fr 2fr]
 *   [ 1 ][ 2 ][ grande (cols 3-5, rows 1-2) ]
 *   [ 3 ][ 4 ][                              ]
 *   [ 5 ][ 6 ][ 7 ][ 8 ][ 9 ]   ← fila extra
 */

const FEATURED_INDEX = 0;
const SMALL_INDICES = [1, 2, 3, 4];
const EXTRA_INDICES = [5, 6, 7, 8, 9];

const GaleriaEditorial = ({ escola_id, titulo, escolaNome }) => {
  const navigate = useNavigate();
  const galeriaSlug = escolaUrlSlug(escola_id, escolaNome || titulo || String(escola_id));
  const galeriaUrl = `/galeria/${galeriaSlug}`;

  const { items, loading, hasItems } = useSidebarImages({
    escolaId: escola_id,
    showTeacher: false,
    showSchool: true,
  });

  if (!loading && !hasItems) return null;

  const total = items.length;
  const featured = items[FEATURED_INDEX];
  const smalls = SMALL_INDICES.map(i => items[i]).filter(Boolean);
  const extras = EXTRA_INDICES.map(i => items[i]).filter(Boolean);
  const useEditorial = total >= 5;

  const imgClass = 'w-full h-full object-cover block transition-opacity duration-200 hover:opacity-90 cursor-pointer';

  const goToGaleria = () => navigate(galeriaUrl);

  return (
    <section className="py-10 border-b border-gray-100">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Images className="w-5 h-5 text-green-700" />
          <span className="text-xl font-bold text-gray-900">Galeria de fotos</span>
          {hasItems && (
            <span className="text-sm text-gray-400">{total} {total === 1 ? 'foto' : 'fotos'}</span>
          )}
        </div>
        {hasItems && (
          <Link
            to={galeriaUrl}
            className="text-sm font-semibold text-green-700 hover:text-green-900 transition-colors"
          >
            Ver todas as fotos →
          </Link>
        )}
      </div>

      {/* Skeleton */}
      {loading && !hasItems && (
        <div className="grid gap-1 rounded-xl overflow-hidden" style={{ gridTemplateColumns: '1fr 1fr 2fr 2fr 2fr', gridTemplateRows: '200px 200px' }}>
          <div className="bg-gray-100 animate-pulse" />
          <div className="bg-gray-100 animate-pulse" />
          <div style={{ gridColumn: '3/6', gridRow: '1/3' }} className="bg-gray-100 animate-pulse" />
          <div className="bg-gray-100 animate-pulse" />
          <div className="bg-gray-100 animate-pulse" />
        </div>
      )}

      {/* Layout editorial */}
      {hasItems && useEditorial && (
        <>
          <div
            className="grid gap-1 rounded-xl overflow-hidden"
            style={{ gridTemplateColumns: '1fr 1fr 2fr 2fr 2fr', gridTemplateRows: '200px 200px' }}
          >
            {smalls.map((item, i) => (
              <div
                key={item.id}
                style={{ gridColumn: (i % 2) + 1, gridRow: Math.floor(i / 2) + 1 }}
                className="overflow-hidden bg-gray-100"
                onClick={goToGaleria}
              >
                <img src={item.url} alt={item.titulo || ''} className={imgClass} loading="lazy" />
              </div>
            ))}

            {featured && (
              <div
                style={{ gridColumn: '3 / 6', gridRow: '1 / 3' }}
                className="overflow-hidden bg-gray-100"
                onClick={goToGaleria}
              >
                <img src={featured.url} alt={featured.titulo || ''} className={imgClass} loading="lazy" />
              </div>
            )}
          </div>

          {extras.length > 0 && (
            <div
              className="grid gap-1 mt-1 rounded-b-xl overflow-hidden"
              style={{ gridTemplateColumns: `repeat(${extras.length}, 1fr)`, height: 140 }}
            >
              {extras.map(item => (
                <div key={item.id} className="overflow-hidden bg-gray-100" onClick={goToGaleria}>
                  <img src={item.url} alt={item.titulo || ''} className={imgClass} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Fallback: grid simples para < 5 fotos */}
      {hasItems && !useEditorial && (
        <div
          className="grid gap-1 rounded-xl overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${Math.min(total, 3)}, 1fr)`, height: 220 }}
        >
          {items.slice(0, 3).map(item => (
            <div key={item.id} className="overflow-hidden bg-gray-100" onClick={goToGaleria}>
              <img src={item.url} alt={item.titulo || ''} className={imgClass} loading="lazy" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GaleriaEditorial;
