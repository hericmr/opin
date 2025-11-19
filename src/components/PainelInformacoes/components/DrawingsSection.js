import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { DrawingsImageService } from '../../../services/drawingsImageService';
import { getLegendaByImageUrlFlexivel } from '../../../services/legendasService';
import OptimizedImage from '../../shared/OptimizedImage';
import useImagePreloader from '../../../hooks/useImagePreloader';
import ReusableImageZoom from '../../ReusableImageZoom';
import '../../ReusableImageZoom.css';

// Helper function to check if a value has actual content
const hasContent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

/**
 * Component to display drawings section
 * Shows images in large format similar to YouTube video player (16:9 aspect ratio)
 * Displays the legend/caption of each drawing instead of a fixed title
 */
const DrawingsSection = ({ escolaId, refreshKey = 0 }) => {
  const [drawingsData, setDrawingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagemZoom, setImagemZoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isImagePreloaded } = useImagePreloader(escolaId, true);

  const fecharZoom = useCallback(() => {
    setImagemZoom(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    if (!escolaId) {
      setLoading(false);
      return;
    }

    const fetchDrawings = async () => {
      try {
        setLoading(true);
        const urls = await DrawingsImageService.getDrawingsImages(escolaId);
        
        // Buscar legendas para cada imagem
        const drawingsWithLegends = await Promise.all(
          urls.map(async (imageUrl) => {
            // Extrair o caminho do arquivo da URL completa
            // Exemplo: https://xxx.supabase.co/storage/v1/object/public/imagens-das-escolas/123/image.jpg
            // Precisamos extrair: 123/image.jpg
            let filePath = imageUrl;
            try {
              const urlObj = new URL(imageUrl);
              const pathParts = urlObj.pathname.split('/');
              const bucketIndex = pathParts.findIndex(part => part === 'imagens-das-escolas');
              if (bucketIndex !== -1 && pathParts[bucketIndex + 1]) {
                // Pegar tudo após o bucket name
                filePath = pathParts.slice(bucketIndex + 1).join('/');
              }
            } catch (e) {
              // Se não conseguir fazer parse, usar a URL completa
              console.warn('Não foi possível extrair caminho da URL:', imageUrl);
            }

            // Buscar legenda
            let legenda = null;
            try {
              legenda = await getLegendaByImageUrlFlexivel(filePath, escolaId, {
                categoria: 'escola',
                tipo_foto: 'escola'
              });
            } catch (error) {
              console.warn('Erro ao buscar legenda para:', filePath, error);
            }

            return {
              url: imageUrl,
              filePath: filePath,
              legenda: hasContent(legenda?.legenda) ? legenda.legenda.trim() : null,
              descricaoDetalhada: hasContent(legenda?.descricao_detalhada) ? legenda.descricao_detalhada.trim() : null,
            };
          })
        );

        setDrawingsData(drawingsWithLegends);
      } catch (error) {
        console.error('Erro ao buscar imagens de desenhos:', error);
        setDrawingsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDrawings();
  }, [escolaId, refreshKey]);

  if (loading) {
    return (
      <div className="text-gray-500 flex items-center gap-2">
        Carregando desenhos...
      </div>
    );
  }

  if (!drawingsData || drawingsData.length === 0) {
    return null;
  }

  // Preparar imagens para o ReusableImageZoom
  const imagesForZoom = drawingsData.map(drawing => ({
    url: drawing.url,
    publicURL: drawing.url,
    descricao: drawing.legenda || null,
    descricao_imagem: drawing.legenda || null,
    descricaoDetalhada: drawing.descricaoDetalhada || null,
  }));

  return (
    <section className="mt-8">
      <div className="space-y-8">
        {drawingsData.map((drawing, index) => (
          <div key={index}>
            {/* Large format display similar to YouTube video player (16:9 aspect ratio) */}
            <div 
              className="relative pb-[56.25%] h-0 bg-gray-100 cursor-pointer"
              onClick={() => {
                if (drawing.url) {
                  setCurrentImageIndex(index);
                  setImagemZoom(drawing);
                  document.body.style.overflow = 'hidden';
                }
              }}
            >
              <OptimizedImage
                src={drawing.url}
                alt={drawing.legenda || `Desenho ${index + 1}`}
                className="absolute top-0 left-0 w-full h-full object-contain"
                isPreloaded={isImagePreloaded(drawing.url)}
                style={{ 
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectPosition: 'center center'
                }}
              />
            </div>
            
            {/* Legenda do desenho - minimalista e inline - só mostra se tiver conteúdo real */}
            {hasContent(drawing.legenda) && (
              <div className="px-4 pt-2 pb-3">
                <p className="text-sm text-black font-normal leading-relaxed">
                  {drawing.legenda}
                </p>
                {hasContent(drawing.descricaoDetalhada) && (
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {drawing.descricaoDetalhada}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Zoom Reutilizável */}
      <ReusableImageZoom
        images={imagesForZoom}
        currentImageIndex={currentImageIndex}
        isOpen={!!imagemZoom}
        onClose={fecharZoom}
        onImageChange={setCurrentImageIndex}
        showNavigation={drawingsData.length > 1}
        showControls={true}
        showCounter={drawingsData.length > 1}
        showCaption={true}
      />
    </section>
  );
};

DrawingsSection.propTypes = {
  escolaId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshKey: PropTypes.number,
};

export default React.memo(DrawingsSection);

