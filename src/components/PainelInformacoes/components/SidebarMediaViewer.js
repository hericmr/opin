import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { getLegendaByImageUrlFlexivel } from '../../../services/legendasService';
import OptimizedImage from '../../shared/OptimizedImage';
import useImagePreloader from '../../../hooks/useImagePreloader';

const SidebarMediaViewer = ({ escolaId, refreshKey = 0, showTeacher = true, showSchool = true, scrollProgress, headerUrl }) => {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isImagePreloaded } = useImagePreloader(escolaId, true);
  const [manualOverrideUntil, setManualOverrideUntil] = useState(0);

  const fetchBucketList = useCallback(async (bucket, categoria) => {
    const { data: files, error: listErr } = await supabase.storage.from(bucket).list(`${escolaId}/`);
    if (listErr) throw listErr;
    if (!files || files.length === 0) return [];

    const mapped = await Promise.all(
      files.map(async (file, index) => {
        const filePath = `${escolaId}/${file.name}`;
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
        let legenda = null;
        try {
          legenda = await getLegendaByImageUrlFlexivel(filePath, escolaId, {
            categoria,
            tipo_foto: categoria,
          });
        } catch (_) {}
        return {
          id: `${bucket}-${file.name}`,
          url: publicUrl,
          titulo: legenda?.legenda || `Imagem ${index + 1}`,
          descricao: legenda?.descricao_detalhada || '',
          autor: legenda?.autor_foto || '',
          dataFoto: legenda?.data_foto || '',
          origem: categoria,
        };
      })
    );
    return mapped;
  }, [escolaId]);

  useEffect(() => {
    let mounted = true;
    if (!escolaId) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
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
            titulo: '',
            descricao: '',
            autor: '',
            dataFoto: '',
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
  }, [escolaId, refreshKey, fetchBucketList, showSchool, showTeacher]);

  const hasItems = items.length > 0;
  const currentItem = useMemo(() => (hasItems ? items[current] : null), [items, current, hasItems]);

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

  if (loading) {
    return <div className="text-gray-500">Carregando imagens...</div>;
  }
  if (error) {
    return <div className="text-red-600">{error}</div>;
  }
  if (!hasItems) {
    return <div className="text-gray-600">Nenhuma imagem disponível.</div>;
  }

  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0">
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

        <div className="w-full h-full bg-black/5 overflow-hidden">
          <OptimizedImage
            src={currentItem.url}
            alt={currentItem.titulo || 'Imagem'}
            className="w-full h-full object-cover"
            isPreloaded={isImagePreloaded(currentItem.url)}
            style={{ maxHeight: '100%', maxWidth: '100%' }}
          />
        </div>

        <div className="absolute bottom-3 left-3 right-3 z-10 flex">
          <div
            className="text-white px-3 py-2"
            style={{
              backgroundColor: 'rgba(0,0,0,0.88)',
              borderRadius: '8px',
              maxWidth: '80%',
            }}
          >
            {currentItem.titulo && (
              <h4 className="text-sm font-semibold m-0">{currentItem.titulo}</h4>
            )}
            <div className="text-[11px] mt-0.5 space-x-2">
              {currentItem.origem && <span className="capitalize">{currentItem.origem}</span>}
              {currentItem.autor && <span>Por: {currentItem.autor}</span>}
              {currentItem.dataFoto && (
                <span>{new Date(currentItem.dataFoto).toLocaleDateString('pt-BR')}</span>
              )}
            </div>
            {currentItem.descricao && (
              <p className="text-xs mt-1 m-0">
                {currentItem.descricao}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SidebarMediaViewer);


