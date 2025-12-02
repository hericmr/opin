import { supabase } from '../../../../dbClient';

/**
 * Helper function to normalize image URL for Vite compatibility
 * Ensures URLs are properly formatted for use in img src attributes
 * @param {string} url - Image URL (can be full URL or relative path)
 * @returns {string} Normalized URL
 */
export const normalizeImageUrl = (url) => {
  if (!url) return '';
  
  // If it's already a full URL (http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path, prepend BASE_URL
  const baseUrl = import.meta.env.BASE_URL || '/opin/';
  // Remove trailing slash from baseUrl if present, and ensure url starts with /
  const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl.replace(/\/$/, '')}${normalizedUrl}`;
};

/**
 * Helper function to get valid image URL
 * Handles both publicURL (uppercase) and publicUrl (lowercase) for compatibility
 * @param {Object} image - Image object
 * @param {string} bucketName - Supabase storage bucket name
 * @returns {string} Valid public URL or empty string
 */
export const getImageUrl = (image, bucketName = 'imagens-das-escolas') => {
  // Use publicURL (uppercase) first, exactly like information panel does
  let url = image.publicURL || image.publicUrl;
  
  // If not available, construct it from the file path (same as info panel)
  if (!url && image.url) {
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(image.url);
    url = publicUrl;
  }
  
  if (!url) {
    console.warn('Image missing URL:', image);
    return '';
  }
  
  // Normalize URL for Vite compatibility (handles both full URLs and relative paths)
  return normalizeImageUrl(url);
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





