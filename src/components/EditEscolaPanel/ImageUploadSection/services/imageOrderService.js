import { supabase } from '../../../../dbClient';
import { updateMultipleImageOrders } from '../../../../services/legendasService';

/**
 * Service for managing image order
 */

/**
 * Load order from database and apply to images
 * @param {Array<Object>} images - Array of image objects
 * @param {string|number} escolaId - School ID
 * @param {string} tipoFoto - Photo type ('escola' or 'professor')
 * @returns {Promise<Array<Object>>} Ordered images
 */
export const loadImageOrder = async (images, escolaId, tipoFoto = 'escola') => {
  if (!escolaId || !images || images.length === 0) {
    return images;
  }
  
  try {
    // Fetch all legends for the school to get order
    const { data: legendas, error } = await supabase
      .from('legendas_fotos')
      .select('imagem_url, ordem')
      .eq('escola_id', escolaId)
      .eq('tipo_foto', tipoFoto)
      .eq('ativo', true);
    
    if (error) {
      console.warn('Erro ao buscar ordem das imagens:', error);
      return images;
    }
    
    if (!legendas || legendas.length === 0) {
      return images;
    }
    
    // Create a map of URLs to order
    const orderMap = new Map();
    legendas.forEach(legenda => {
      if (legenda.ordem !== null && legenda.ordem !== undefined) {
        orderMap.set(legenda.imagem_url, legenda.ordem);
      }
    });
    
    // Sort images based on database order - PRESERVE ALL PROPERTIES INCLUDING publicURL
    const sortedImages = images.map(img => {
      // Explicitly preserve publicURL and publicUrl
      return {
        ...img,
        publicURL: img.publicURL || img.publicUrl, // Ensure uppercase version exists
        publicUrl: img.publicURL || img.publicUrl, // Ensure lowercase version exists
      };
    }).sort((a, b) => {
      const orderA = orderMap.get(a.url) ?? Infinity;
      const orderB = orderMap.get(b.url) ?? Infinity;
      return orderA - orderB;
    });
    
    // Verify if publicURL was preserved (React 19 compatibility)
    const missingUrls = sortedImages.filter(img => !img.publicURL && !img.publicUrl);
    if (missingUrls.length > 0) {
      console.warn('[imageOrderService] ⚠️ publicURL perdido após ordenação:', missingUrls.length, 'imagens');
      // Recreate publicURL if it was lost
      missingUrls.forEach(img => {
        if (img.url) {
          const bucketName = img.url.includes('professores') ? 'imagens-professores' : 'imagens-das-escolas';
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(img.url);
          img.publicURL = publicUrl;
          img.publicUrl = publicUrl;
        }
      });
    }
    
    return sortedImages;
  } catch (err) {
    console.warn('Erro ao carregar ordem das imagens:', err);
    return images;
  }
};

/**
 * Save image order to database
 * @param {Array<Object>} images - Array of image objects
 * @param {string|number} escolaId - School ID
 * @returns {Promise<void>}
 */
export const saveImageOrder = async (images, escolaId) => {
  if (!escolaId || !images || images.length === 0) {
    return;
  }
  
  try {
    // Prepare array of orders
    const imageOrders = images.map((img, index) => ({
      imageUrl: img.url,
      ordem: index + 1
    }));
    
    // Update orders in database
    await updateMultipleImageOrders(imageOrders, escolaId);
  } catch (err) {
    console.error('Erro ao salvar ordem das imagens no banco:', err);
    throw new Error('Erro ao salvar ordem das imagens. Tente novamente.');
  }
};

