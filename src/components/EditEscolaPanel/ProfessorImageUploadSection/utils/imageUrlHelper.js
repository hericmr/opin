import { supabase } from '../../../../dbClient';

/**
 * Helper function to get valid image URL
 * Handles both publicURL (uppercase) and publicUrl (lowercase) for compatibility
 * @param {Object} image - Image object
 * @param {string} bucketName - Supabase storage bucket name
 * @returns {string} Valid public URL or empty string
 */
export const getImageUrl = (image, bucketName = 'imagens-das-escolas') => {
  // Use publicURL (uppercase) first, exactly like information panel does
  if (image.publicURL) {
    return image.publicURL;
  }
  
  // Fallback to lowercase for compatibility
  if (image.publicUrl) {
    return image.publicUrl;
  }
  
  // If not available, construct it from the file path (same as info panel)
  if (image.url) {
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(image.url);
    return publicUrl;
  }
  
  console.warn('Image missing URL:', image);
  return '';
};

/**
 * Normalize image object to ensure publicURL is always present
 * @param {Object} image - Image object
 * @param {string} bucketName - Supabase storage bucket name
 * @returns {Object} Normalized image object
 */
export const normalizeImage = (image, bucketName = 'imagens-das-escolas') => {
  const publicURL = getImageUrl(image, bucketName);
  
  return {
    ...image,
    publicURL,
    publicUrl: publicURL, // Ensure both formats exist
  };
};

