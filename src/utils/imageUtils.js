import imageMap from '../data/image_map.json';

const STORAGE_PREFIX = '/data/storage/opin/';

/**
 * Resolve an image URL to a local path if it exists in the map.
 * Checks against full URL and relative path.
 * @param {string} url - The original URL (or relative path)
 * @returns {string} The local path or the original URL
 */
export const getLocalImageUrl = (url) => {
    if (!url) return url;

    const buildLocalPath = (localPath) => {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBase}${localPath}`;
    };

    const checkMap = (key) => {
        if (imageMap[key]) return buildLocalPath(imageMap[key]);
        // Tenta alternativas de extensão caso o banco tenha salvo como .webp mas o mapa tenha .jpg/.jpeg/.png
        if (key.match(/\.(webp|jpg|jpeg|png)$/i)) {
            const base = key.replace(/\.(webp|jpg|jpeg|png)$/i, '');
            if (imageMap[`${base}.jpg`]) return buildLocalPath(imageMap[`${base}.jpg`]);
            if (imageMap[`${base}.jpeg`]) return buildLocalPath(imageMap[`${base}.jpeg`]);
            if (imageMap[`${base}.png`]) return buildLocalPath(imageMap[`${base}.png`]);
            if (imageMap[`${base}.webp`]) return buildLocalPath(imageMap[`${base}.webp`]);
        }
        return null;
    };

    // Direct match with extension fallback
    const directMatch = checkMap(url);
    if (directMatch) return directMatch;

    // Handle storage URL pattern: /data/storage/opin/school_id/file
    if (url.startsWith(STORAGE_PREFIX)) {
        const afterPrefix = url.slice(STORAGE_PREFIX.length);
        const prefixMatch = checkMap(afterPrefix);
        if (prefixMatch) return prefixMatch;
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
 * Resolve o caminho de um arquivo de storage para a URL local.
 * Arquivos ficam em data/storage/opin/{escola_id}/arquivo, servidos
 * como estático pelo nginx (prod) ou Vite (dev via symlink public/data/storage).
 * @param {string} path - Caminho relativo (ex: "11/foto.webp") ou URL completa
 * @returns {string} URL absoluta local
 */
export const getStorageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${STORAGE_PREFIX}${cleanPath}`;
};

/**
 * Resolve an image URL robustly. Handles:
 * 1. Local image mapping (high priority).
 * 2. Old Supabase cloud URLs (redirected to local storage).
 * 3. Raw relative storage paths (escola_id/filename).
 * @param {string} url - The URL or path to resolve
 * @returns {string} The resolved URL
 */
export const getSecureImageUrl = (url) => {
    if (!url) return '';

    // 1. Try imageMap resolution first (handles full Supabase cloud URLs and relative paths)
    const mapped = getLocalImageUrl(url);
    if (mapped !== url) return mapped;

    // 2. Old Supabase cloud URL not in imageMap — redirect to local storage
    if (url.startsWith('http')) {
        const bucketPathMatch = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
        if (bucketPathMatch) return `${STORAGE_PREFIX}${bucketPathMatch[1]}`;
        return url;
    }

    // 3. Already a local absolute path
    if (url.startsWith('/')) return url;

    // 4. Raw relative path (escola_id/filename) — serve from local storage
    return `${STORAGE_PREFIX}${url}`;
};

