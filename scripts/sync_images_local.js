#!/usr/bin/env node

/**
 * Script para sincronizar imagens do Supabase Cloud para Storage Local
 * Roda na máquina local e copia para o volume Docker depois
 */

const fs = require('fs');
const https = require('https');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuração
const PROJECT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(PROJECT_DIR, 'data/database/tables');
const STORAGE_DIR = path.join(PROJECT_DIR, 'data/storage/opin');
const TENANT_ID = 'opin';

// URLs base do Supabase Cloud
const SUPABASE_BUCKETS = {
  'imagens-das-escolas': 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/',
  'avatar': 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/avatar/',
  'imagens-professores': 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-professores/'
};

// Contadores
let downloaded = 0;
let failed = 0;
let skipped = 0;

/**
 * Faz URL encoding adequado para caracteres especiais
 */
const encodeUrlPath = (urlPath) => {
  // Dividir em partes (protocolo, domínio, caminho)
  const url = new URL(urlPath);
  
  // Encode cada segmento do caminho
  const pathSegments = url.pathname.split('/').map(segment => 
    encodeURIComponent(decodeURIComponent(segment))
  );
  
  url.pathname = pathSegments.join('/');
  return url.toString();
};

/**
 * Faz download de uma imagem com retry
 */
const downloadImage = (url, bucket, relativePath, retries = 2) => {
  return new Promise((resolve) => {
    const storagePath = path.join(STORAGE_DIR, bucket, relativePath);
    const dir = path.dirname(storagePath);

    // Criar diretórios
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Pular se já existe
    if (fs.existsSync(storagePath)) {
      console.log(`⏭️  SKIP: ${bucket}/${relativePath}`);
      skipped++;
      resolve();
      return;
    }

    console.log(`⬇️  Downloading: ${bucket}/${relativePath}`);

    const attemptDownload = () => {
      try {
        // Fazer encoding correto da URL
        const encodedUrl = encodeUrlPath(url);
        
        const file = fs.createWriteStream(storagePath);
        https.get(encodedUrl, { timeout: 15000 }, (response) => {
          if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log(`✅ Downloaded: ${bucket}/${relativePath}`);
              downloaded++;
              resolve();
            });
            file.on('error', (err) => {
              file.close();
              if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);
              
              // Retry em caso de erro
              if (retries > 0) {
                console.log(`⚠️  Retry (${retries} left): ${bucket}/${relativePath}`);
                setTimeout(() => downloadImage(url, bucket, relativePath, retries - 1).then(resolve), 1000);
              } else {
                console.error(`❌ File error: ${bucket}/${relativePath}`);
                failed++;
                resolve();
              }
            });
          } else if (response.statusCode >= 400 && response.statusCode < 500) {
            file.close();
            if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);
            
            // Erros 4xx são permanentes (arquivo não existe)
            console.error(`❌ HTTP ${response.statusCode}: ${bucket}/${relativePath} (não encontrado no Supabase)`);
            failed++;
            resolve();
          } else if (response.statusCode >= 500 && retries > 0) {
            // Erros 5xx podem ser temporários, fazer retry
            file.close();
            if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);
            console.log(`⚠️  Server error (${response.statusCode}), retry (${retries} left): ${bucket}/${relativePath}`);
            setTimeout(() => downloadImage(url, bucket, relativePath, retries - 1).then(resolve), 2000);
          } else {
            file.close();
            if (fs.existsSync(storagePath)) fs.unlinkSync(storagePath);
            console.error(`❌ HTTP ${response.statusCode}: ${bucket}/${relativePath}`);
            failed++;
            resolve();
          }
        }).on('error', (err) => {
          // Erro de conexão, tentar retry
          if (retries > 0) {
            console.log(`⚠️  Connection error, retry (${retries} left): ${bucket}/${relativePath}`);
            setTimeout(() => downloadImage(url, bucket, relativePath, retries - 1).then(resolve), 1500);
          } else {
            console.error(`❌ Request error: ${bucket}/${relativePath}`);
            failed++;
            resolve();
          }
        });
      } catch (err) {
        console.error(`❌ Parse error: ${bucket}/${relativePath} - ${err.message}`);
        failed++;
        resolve();
      }
    };

    attemptDownload();
  });
};

/**
 * Extrai URLs do banco de dados com validação melhorada
 * Busca em TODOS os buckets: imagens-das-escolas, imagens-professores, avatar
 */
