const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif'];

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Configurações padrão para WebP
    const webpOptions = {
      quality: 80,
      effort: 6,
      ...options
    };

    // Se a imagem for PNG, preserva a transparência
    if (metadata.format === 'png') {
      await image
        .webp({ ...webpOptions, alphaQuality: 100 })
        .toFile(outputPath);
    } else {
      await image
        .webp(webpOptions)
        .toFile(outputPath);
    }

    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

    console.log(`✓ ${path.basename(inputPath)} -> ${path.basename(outputPath)} (${reduction}% reduction)`);
  } catch (error) {
    console.error(`✗ Error processing ${inputPath}:`, error.message);
  }
}

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await processDirectory(filePath);
    } else if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
      const outputPath = filePath.replace(/\.[^.]+$/, '.webp');
      await optimizeImage(filePath, outputPath);
    }
  }
}

// Criar diretório de backup
const backupDir = path.join(PUBLIC_DIR, 'backups', 'images');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Fazer backup das imagens originais
console.log('Backing up original images...');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupTimestampDir = path.join(backupDir, timestamp);
fs.mkdirSync(backupTimestampDir, { recursive: true });

fs.readdirSync(PUBLIC_DIR).forEach(file => {
  if (IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase())) {
    fs.copyFileSync(
      path.join(PUBLIC_DIR, file),
      path.join(backupTimestampDir, file)
    );
  }
});

// Otimizar imagens
console.log('\nOptimizing images...');
processDirectory(PUBLIC_DIR)
  .then(() => console.log('\nImage optimization complete!'))
  .catch(error => console.error('Error during optimization:', error)); 