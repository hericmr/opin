import { useState, useCallback } from 'react';
import { 
  getLegendaByImageUrl, 
  addLegendaFoto, 
  updateLegendaFoto 
} from '../../../../services/legendasService';

/**
 * Hook for managing image legends
 * @param {string|number} escolaId - School ID
 * @param {string} tipoFoto - Photo type ('escola' or 'professor')
 * @returns {Object} Legend management functions
 */
export const useImageLegends = (escolaId, tipoFoto = 'escola') => {
  const [loading, setLoading] = useState(false);

  const fetchLegends = useCallback(async (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0 || !escolaId) {
      return new Map();
    }

    setLoading(true);
    const legendsMap = new Map();

    try {
      for (const imageUrl of imageUrls) {
        const legenda = await getLegendaByImageUrl(imageUrl, escolaId, { tipo_foto: tipoFoto });
        if (legenda) {
          legendsMap.set(imageUrl, legenda);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar legendas:', error);
    } finally {
      setLoading(false);
    }

    return legendsMap;
  }, [escolaId, tipoFoto]);

  const saveLegend = useCallback(async (imageUrl, legendData) => {
    if (!escolaId || !imageUrl) {
      throw new Error('ID da escola ou URL da imagem não encontrado');
    }

    // Validate and clean legend data
    const allowedFields = ['legenda', 'descricao_detalhada', 'autor_foto', 'data_foto', 'categoria'];
    const cleanLegendaData = {};
    
    allowedFields.forEach(field => {
      const value = legendData?.[field];
      if (value !== undefined && value !== null && value !== '') {
        // Special handling for data_foto
        if (field === 'data_foto') {
          try {
            const data = new Date(value);
            if (!isNaN(data.getTime())) {
              cleanLegendaData[field] = data.toISOString().split('T')[0];
            }
          } catch (e) {
            // Ignore if not a valid date
          }
        } else {
          const trimmedValue = String(value).trim();
          if (trimmedValue !== '') {
            cleanLegendaData[field] = trimmedValue;
          }
        }
      }
    });

    try {
      let legenda = await getLegendaByImageUrl(imageUrl, escolaId, { tipo_foto: tipoFoto });
      
      if (legenda) {
        await updateLegendaFoto(legenda.id, {
          ...cleanLegendaData,
          updated_at: new Date().toISOString()
        });
      } else {
        await addLegendaFoto({
          escola_id: escolaId,
          imagem_url: imageUrl,
          ...cleanLegendaData,
          ativo: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tipo_foto: tipoFoto
        });
      }
    } catch (err) {
      console.error('Erro ao salvar legenda:', err);
      throw err;
    }
  }, [escolaId, tipoFoto]);

  return {
    loading,
    fetchLegends,
    saveLegend,
  };
};

