
// Mock import.meta.env BEFORE importing the module
// (This is tricky in ESM, so I will just simulate the logic)

const imageMap = {
    "https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/1/1_1763557482462_1diooc.jpeg": "/images/local/1_1763557482462_1diooc_808ac0a4.webp"
};

const BASE_URL = '/opin/';
const VITE_SUPABASE_URL = 'https://test.supabase.co';

const getLocalImageUrl = (url) => {
    if (imageMap[url]) {
        const localPath = imageMap[url];
        const cleanBase = BASE_URL.replace(/\/$/, '');
        return `${cleanBase}${localPath}`;
    }
    return url;
};

const getSupabaseStorageUrl = (bucket, path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = VITE_SUPABASE_URL.replace(/\/$/, '');
    return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
};

const getSecureImageUrl = (url) => {
    if (!url) return '';
    const mapped = getLocalImageUrl(url);
    if (mapped !== url) return mapped;
    const cleanBase = BASE_URL.replace(/\/$/, '');
    if (cleanBase && url.startsWith(`${cleanBase}${cleanBase}/`)) {
        return url.replace(`${cleanBase}${cleanBase}/`, `${cleanBase}/`);
    }
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) {
        if (cleanBase && !url.startsWith(cleanBase)) return `${cleanBase}${url}`;
        return url;
    }
    return `${cleanBase}/${url}`;
};

const tests = [
    { name: 'Local Mapped URL', input: 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/1/1_1763557482462_1diooc.jpeg' },
    { name: 'New Supabase URL', input: 'https://test.supabase.co/storage/v1/object/public/imagens-das-escolas/new.jpg' },
    { name: 'Relative Storage Path', input: '4/image.jpg', bucket: 'imagens-das-escolas' },
    { name: 'Double Prefixed Path', input: '/opin/opin/storage/v1/object/public/imagens-das-escolas/1/1.jpg' },
    { name: 'Already Correct Local Path', input: '/opin/images/local/test.webp' }
];

console.log('--- Verification Tests ---');

tests.forEach(test => {
    let input = test.input;
    if (test.bucket) {
        input = getSupabaseStorageUrl(test.bucket, test.input);
    }
    const output = getSecureImageUrl(input);
    console.log(`${test.name}:`);
    console.log(`  Input:  ${input}`);
    console.log(`  Output: ${output}`);
    console.log('');
});
