import { useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from '../dbClient';
import { getLegendaByImageUrlFlexivel } from '../services/legendasService';
import useImagePreloader from './useImagePreloader';
import { getLocalImageUrl, getSupabaseStorageUrl, getSecureImageUrl } from '../utils/imageUtils';
import logger from '../utils/logger';
import { hasContent } from '../utils/contentValidation';
import { useRefresh } from '../contexts/RefreshContext';

/**
 * Hook que encapsula toda a lógica de dados e navegação do SidebarMediaViewer.
 * O componente fica responsável apenas pela renderização.
 */
const useSidebarImages = ({ escolaId, showTeacher = true, showSchool = true, scrollProgress, headerUrl, onCurrentItemChange }) => {
  const { refreshKey } = useRefresh();
  const { isImagePreloaded } = useImagePreloader(escolaId, true);

  const initialHeaderItem = headerUrl ? [{
    id: `header-${escolaId || 'temp'}`,
    url: getLocalImageUrl(headerUrl),
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
  const [manualOverrideUntil, setManualOverrideUntil] = useState(0);
  const [imageAspectRatios, setImageAspectRatios] = useState(new Map());

  const fetchBucketList = useCallback(async (bucket, categoria) => {
    let mapped = [];

    if (categoria === 'escola') {
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

      mapped = legendas
        .filter(legenda => hasContent(legenda.imagem_url))
        .map((legenda, index) => {
          let publicUrl = null;
          if (legenda.imagem_url) {
            if (legenda.imagem_url.trim().startsWith('http')) {
              publicUrl = getSecureImageUrl(legenda.imagem_url.trim());
            } else {
              const storageUrl = getSupabaseStorageUrl('imagens-das-escolas', legenda.imagem_url.trim());
              publicUrl = getSecureImageUrl(storageUrl);
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
      const { data: imgsProf, error } = await supabase
        .from('imagens_professores')
        .select('*')
        .eq('escola_id', escolaId)
        .eq('ativo', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (!imgsProf) return [];

      // 1 query para todas as legendas de professor
      const { data: legendasProfessor } = await supabase
        .from('legendas_fotos')
        .select('*')
        .eq('escola_id', escolaId)
        .eq('tipo_foto', 'professor')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      const legendaMap = new Map();
      (legendasProfessor || []).forEach(l => {
        if (l.imagem_url && !legendaMap.has(l.imagem_url)) legendaMap.set(l.imagem_url, l);
        const filename = l.imagem_url?.split('/').pop();
        if (filename && !legendaMap.has(filename)) legendaMap.set(filename, l);
      });

      mapped = imgsProf
        .filter(img => hasContent(img.imagem_url))
        .map((img, index) => {
          let publicUrl = null;
          if (img.imagem_url) {
            if (img.imagem_url.trim().startsWith('http')) {
              publicUrl = getSecureImageUrl(img.imagem_url.trim());
            } else {
              const storageUrl = getSupabaseStorageUrl('imagens-professores', img.imagem_url.trim());
              publicUrl = getSecureImageUrl(storageUrl);
            }
          }
          const filename = img.imagem_url?.split('/').pop();
          const legendaObj = legendaMap.get(img.imagem_url) || legendaMap.get(filename) || null;
          return {
            id: img.id || `prof-${index}`,
            url: publicUrl,
            filePath: img.imagem_url,
            titulo: hasContent(legendaObj?.legenda) ? legendaObj.legenda.trim() : null,
            descricao: hasContent(legendaObj?.descricao_detalhada) ? legendaObj.descricao_detalhada.trim() : null,
            autor: hasContent(legendaObj?.autor_foto) ? legendaObj.autor_foto.trim() : (img.autor || null),
            dataFoto: legendaObj?.data_foto || img.created_at,
            origem: 'professor',
            ordem: legendaObj?.ordem !== null && legendaObj?.ordem !== undefined ? legendaObj.ordem : index + 1000,
          };
        });
    }

    return mapped;
  }, [escolaId]);

  // Mostrar header imediatamente ao mudar, buscar legenda em background
  useEffect(() => {
    if (hasContent(headerUrl)) {
      const headerId = `header-${escolaId || 'temp'}`;
      const headerItem = {
        id: headerId,
        url: headerUrl,
        titulo: null,
        descricao: null,
        autor: null,
        dataFoto: null,
        origem: 'capa',
      };

      setItems(prev => {
        const exists = prev.some(i => i.origem === 'capa' && i.url === headerUrl);
        if (exists) return prev;
        const withoutHeader = prev.filter(i => i.origem !== 'capa');
        return [headerItem, ...withoutHeader];
      });

      if (escolaId) {
        (async () => {
          try {
            const headerLegend = await getLegendaByImageUrlFlexivel(headerUrl, escolaId);
            if (headerLegend) {
              setItems(prev => prev.map(item =>
                item.id === headerId ? {
                  ...item,
                  titulo: hasContent(headerLegend.legenda) ? headerLegend.legenda.trim() : null,
                  descricao: hasContent(headerLegend.descricao_detalhada) ? headerLegend.descricao_detalhada.trim() : null,
                  autor: hasContent(headerLegend.autor_foto) ? headerLegend.autor_foto.trim() : null,
                  dataFoto: headerLegend.data_foto || null,
                } : item
              ));
            }
          } catch (e) {
            logger.warn('Erro ao buscar legenda para header (async):', e);
          }
        })();
      }
    }
  }, [headerUrl, escolaId]);

  // Carregar todas as imagens
  useEffect(() => {
    let mounted = true;
    if (!escolaId) {
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

        if (hasContent(headerUrl)) {
          const normalizedHeaderUrl = getLocalImageUrl(headerUrl);
          combined = combined.filter(i => {
            const normalizedItemUrl = getLocalImageUrl(i.url);
            return normalizedItemUrl !== normalizedHeaderUrl && i.url !== headerUrl;
          });

          let headerLegend = null;
          try {
            headerLegend = await getLegendaByImageUrlFlexivel(headerUrl, escolaId);
          } catch (err) {
            logger.warn('Erro ao buscar legenda para header:', err);
          }

          combined = [{
            id: `header-${escolaId}`,
            url: headerUrl,
            titulo: hasContent(headerLegend?.legenda) ? headerLegend.legenda.trim() : null,
            descricao: hasContent(headerLegend?.descricao_detalhada) ? headerLegend.descricao_detalhada.trim() : null,
            autor: hasContent(headerLegend?.autor_foto) ? headerLegend.autor_foto.trim() : null,
            dataFoto: headerLegend?.data_foto || null,
            origem: 'capa',
          }, ...combined];
        }

        if (!mounted) return;
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

  const isTallImage = useMemo(() => {
    if (!currentItem || !currentItem.url) return false;
    const aspectRatio = imageAspectRatios.get(currentItem.url);
    return aspectRatio !== undefined && aspectRatio < 1;
  }, [currentItem, imageAspectRatios]);

  const handleImageLoad = useCallback((e) => {
    if (!currentItem || !currentItem.url) return;
    const img = e.target || e.currentTarget;
    if (img && img.naturalWidth && img.naturalHeight) {
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      setImageAspectRatios(prev => new Map(prev).set(currentItem.url, aspectRatio));
    }
  }, [currentItem]);

  // Notificar pai quando item atual mudar
  useEffect(() => {
    if (onCurrentItemChange && currentItem) {
      onCurrentItemChange(currentItem);
    }
  }, [currentItem, onCurrentItemChange]);

  // Sincronizar com scroll
  useEffect(() => {
    if (!hasItems || typeof scrollProgress !== 'number') return;
    if (Date.now() < manualOverrideUntil) return;
    const idx = Math.floor(scrollProgress * Math.max(0, items.length - 1));
    if (Number.isFinite(idx) && idx !== current) {
      setCurrent(idx);
    }
  }, [scrollProgress, hasItems, items.length, current, manualOverrideUntil]);

  const prev = useCallback(() => {
    if (!hasItems) return;
    setCurrent(idx => (idx > 0 ? idx - 1 : items.length - 1));
    setManualOverrideUntil(Date.now() + 1200);
  }, [hasItems, items.length]);

  const next = useCallback(() => {
    if (!hasItems) return;
    setCurrent(idx => (idx < items.length - 1 ? idx + 1 : 0));
    setManualOverrideUntil(Date.now() + 1200);
  }, [hasItems, items.length]);

  return {
    items,
    current,
    loading,
    error,
    hasItems,
    currentItem,
    isTallImage,
    handleImageLoad,
    isImagePreloaded,
    prev,
    next,
  };
};

export default useSidebarImages;
