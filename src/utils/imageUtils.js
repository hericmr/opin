import imageMap from '../data/image_map.json';

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
    
    // Project ID cbzwrxmcuhsxehdrsrvi is the legacy hardcoded one.
    // We prefer using the environment variable, but keep it as a very late fallback.
    const finalBaseUrl = baseUrl || 'https://cbzwrxmcuhsxehdrsrvi.supabase.co';
    
    // If baseUrl is relative (/opin), ensure we don't double prepend when building storage URLs
    // but usually storage URLs are expected to be full URLs or handle proxying.
    return `${finalBaseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

/**
 * Resolve an image URL robustly. Handles:
 * 1. Local image mapping (high priority).
 * 2. Fixing double base URLs (e.g. /opin/opin/...).
 * 3. Prepending BASE_URL for relative paths.
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