const extractImages = () => {
  const images = [];
  const seenUrls = new Set();

  if (!fs.existsSync(DATA_DIR)) {
    console.warn(`⚠️  Dados não encontrados em: ${DATA_DIR}`);
    console.warn('💡 Execute este script após: npm run sync:images\n');
    return images;
  }

  const files = fs.readdirSync(DATA_DIR);
  
  for (const file of files) {
    if (!file.endsWith('.sql')) continue;

    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Regex que captura URLs de TODOS os buckets
    // Mais preciso: permite apenas caracteres válidos em URLs (sem aspas, colchetes, etc)
    const urlRegex = /https:\/\/cbzwrxmcuhsxehdrsrvi\.supabase\.co\/storage\/v1\/object\/public\/([a-z\-]+)\/([a-zA-Z0-9\-_.\/]+)/g;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      try {
        const bucket = match[1];
        const fileName = match[2];
        
        // Validar bucket (deve ser um dos conhecidos)
        if (!['imagens-das-escolas', 'imagens-professores', 'avatar', 'materiais', 'documentos'].includes(bucket)) {
          continue;
        }

        const url = `https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/${bucket}/${fileName}`;

        // Evitar duplicatas
        if (!seenUrls.has(url)) {
          images.push({ bucket, filePath: fileName, url });
          seenUrls.add(url);
        }
      } catch (err) {
        // Silenciar erros de parse
      }
    }
  }

  return images;
};

/**
 * Copia arquivos para o volume Docker
 */
const copyToDockerVolume = async () => {
  console.log('\n📦 Copiando imagens para o container Docker...\n');

  try {
    // Tentar copiar para o container se estiver rodando
    const { stdout } = await execAsync('docker compose ps -q opin_storage 2>/dev/null || echo ""');
    const containerId = stdout.trim();

    if (!containerId) {
      console.log('⚠️  Container Docker não está rodando.');
      console.log(`   Imagens salvas localmente em: ${STORAGE_DIR}`);
      console.log('   Depois de iniciar Docker, execute:\n   docker copy-into opin_storage\n');
      return;
    }

    // Copiar para container
    console.log('   docker cp ${STORAGE_DIR} opin_storage:/var/lib/storage/');
    await execAsync(`docker cp "${STORAGE_DIR}" "opin_storage:/var/lib/storage/"`);
    console.log('✅ Arquivos copiados para o Docker!\n');
  } catch (err) {
    console.log('⚠️  Não foi possível copiar automaticamente.');
    console.log('   Copie manualmente com:\n');
    console.log(`   docker cp "${STORAGE_DIR}" opin_storage:/var/lib/storage/\n`);
  }
};

/**
 * Main
 */
const main = async () => {
  console.log('🚀 Sincronizando imagens do Supabase para Storage Local\n');
  console.log(`📁 Diretório de Storage: ${STORAGE_DIR}\n`);

  // Criar diretório base
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }

  // Extrair imagens
  const images = extractImages();

  if (images.length === 0) {
    console.log('⚠️  Nenhuma imagem encontrada!');
    console.log('   Verifique se os arquivos SQL estão em: ' + DATA_DIR);
    process.exit(0);
  }

  // Agrupar por bucket
  const imagesByBucket = {};
  images.forEach(img => {
    if (!imagesByBucket[img.bucket]) {
      imagesByBucket[img.bucket] = [];
    }
    imagesByBucket[img.bucket].push(img);
  });

  console.log(`📊 ${images.length} imagem(s) encontradas\n`);
  console.log('📋 Por bucket:\n');
  Object.entries(imagesByBucket).forEach(([bucket, imgs]) => {
    console.log(`   📁 ${bucket}: ${imgs.length} imagem(s)`);
  });
  console.log('\nIniciando downloads (máx 3 simultâneos)...\n');

  // Download em paralelo
  const maxConcurrent = 3;
  for (let i = 0; i < images.length; i += maxConcurrent) {
    const batch = images.slice(i, i + maxConcurrent);
    await Promise.all(batch.map(img => downloadImage(img.url, img.bucket, img.filePath)));
  }

  // Copiar para Docker
  await copyToDockerVolume();

  // Resumo
  console.log('='.repeat(60));
  console.log('📊 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60));
  console.log('');

  if (failed > 0) {
    console.log(`⚠️  ${failed} downloads falharam. Possíveis causas:`);
    console.log('   • Arquivo foi deletado do Supabase');
    console.log('   • Problemas de conectividade temporária');
    console.log('   • URL malformada no banco de dados');
    console.log('');
    console.log('💡 Tente novamente mais tarde ou verifique o banco:\n');
  } else if (downloaded === 0 && skipped === 0) {
    console.log('ℹ️  Nenhuma imagem foi sincronizada.\n');
  } else {
    console.log('🎉 Sincronização completa!\n');
  }

  if (downloaded > 0 || skipped > 0) {
    console.log('Próximos passos:');
    console.log('  1. Inicie o Docker: docker compose up -d');
    console.log('  2. Copie as imagens: docker cp data/storage/opin opin_storage:/var/lib/storage/');
    console.log('  3. Reinicie: docker compose restart front');
    console.log('  4. Limpe cache: Ctrl+Shift+Delete no navegador');
    console.log('  5. Acesse: http://localhost:8080/opin/\n');
  }
};

main().catch(console.error);
