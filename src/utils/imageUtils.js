import imageMap from '../data/image_map.json';

// Cache de imagens que falharam para não tentar sempre
const failedImageCache = new Set();

/**
 * Resolve an image URL to a local path if it exists in the map.
 * Checks against full URL and relative path.
 * @param {string} url - The original URL (or relative path)
 * @returns {string} The local path or the original URL
 */
export const getLocalImageUrl = (url) => {
    // Direct match
    if (imageMap[url]) {
        const localPath = imageMap[url];
        // Prepend BASE_URL if configured (handles /opin/ prefix)
        const baseUrl = import.meta.env.BASE_URL || '/';
        // Remove trailing slash from base if present and leading slash from path
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

        return `${cleanBase}${localPath}`;
    }

    return url;
};

/**
 * Check if an image should be served locally
 * @param {string} url 
 * @returns {boolean}
 */
export const isLocalImage = (url) => {
    return !!imageMap[url];
};

/**
 * Build a fallback Supabase storage URL for a relative path.
 * Uses the environment variable VITE_SUPABASE_URL.
 * @param {string} bucket - The storage bucket name
 * @param {string} path - The internal path (e.g. "4/image.jpg")
 * @returns {string} The full Supabase URL
 */
export const getSupabaseStorageUrl = (bucket, path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const baseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
    
    // Se estivermos em ambiente local (/opin), usamos o caminho estático direto
    // que agora é servido pelo Nginx em /opin/data/storage/opin/
    if (baseUrl === '/opin') {
        // Garantir que não há barra dupla
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        return `${baseUrl}/data/storage/opin/${bucket}/${cleanPath}`;
    }

    // Fallback para Supabase Cloud ou outro baseUrl configurado
    const finalBaseUrl = baseUrl || 'https://cbzwrxmcuhsxehdrsrvi.supabase.co';
    
    return `${finalBaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};


/**
 * Registra que uma imagem falhou ao carregar
 * @param {string} url - URL da imagem que falhou
 */
export const markImageAsFailed = (url) => {
    failedImageCache.add(url);
};

/**
 * Verifica se uma imagem já foi marcada como falhada
 * @param {string} url - URL da imagem
 * @returns {boolean}
 */
export const isImageFailed = (url) => {
    return failedImageCache.has(url);
};

/**
 * Resolve an image URL robustly. Handles:
 * 1. Local image mapping (high priority).
 * 2. Fixing double base URLs (e.g. /opin/opin/...).
 * 3. Prepending BASE_URL for relative paths.
 * 4. Fallback para imagens que falharam.
 * @param {string} url - The URL or path to resolve
 * @returns {string} The resolved URL
 */
export const getSecureImageUrl = (url) => {
    if (!url) return '';

    // 1. Try local resolution first
    const mapped = getLocalImageUrl(url);
    if (mapped !== url) return mapped;

    // 2. Identify and fix double base URLs (common with /opin prefix)
    const baseUrl = import.meta.env.BASE_URL || '/opin/';
    const cleanBase = baseUrl.replace(/\/$/, ''); // e.g. /opin
    
    if (cleanBase && url.startsWith(`${cleanBase}${cleanBase}/`)) {
        return url.replace(`${cleanBase}${cleanBase}/`, `${cleanBase}/`);
    }

    // 3. If it's already a full URL (http/https), return as is
    if (url.startsWith('http')) {
        // Roteia URLs hardcoded do Supabase direto pro container de Storage Local
        if (import.meta.env.VITE_SUPABASE_URL === '/opin' && url.includes('cbzwrxmcuhsxehdrsrvi.supabase.co')) {
            return url.replace('https://cbzwrxmcuhsxehdrsrvi.supabase.co', '/opin');
        }
        return url;
    }

    // 4. If it's a relative path starting with / (likely already local or starting with base)
    if (url.startsWith('/')) {
        // Ensure it has the baseUrl if it doesn't
        if (cleanBase && !url.startsWith(cleanBase)) {
            return `${cleanBase}${url}`;
        }
        return url;
    }

    // 5. If it's a raw storage path (no http, no leading slash), 
    // it's likely intended to be local relative to public dir or base path.
    return `${cleanBase}/${url}`;
};

/**
 * Hook para usar em componentes Image para fallback
 * Quando uma imagem falha, tenta encontrar uma alternativa
 * @param {string} url - URL original
 * @returns {string} URL da imagem fallback ou placeholder
 */
export const getImageFallback = (url) => {
    if (!url) return '';

    // Tentar usar um placeholder genérico
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    // Placeholder SVG inline para não depender de arquivo
    return `${cleanBase}/images/image-placeholder.svg`;
};

