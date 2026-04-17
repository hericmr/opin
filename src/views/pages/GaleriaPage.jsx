import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Footer from '../../components/Footer';
import useSidebarImages from '../../hooks/useSidebarImages';
import { useEscolaDetalhes } from '../../hooks/useEscolaDetalhes';
import { idFromEscolaSlug } from '../../utils/slug';

const siteUrl = 'https://hericmr.github.io/opin';

// Lightbox
const Lightbox = ({ items, index, onClose, onPrev, onNext }) => {
  const item = items[index];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-white/60 text-sm">
          {index + 1} / {items.length}
        </span>
        <div className="flex items-center gap-3">
          {item.url && (
            <a
              href={item.url}
              download
              target="_blank"
              rel="noreferrer"
              className="p-2 text-white/60 hover:text-white transition-colors"
              title="Baixar imagem"
            >
              <Download className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Imagem */}
      <div
        className="flex-1 flex items-center justify-center px-16 min-h-0"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.titulo || ''}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>

      {/* Legenda */}
      {(item.titulo || item.descricao) && (
        <div className="px-6 py-4 text-center flex-shrink-0" onClick={e => e.stopPropagation()}>
          {item.titulo && <p className="text-white font-medium text-sm">{item.titulo}</p>}
          {item.descricao && <p className="text-white/60 text-xs mt-1">{item.descricao}</p>}
        </div>
      )}

      {/* Setas */}
      {index > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          onClick={e => { e.stopPropagation(); onPrev(); }}
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}
      {index < items.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
          onClick={e => { e.stopPropagation(); onNext(); }}
          aria-label="Próxima foto"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

const GaleriaPage = () => {
  const { slug } = useParams();
  const id = idFromEscolaSlug(slug);
  const { data: escola, loading: loadingEscola } = useEscolaDetalhes(id);
  const { items, loading: loadingImages, hasItems } = useSidebarImages({
    escolaId: id,
    showTeacher: false,
    showSchool: true,
  });

  const [lightboxIndex, setLightboxIndex] = useState(null);

  const nome = escola?.nome || '';
  const escolaSlug = `/escola/${slug}`;

  const openLightbox = useCallback((i) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => setLightboxIndex(i => Math.max(0, i - 1)), []);
  const nextPhoto = useCallback(() => setLightboxIndex(i => Math.min(items.length - 1, i + 1)), [items.length]);

  const loading = loadingEscola || loadingImages;

  return (
    <div className="min-h-screen dashboard-scroll bg-white">
      <Helmet>
        <title>{nome ? `Galeria – ${nome} – OPIN` : 'Galeria – OPIN'}</title>
        <meta name="description" content={`Galeria de fotos de ${nome}.`} />
        <meta property="og:image" content={escola?.imagem_header || `${siteUrl}/hero_grayscale.webp`} />
      </Helmet>

      {/* Hero simples — rola com a página */}
      <div
        className="relative text-white"
        style={{
          backgroundImage: `url('${escola?.imagem_header || `${siteUrl}/hero_grayscale.webp`}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '40vh',
        }}
      >
        <div className="absolute inset-0 bg-green-900/55" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 flex flex-col justify-end pb-8 h-full" style={{ minHeight: '40vh' }}>
          <Link to={escolaSlug} className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> {nome || 'Escola'}
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: 'Sora, sans-serif' }}>
            Galeria de fotos
          </h1>
          {nome && <p className="text-white/70 mt-2 text-lg">{nome}</p>}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-10">
        {hasItems && (
          <p className="text-sm text-gray-400 mb-8">{items.length} {items.length === 1 ? 'foto' : 'fotos'}</p>
        )}

        {/* Grid de fotos */}
        {loading && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse rounded-lg break-inside-avoid"
                style={{ height: `${140 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        )}

        {!loading && !hasItems && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg font-medium">Nenhuma foto disponível para esta escola.</p>
          </div>
        )}

        {!loading && hasItems && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 space-y-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className="block w-full break-inside-avoid rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
                onClick={() => openLightbox(i)}
                aria-label={item.titulo || `Foto ${i + 1}`}
              >
                <img
                  src={item.url}
                  alt={item.titulo || ''}
                  className="w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                  loading="lazy"
                />
                {item.titulo && (
                  <div className="bg-gray-50 px-3 py-2 text-left">
                    <p className="text-xs text-gray-600 leading-snug">{item.titulo}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      <Footer />
    </div>
  );
};

export default GaleriaPage;
