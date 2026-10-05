const STORAGE_PREFIX = '/data/storage/opin/';

const buildLocalPath = (localPath) => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${localPath}`;
};

/**
 * Resolve an image URL to a local path with .webp extension
 */
export const getLocalImageUrl = (url, bucket = 'imagens-das-escolas') => {
    if (!url) return url;

    // 1. Convert Supabase Storage URL directly to local storage path (.webp)
    if (url.startsWith('http') && url.includes('/storage/v1/object/public/')) {
        const bucketPathMatch = url.match(/\/storage\/v1\/object\/public\/(.+)$/);
        if (bucketPathMatch) {
            let path = bucketPathMatch[1];
            
            return buildLocalPath(`${STORAGE_PREFIX}${path}`);
        }
    }

    // 2. Handle storage URL pattern prefix
    if (url.startsWith(STORAGE_PREFIX)) {
        let afterPrefix = url.slice(STORAGE_PREFIX.length);
        
        return buildLocalPath(`${STORAGE_PREFIX}${afterPrefix}`);
    }

    // Handle data: and blob: URLs directly
    if (url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }

    // 3. Simple relative paths (e.g. 11/file.jpg) that likely belong to storage
    if (!url.startsWith('http') && !url.startsWith('/')) {
        let path = url;
        if (!path.startsWith('imagens-das-escolas/') && 
            !path.startsWith('imagens-professores/') &&
            !path.startsWith('avatar/')) {
            path = `${bucket}/${path}`;
        }
        return buildLocalPath(`${STORAGE_PREFIX}${path}`);
    }

    return url;
};

/**
 * Check if an image should be served locally
 */
export const isLocalImage = (url) => {
    if (!url) return false;
    if (url.startsWith('http') && url.includes('/storage/v1/object/public/')) return true;
    if (url.startsWith(STORAGE_PREFIX)) return true;
    if (!url.startsWith('http') && !url.startsWith('/')) return true;
    return false;
};

/**
 * Resolve path to storage URL.
 */
export const getStorageUrl = (path, bucket = 'imagens-das-escolas') => {
    if (!path) return '';
    if (path.startsWith('http')) return getLocalImageUrl(path, bucket);
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const withWebp = cleanPath;
    
    if (withWebp.startsWith('imagens-das-escolas/') || 
        withWebp.startsWith('imagens-professores/') ||
        withWebp.startsWith('avatar/')) {
        return `${STORAGE_PREFIX}${withWebp}`;
    }
    
    return `${STORAGE_PREFIX}${bucket}/${withWebp}`;
};

/**
 * Resolve an image URL robustly.
 */
export const getSecureImageUrl = (url, bucket = 'imagens-das-escolas') => {
    return getLocalImageUrl(url, bucket);
};

