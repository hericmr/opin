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
    if (!url) return url;

    const buildLocalPath = (localPath) => {
        const baseUrl = import.meta.env.BASE_URL || '/';
        const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBase}${localPath}`;
    };

    // Direct match
    if (imageMap[url]) return buildLocalPath(imageMap[url]);

    // Handle storage URL pattern: /data/storage/opin/[bucket/]school_id/file
    // The image_map keys use relative paths like "1/image.jpeg"
    const storagePrefix = '/data/storage/opin/';
    if (url.startsWith(storagePrefix)) {
        const afterPrefix = url.slice(storagePrefix.length);
        // Try direct match (no bucket subdir in path)
        if (imageMap[afterPrefix]) return buildLocalPath(imageMap[afterPrefix]);
        // Try stripping the first path component (bucket name)
        const slashIdx = afterPrefix.indexOf('/');
        if (slashIdx !== -1) {
            const withoutBucket = afterPrefix.slice(slashIdx + 1);
            if (imageMap[withoutBucket]) return buildLocalPath(imageMap[withoutBucket]);
        }
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

export const getStorageUrl = (bucket, path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `/data/storage/opin/${cleanPath}`;
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

    // 1. Try imageMap resolution first (handles full Supabase cloud URLs and relative paths)
    const mapped = getLocalImageUrl(url);
    if (mapped !== url) return mapped;

    // 2. Old Supabase cloud URL not in imageMap — redirect to local storage
    if (url.startsWith('http')) {
        const bucketPathMatch = url.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
        if (bucketPathMatch) return `/data/storage/opin/${bucketPathMatch[1]}`;
        return url;
    }

    // 3. Already a local absolute path
    if (url.startsWith('/')) return url;

    // 4. Raw relative path (escola_id/filename) — serve from local storage
    return `/data/storage/opin/${url}`;
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

