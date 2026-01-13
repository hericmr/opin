
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIRECTORIES = [
    {
        path: path.join(__dirname, '../public/images/local'),
        hasMap: true,
        mapPath: path.join(__dirname, '../src/data/image_map.json'),
        prefix: '/images/local/'
    },
    {
        path: path.join(__dirname, '../public/fotos'),
        hasMap: false
    }
];

const convertDirectory = async (dirConfig) => {
    const imagesDir = dirConfig.path;

    // Ensure directory exists
    if (!fs.existsSync(imagesDir)) {
        console.warn(`Directory not found: ${imagesDir}`);
        return;
    }

    console.log(`Processing directory: ${imagesDir}`);

    let imageMap = {};
    if (dirConfig.hasMap) {
        if (fs.existsSync(dirConfig.mapPath)) {
            imageMap = JSON.parse(fs.readFileSync(dirConfig.mapPath, 'utf8'));
        } else {
            console.error(`Image map not found at ${dirConfig.mapPath}`);
            return;
        }
    }

    const files = fs.readdirSync(imagesDir);
    console.log(`Found ${files.length} files in ${imagesDir}`);

    let convertedCount = 0;
    let errorCount = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
            const inputPath = path.join(imagesDir, file);
            const outputFilename = file.replace(ext, '.webp');
            const outputPath = path.join(imagesDir, outputFilename);

            try {
                // Check if webp already exists
                if (!fs.existsSync(outputPath)) {
                    await sharp(inputPath)
                        .webp({ quality: 80 })
                        .toFile(outputPath);
                    console.log(`Converted: ${file} -> ${outputFilename}`);

                    convertedCount++;

                    // Delete original
                    try {
                        fs.unlinkSync(inputPath);
                        console.log(`Deleted original: ${file}`);
                    } catch (unlinkErr) {
                        console.error(`Error deleting ${file}:`, unlinkErr);
                    }
                } else {
                    console.log(`Skipping: ${outputFilename} already exists`);
                }

                if (dirConfig.hasMap) {
                    const oldRelativePath = `${dirConfig.prefix}${file}`;
                    const newRelativePath = `${dirConfig.prefix}${outputFilename}`;

                    for (const [key, value] of Object.entries(imageMap)) {
                        if (value === oldRelativePath) {
                            imageMap[key] = newRelativePath;
                        }
                    }
                }

            } catch (convertErr) {
                console.error(`Error converting ${file}:`, convertErr);
                errorCount++;
            }
        }
    }

    if (dirConfig.hasMap) {
        fs.writeFileSync(dirConfig.mapPath, JSON.stringify(imageMap, null, 2));
        console.log(`Updated image_map.json`);
    }

    console.log(`Directory complete. Converted: ${convertedCount}, Errors: ${errorCount}`);
};

const run = async () => {
    for (const dir of DIRECTORIES) {
        await convertDirectory(dir);
    }
};

run();
