const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');
const crypto = require('crypto');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../public/images/local');
const DATA_DIR = path.join(__dirname, '../data/database/tables');
const MAP_FILE = path.join(__dirname, '../src/data/image_map.json');
const SRC_DATA_DIR = path.dirname(MAP_FILE);

// Constants
const SUPABASE_PROFESSORS_BASE = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-professores/';
const SUPABASE_ESCOLAS_BASE = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/';
const SUPABASE_AVATAR_BASE = 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/avatar/';

// ...

// Function to download image
const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(OUTPUT_DIR, filename);
        if (fs.existsSync(filepath)) {
            // console.log(`Skipping existing: ${filename}`);
            resolve(filepath);
            return;
        }

        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(() => {
                        console.log(`Downloaded: ${filename}`);
                        resolve(filepath);
                    });
                });
            } else {
                file.close();
                fs.unlink(filepath, () => { }); // Delete partial file
                // console.error(`Failed to download ${url}: Status ${response.statusCode}`);
                resolve(null);
            }
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            console.error(`Error downloading ${url}: ${err.message}`);
            resolve(null);
        });
    });
};

const extractUrls = (content, filename) => {
    const urls = [];

    // Standard full URLs
    const urlRegex = /'(https?:\/\/[^']+?\.(?:jpg|jpeg|png|webp|gif|svg))'/gi;
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
        urls.push(match[1]);
    }

    // Special handling for rows with relative paths
    if (filename === 'imagens_professores_rows.sql') {
        const relativeRegex = /'(\d+\/[^']+\.(?:jpg|jpeg|png))'/gi;
        while ((match = relativeRegex.exec(content)) !== null) {
            urls.push(SUPABASE_PROFESSORS_BASE + match[1]);
        }
    }

    // Handle legendas_fotos_rows (can be Escola or Professor or Avatar)
    if (filename === 'legendas_fotos_rows.sql') {
        const relativeRegex = /'(\d+\/[^']+\.(?:jpg|jpeg|png))'/gi;
        while ((match = relativeRegex.exec(content)) !== null) {
            // We don't know for sure which bucket, so we add candidates.
            // The download function needs to handle 404s gracefully without stopping.
            // We will optimistically add both potential base URLs.
            // When processing, we only map the one that successfully downloads.
            urls.push(SUPABASE_ESCOLAS_BASE + match[1]);
            urls.push(SUPABASE_PROFESSORS_BASE + match[1]);
            urls.push(SUPABASE_AVATAR_BASE + match[1]);
        }
    }

    return [...new Set(urls)];
};

const processFiles = async () => {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.sql'));

    let allUrls = [];

    for (const file of files) {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf8');
        const urls = extractUrls(content, file);
        if (urls.length > 0) {
            console.log(`Found ${urls.length} images in ${file}`);
            allUrls = allUrls.concat(urls);
        }
    }

    allUrls = [...new Set(allUrls)]; // Global unique URLs
    console.log(`Total unique images to download: ${allUrls.length}`);

    const urlMap = {};
    // Load existing map if available
    /*if (fs.existsSync(MAP_FILE)) {
        Object.assign(urlMap, JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')));
    }*/

    for (const url of allUrls) {
        const urlObj = new URL(url);
        const ext = path.extname(urlObj.pathname) || '.jpg';
        const basename = path.basename(urlObj.pathname, ext);
        const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
        const filename = `${basename}_${hash}${ext}`;

        // Try to download
        const result = await downloadImage(url, filename);

        if (result) {
            // Only map if download was successful (or existed)
            urlMap[url] = `/images/local/${filename}`;

            // Handle relative mapping if it matches known patterns
            if (url.startsWith(SUPABASE_PROFESSORS_BASE)) {
                const relative = url.replace(SUPABASE_PROFESSORS_BASE, '');
                urlMap[relative] = `/images/local/${filename}`;
            }
            if (url.startsWith(SUPABASE_ESCOLAS_BASE)) {
                const relative = url.replace(SUPABASE_ESCOLAS_BASE, '');
                urlMap[relative] = `/images/local/${filename}`;
            }
            if (url.startsWith(SUPABASE_AVATAR_BASE)) {
                const relative = url.replace(SUPABASE_AVATAR_BASE, '');
                urlMap[relative] = `/images/local/${filename}`;
            }
        }
    }

    // Post-processing: Ensure ensure alternate bucket URLs are mapped for relative paths
    // This fixes the issue where an image exists in one bucket (e.g. professores) but the frontend
    // constructs the URL assuming another bucket (e.g. escolas) for the same relative path.
    for (const [key, value] of Object.entries(urlMap)) {
        if (!key.startsWith('http')) {
            // It's a relative path (e.g. "20/foto.png"). 
            // Add full URLs for both/all buckets pointing to the same local file.
            const escolasUrl = SUPABASE_ESCOLAS_BASE + key;
            const profUrl = SUPABASE_PROFESSORS_BASE + key;
            const avatarUrl = SUPABASE_AVATAR_BASE + key;

            if (!urlMap[escolasUrl]) urlMap[escolasUrl] = value;
            if (!urlMap[profUrl]) urlMap[profUrl] = value;
            if (!urlMap[avatarUrl]) urlMap[avatarUrl] = value;
        }
    }

    fs.writeFileSync(MAP_FILE, JSON.stringify(urlMap, null, 2));
    console.log(`Mapping saved to ${MAP_FILE}`);
};

processFiles().catch(console.error);
