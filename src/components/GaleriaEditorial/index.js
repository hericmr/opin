import React, { useState } from 'react';
import { Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSidebarImages from '../../hooks/useSidebarImages';
import GaleriaPanel from '../PainelInformacoes/components/GaleriaPanel';
import { escolaUrlSlug } from '../../utils/slug';

/**
 * Galeria editorial para páginas estáticas de escola.
 *
 * Layout (8+ fotos):
 *   col: [1fr 1fr 2fr 2fr 2fr]  (5 colunas)
 *
 *   [ 1 ][ 2 ][ grande (cols 3-5, rows 1-2) ]
 *   [ 3 ][ 4 ][                              ]
 *   [ 5 ][ 6 ][ 7 ][ 8 ][ 9 ]   ← fila extra
 *
 * Com menos fotos degrada graciosamente para grid uniforme.
 */

const FEATURED_INDEX = 0; // imagem grande
const SMALL_INDICES = [1, 2, 3, 4]; // 2×2 à esquerda
const EXTRA_INDICES = [5, 6, 7, 8, 9]; // fila inferior

const imgClass = 'w-full h-full object-cover block transition-opacity duration-200 hover:opacity-90 cursor-pointer';

const GaleriaEditorial = ({ escola_id, headerUrl, titulo, escolaNome }) => {
  const [galeriaOpen, setGaleriaOpen] = useState(false);
  const galeriaSlug = escolaUrlSlug(escola_id, escolaNome || titulo || String(escola_id));

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
            to={`/galeria/${galeriaSlug}`}
            className="text-sm font-semibold text-green-700 hover:text-green-900 flex items-center gap-1 transition-colors"
          >
            Ver todas as fotos →
          </Link>
        )}
      </div>

      {/* Skeleton */}
      {loading && !hasItems && (
        <div className="grid gap-1 rounded-xl overflow-hidden" style={{ gridTemplateColumns: '1fr 1fr 2fr 2fr 2fr', gridTemplateRows: '200px 200px', height: 402 }}>
          <div className="bg-gray-200 animate-pulse" />
          <div className="bg-gray-200 animate-pulse" />
          <div style={{ gridColumn: '3/6', gridRow: '1/3' }} className="bg-gray-200 animate-pulse" />
          <div className="bg-gray-200 animate-pulse" />
          <div className="bg-gray-200 animate-pulse" />
        </div>
      )}

      {/* Layout editorial */}
      {hasItems && useEditorial && (
        <>
          <div
            className="grid gap-1 rounded-xl overflow-hidden"
            style={{
              gridTemplateColumns: '1fr 1fr 2fr 2fr 2fr',
              gridTemplateRows: '200px 200px',
            }}
          >
            {/* 4 miniaturas à esquerda em 2×2 */}
            {smalls.map((item, i) => {
              const col = (i % 2) + 1;
              const row = Math.floor(i / 2) + 1;
              return (
                <div
                  key={item.id}
                  style={{ gridColumn: col, gridRow: row }}
                  className="overflow-hidden bg-gray-100"
                >
                  <img
                    src={item.url}
                    alt={item.titulo || ''}
                    className={imgClass}
                    loading="lazy"
                    onClick={() => setGaleriaOpen(true)}
                  />
                </div>
              );
            })}

            {/* Imagem grande à direita */}
            {featured && (
              <div
                style={{ gridColumn: '3 / 6', gridRow: '1 / 3' }}
                className="overflow-hidden bg-gray-100"
              >
                <img
                  src={featured.url}
                  alt={featured.titulo || ''}
                  className={imgClass}
                  loading="lazy"
                  onClick={() => setGaleriaOpen(true)}
                />
              </div>
            )}
          </div>

          {/* Fila de extras */}
          {extras.length > 0 && (
            <div
              className="grid gap-1 mt-1 rounded-b-xl overflow-hidden"
              style={{ gridTemplateColumns: `repeat(${extras.length}, 1fr)`, height: 140 }}
            >
              {extras.map(item => (
                <div key={item.id} className="overflow-hidden bg-gray-100">
                  <img
                    src={item.url}
                    alt={item.titulo || ''}
                    className={imgClass}
                    loading="lazy"
                    onClick={() => setGaleriaOpen(true)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Fallback: grid uniforme para < 5 fotos */}
      {hasItems && !useEditorial && (
        <div
          className="grid gap-1 rounded-xl overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${Math.min(total, 3)}, 1fr)`, height: 220 }}
        >
          {items.slice(0, 3).map(item => (
            <div key={item.id} className="overflow-hidden bg-gray-100">
              <img
                src={item.url}
                alt={item.titulo || ''}
                className={imgClass}
                loading="lazy"
                onClick={() => setGaleriaOpen(true)}
              />
            </div>
          ))}
        </div>
      )}

      {galeriaOpen && (
        <GaleriaPanel
          escolaId={escola_id}
          headerUrl={headerUrl}
          titulo={titulo}
          isOpen={galeriaOpen}
          onClose={() => setGaleriaOpen(false)}
        />
      )}
    </section>
  );
};

export default GaleriaEditorial;
