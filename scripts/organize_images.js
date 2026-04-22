#!/usr/bin/env node

/**
 * Script para organizar imagens nas pastas corretas baseado no banco de dados
 * Lê o arquivo de URLs e reorganiza as imagens locais
 */

const fs = require('fs');
const path = require('path');

const STORAGE_DIR = path.join(__dirname, '../data/storage/opin');
const URLs_FILE = '/tmp/all_images.txt';

// Mapeamento de URL para arquivo local esperado
const createImageMap = () => {
  if (!fs.existsSync(URLs_FILE)) {
    console.error('❌ Arquivo de URLs não encontrado:', URLs_FILE);
    process.exit(1);
  }

  const content = fs.readFileSync(URLs_FILE, 'utf8');
  const urls = content.trim().split('\n').filter(Boolean);
  
  const imageMap = {};
  urls.forEach(url => {
    // Extrair bucket e caminho
    const match = url.match(/storage\/v1\/object\/public\/([^\/]+)\/(.+)/);
    if (match) {
      const [, bucket, filePath] = match;
      imageMap[filePath.toLowerCase()] = { bucket, filePath };
    }
  });

  return imageMap;
};

/**
 * Encontra um arquivo localmente (case-insensitive)
 */
const findFile = (basePath, targetName) => {
  const files = fs.readdirSync(basePath, { recursive: true });
  for (const file of files) {
    if (path.basename(file).toLowerCase() === targetName.toLowerCase()) {
      return file;
    }
  }
  return null;
};

/**
 * Organiza as imagens
 */
const organizeImages = () => {
  console.log('🔄 Organizando imagens nas pastas corretas...\n');

  const imageMap = createImageMap();
  let organized = 0;
  let notFound = 0;
  let alreadyCorrect = 0;

  for (const [fileName, { bucket, filePath }] of Object.entries(imageMap)) {
    // Procurar arquivo em qualquer lugar em data/storage/opin/
    const found = findFile(STORAGE_DIR, fileName);

    if (!found) {
      console.log(`❌ Não encontrado: ${fileName}`);
      notFound++;
      continue;
    }

    const sourcePath = path.join(STORAGE_DIR, found);
    const targetDir = path.join(STORAGE_DIR, bucket);
    const targetFile = path.join(targetDir, filePath);

    // Se já está no lugar correto
    if (sourcePath === targetFile) {
      alreadyCorrect++;
      continue;
    }

    // Criar diretório se não existir
    if (!fs.existsSync(path.dirname(targetFile))) {
      fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    }

    // Mover arquivo
    fs.renameSync(sourcePath, targetFile);
    console.log(`✅ ${bucket}/${filePath}`);
    organized++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Organizadas: ${organized}`);
  console.log(`⏭️  Já corretas: ${alreadyCorrect}`);
  console.log(`❌ Não encontradas: ${notFound}`);
  console.log('='.repeat(60) + '\n');

  // Mostrar estrutura final
  console.log('📁 Estrutura final:\n');
  const buckets = {};
  const files = fs.readdirSync(STORAGE_DIR, { recursive: true });
  
  files.forEach(file => {
    const stat = fs.statSync(path.join(STORAGE_DIR, file));
    if (stat.isFile()) {
      const match = file.match(/^([^\/]+)\//);
      const bucket = match ? match[1] : 'raiz';
      
      if (!buckets[bucket]) {
        buckets[bucket] = 0;
      }
      buckets[bucket]++;
    }
  });

  Object.entries(buckets).forEach(([bucket, count]) => {
    console.log(`   📁 ${bucket}: ${count} arquivo(s)`);
  });

  console.log('\n✅ Imagens organizadas com sucesso!\n');
};

organizeImages();
