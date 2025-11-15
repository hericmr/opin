import { supabase } from '../../../../supabaseClient';

/**
 * Transform file list from Supabase storage to image objects
 * @param {Array} files - Files from Supabase storage
 * @param {string} escolaId - School ID
 * @param {string} bucketName - Storage bucket name
 * @returns {Array<Object>} Array of image objects
 */
export const transformFilesToImages = (files, escolaId, bucketName) => {
  if (!files || files.length === 0) {
    return [];
  }

  return files.map((file) => {
    const filePath = `${escolaId}/${file.name}`;
    
    // Use getPublicUrl - same as information panel
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log(`[transformFilesToImages] File: ${file.name}`, {
      filePath,
      publicUrl,
      fileProperties: Object.keys(file),
      hasMetadata: !!file.metadata
    });

    return {
      id: `${escolaId}-${file.name}`,
      url: filePath,
      publicURL: publicUrl, // Use uppercase like information panel
      publicUrl: publicUrl, // Also include lowercase for compatibility
      filePath: filePath,
      descricao: `Imagem`,
      created_at: file.created_at || new Date().toISOString()
    };
  });
};

/**
 * Merge legend data into image objects
 * @param {Array<Object>} images - Array of image objects
 * @param {Map<string, Object>} legendsMap - Map of imageUrl -> legend data
 * @returns {Array<Object>} Images with merged legend data
 */
export const mergeLegendsIntoImages = (images, legendsMap) => {
  return images.map(img => {
    const legenda = legendsMap.get(img.url);
    
    // If already has legendaData and no new legenda, keep as is
    if (!legenda && img.legendaData) {
      return img;
    }
    
    // Extract fields from legend
    const legendaData = legenda ? {
      legenda: legenda.legenda || '',
      descricao_detalhada: legenda.descricao_detalhada || '',
      autor_foto: legenda.autor_foto || '',
      data_foto: legenda.data_foto || '',
      categoria: legenda.categoria || 'geral',
    } : (img.legendaData || {
      legenda: '',
      descricao_detalhada: '',
      autor_foto: '',
      data_foto: '',
      categoria: 'geral',
    });
    
    // Preserve all properties using spread - CRITICAL: preserve publicURL
    return {
      ...img,
      publicURL: img.publicURL, // Explicitly preserve publicURL
      publicUrl: img.publicURL || img.publicUrl, // Also preserve lowercase version
      legendaData,
    };
  });
};

