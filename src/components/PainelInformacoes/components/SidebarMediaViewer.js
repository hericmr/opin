import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../dbClient';
import { getLegendaByImageUrlFlexivel } from '../../../services/legendasService';
import OptimizedImage from '../../shared/OptimizedImage';
import useImagePreloader from '../../../hooks/useImagePreloader';
import { formatDateForDisplay } from '../../../utils/dateUtils';

// Helper function to check if a value has actual content
const hasContent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

const SidebarMediaViewer = ({ escolaId, refreshKey = 0, showTeacher = true, showSchool = true, scrollProgress, headerUrl, onCurrentItemChange }) => {
  // Initialize with header image if available to show it immediately
  const initialHeaderItem = headerUrl ? [{
    id: `header-${escolaId || 'temp'}`,
    url: headerUrl,
    titulo: null,
    descricao: null,
    autor: null,
    dataFoto: null,
    origem: 'capa',
  }] : [];

  const [items, setItems] = useState(initialHeaderItem);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isImagePreloaded } = useImagePreloader(escolaId, true);
  const [manualOverrideUntil, setManualOverrideUntil] = useState(0);
  // Track image aspect ratios to determine if image is tall/narrow
  const [imageAspectRatios, setImageAspectRatios] = useState(new Map());

  // URL base do storage remoto (produção)
  const REMOTE_STORAGE_URL = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/';

  const fetchBucketList = useCallback(async (bucket, categoria) => {
    let mapped = [];

    if (categoria === 'escola') {
      // Buscar da tabela legendas_fotos
      const { data: legendas, error } = await supabase
        .from('legendas_fotos')
        .select('*')
        .eq('escola_id', escolaId)
        .eq('tipo_foto', 'escola')
        .eq('ativo', true)
        .order('ordem', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!legendas) return [];

      mapped = legendas.map((legenda, index) => {
        let publicUrl = null;
        if (legenda.imagem_url) {
          if (legenda.imagem_url.startsWith('http')) {
            publicUrl = legenda.imagem_url;
          } else {
            // Construir URL usando o bucket remoto e o nome do bucket correto
            publicUrl = `${REMOTE_STORAGE_URL}imagens-das-escolas/${legenda.imagem_url}`;
          }
        }

        return {
          id: legenda.id || `escola-${index}`,
          url: publicUrl,
          filePath: legenda.imagem_url,
          titulo: hasContent(legenda.legenda) ? legenda.legenda.trim() : null,
          descricao: hasContent(legenda.descricao_detalhada) ? legenda.descricao_detalhada.trim() : null,
          autor: hasContent(legenda.autor_foto) ? legenda.autor_foto.trim() : null,
          dataFoto: legenda.data_foto,
          origem: 'escola',
          ordem: legenda.ordem !== null && legenda.ordem !== undefined ? legenda.ordem : index,
        };
      });

    } else if (categoria === 'professor') {
      // Buscar da tabela imagens_professores
      const { data: imgsProf, error } = await supabase
        .from('imagens_professores')
        .select('*')
        .eq('escola_id', escolaId)
        .eq('ativo', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!imgsProf) return [];

      mapped = imgsProf.map((img, index) => {
        let publicUrl = null;
        if (img.imagem_url) {
          if (img.imagem_url.startsWith('http')) {
            publicUrl = img.imagem_url;
          } else {
            // Construir URL usando o bucket remoto
            publicUrl = `${REMOTE_STORAGE_URL}imagens-professores/${img.imagem_url}`;
          }
        }

        return {
          id: img.id || `prof-${index}`,
          url: publicUrl,
          filePath: img.imagem_url,
          titulo: null, // Tabela imagens_professores não tem título/legenda explícita além de nome_arquivo ou autor
          descricao: null,
          autor: img.autor,
          dataFoto: img.created_at, // Usando created_at como data da foto
          origem: 'professor',
          ordem: index + 1000, // Colocar depois das escolas se não tiver ordem
        };
      });
    }

    return mapped;
  }, [escolaId]);

  // Update items immediately when headerUrl changes to show image instantly
  useEffect(() => {
    if (headerUrl) {
      const headerItem = {
        id: `header-${escolaId || 'temp'}`,
        url: headerUrl,
        titulo: null,
        descricao: null,
        autor: null,
        dataFoto: null,
        origem: 'capa',
      };
      setItems(prev => {
        // Check if header already exists
        const exists = prev.some(i => i.origem === 'capa' && i.url === headerUrl);
        if (exists) return prev;
        // Replace existing header or add new one at the beginning
        const withoutHeader = prev.filter(i => i.origem !== 'capa');
        return [headerItem, ...withoutHeader];
      });
    }
  }, [headerUrl, escolaId]);

  useEffect(() => {
    let mounted = true;
    if (!escolaId) {
      // If no escolaId but we have headerUrl, keep it (already handled by above effect)
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    // Show header image immediately if available (already in items state)
    // This prevents the delay when maximizing the panel

    (async () => {
      try {
        const promises = [];
        if (showSchool) promises.push(fetchBucketList('imagens-das-escolas', 'escola'));
        if (showTeacher) promises.push(fetchBucketList('imagens-professores', 'professor'));
        const results = await Promise.all(promises);
        let combined = results.flat();
        // Prepend header image if provided and not already in list
        if (headerUrl) {
          const exists = combined.some(i => i.url === headerUrl);
          const headerItem = {
            id: `header-${escolaId}`,
            url: headerUrl,
            titulo: null,
            descricao: null,
            autor: null,
            dataFoto: null,
            origem: 'capa',
          };
          combined = exists ? combined : [headerItem, ...combined];
        }
        if (!mounted) return;
        // Sort by origem to prioritize school first then teacher, maintain stable order
        // Ensure header stays first if present
        const ordered = combined.sort((a, b) => {
          if (a.origem === 'capa') return -1;
          if (b.origem === 'capa') return 1;
          return a.origem.localeCompare(b.origem);
        });
        setItems(ordered);
        setCurrent(0);
      } catch (e) {
        if (!mounted) return;
        setError('Erro ao carregar imagens.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [escolaId, refreshKey, fetchBucketList, showSchool, showTeacher, headerUrl]);

  const hasItems = items.length > 0;
  const currentItem = useMemo(() => {
    if (!hasItems || current < 0 || current >= items.length) return null;
    return items[current] || null;
  }, [items, current, hasItems]);

  // Detect if current image is tall/narrow (portrait orientation)
  const isTallImage = useMemo(() => {
    if (!currentItem || !currentItem.url) return false;
    const aspectRatio = imageAspectRatios.get(currentItem.url);
    // If height > width, it's a tall image (aspect ratio < 1 means portrait)
    return aspectRatio !== undefined && aspectRatio < 1;
  }, [currentItem, imageAspectRatios]);

  // Handler to detect image dimensions when image loads
  const handleImageLoad = useCallback((e) => {
    if (!currentItem || !currentItem.url) return;
    const img = e.target || e.currentTarget;
    if (img && img.naturalWidth && img.naturalHeight) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatios(prev => new Map(prev).set(currentItem.url, aspectRatio));
    }
  }, [currentItem]);

  // Notify parent when current item changes
  useEffect(() => {
    if (onCurrentItemChange && currentItem) {
      onCurrentItemChange(currentItem);
    }
  }, [currentItem, onCurrentItemChange]);

  // Sync current image to scroll progress
  useEffect(() => {
    if (!hasItems || typeof scrollProgress !== 'number') return;
    // If user recently navigated manually, skip syncing from scroll
    if (Date.now() < manualOverrideUntil) return;
    const idx = Math.floor(scrollProgress * Math.max(0, items.length - 1));
    if (Number.isFinite(idx) && idx !== current) {
      setCurrent(idx);
    }
  }, [scrollProgress, hasItems, items.length, current, manualOverrideUntil]);

  const prev = useCallback(() => {
    if (!hasItems) return;
    setCurrent((idx) => (idx > 0 ? idx - 1 : items.length - 1));
    setManualOverrideUntil(Date.now() + 1200);
  }, [hasItems, items.length]);

  const next = useCallback(() => {
    if (!hasItems) return;
    setCurrent((idx) => (idx < items.length - 1 ? idx + 1 : 0));
    setManualOverrideUntil(Date.now() + 1200);
  }, [hasItems, items.length]);

  // Show error only if there's an error and no items to display
  if (error && !hasItems) {
    return <div className="text-red-600">{error}</div>;
  }

  // Show "no items" only if not loading and no items
  if (!loading && !hasItems) {
    return <div className="text-gray-600">Nenhuma imagem disponível.</div>;
  }

  // If loading but we have items (e.g., header image), show the viewer with loading indicator

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

        <div className="w-full h-full bg-black/5 overflow-y-auto overflow-x-hidden flex items-start justify-center">
          {currentItem && (
            <>
              {/* Use regular img with smart object-fit: contain for tall images, cover for wide images */}
              {currentItem.origem === 'capa' ? (
                <img
                  src={currentItem.url}
                  alt={currentItem.titulo || 'Imagem'}
                  className={isTallImage ? 'w-full object-contain' : 'w-full h-full object-cover'}
                  style={{
                    maxHeight: isTallImage ? 'none' : '100%',
                    minHeight: isTallImage ? '100%' : 'auto',
                    maxWidth: '100%',
                    display: 'block',
                    objectPosition: isTallImage ? 'top center' : 'center center',
                    filter: 'saturate(1.3)'
                  }}
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  onLoad={handleImageLoad}
                />
              ) : (
                <OptimizedImage
                  src={currentItem.url}
                  alt={currentItem.titulo || 'Imagem'}
                  className={isTallImage ? 'w-full object-contain' : 'w-full h-full object-cover'}
                  isPreloaded={isImagePreloaded(currentItem.url)}
                  priority="high"
                  style={{
                    maxHeight: isTallImage ? 'none' : '100%',
                    minHeight: isTallImage ? '100%' : 'auto',
                    maxWidth: '100%',
                    objectPosition: isTallImage ? 'top center' : 'center center'
                  }}
                  onLoad={(e) => {
                    // OptimizedImage passes the event, but we need the actual img element
                    if (!currentItem || !currentItem.url) return;
                    const img = e?.target || document.querySelector(`img[src="${currentItem.url}"]`);
                    if (img && img.naturalWidth && img.naturalHeight) {
                      const aspectRatio = img.naturalWidth / img.naturalHeight;
                      setImageAspectRatios(prev => new Map(prev).set(currentItem.url, aspectRatio));
                    }
                  }}
                />
              )}
            </>
          )}
          {loading && hasItems && (
            <div className="absolute top-4 right-4 z-20 bg-white/90 px-3 py-1.5 rounded-full text-xs text-gray-600 shadow">
              Carregando mais imagens...
            </div>
          )}
        </div>

        {/* Caption at bottom with black background */}
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


