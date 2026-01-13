import imageMap from '../data/image_map.json';

/**
 * Resolve an image URL to a local path if it exists in the map.
 * Checks against full URL and relative path.
 * @param {string} url - The original URL (or relative path)
 * @returns {string} The local path or the original URL
 */
export const getLocalImageUrl = (url) => {
    // Debug specific failing image
    if (url && (url.includes('abilio_fernandes') || url.includes('20/abilio_fernandes'))) {
        console.log('[ImageUtils] Looking up:', url);
        console.log('[ImageUtils] Direct match?', !!imageMap[url]);
        if (imageMap[url]) console.log('[ImageUtils] Mapped to:', imageMap[url]);
        else console.log('[ImageUtils] No map entry for this exact URL, keys available:', Object.keys(imageMap).filter(k => k.includes('abilio_fernandes')));
    }

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
