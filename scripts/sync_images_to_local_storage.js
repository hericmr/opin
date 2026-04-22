#!/usr/bin/env node

/**
 * Script para sincronizar imagens do Supabase Cloud para Storage Local
 * 
 * Estrutura esperada no storage local:
 * /var/lib/storage/{tenant_id}/{bucket_name}/{path_to_file}
 * 
 * Exemplo:
 * /var/lib/storage/opin/imagens-das-escolas/1/image.jpg
 */

const fs = require('fs');
const https = require('https');
const path = require('path');
const http = require('http');

// Configuração
const STORAGE_BASE_DIR = process.env.STORAGE_DIR || '/var/lib/storage';
const TENANT_ID = 'opin';

// URLs base do Supabase Cloud
const SUPABASE_URLS = {
  'imagens-das-escolas': 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-das-escolas/',
  'avatar': 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/avatar/',
  'imagens-professores': 'https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/imagens-professores/'
};

// Contadores
let downloaded = 0;
let failed = 0;
let skipped = 0;

/**
 * Faz download de uma imagem e salva no storage local
 */
const downloadImage = (url, bucket, relativePath) => {
  return new Promise((resolve) => {
    const storagePath = path.join(STORAGE_BASE_DIR, TENANT_ID, bucket, relativePath);
    const dir = path.dirname(storagePath);

    // Criar diretórios se não existirem
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

    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(storagePath);

    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${bucket}/${relativePath}`);
          downloaded++;
          resolve();
        });
      } else {
        file.close();
        fs.unlink(storagePath, () => {});
        console.error(`❌ FAILED (Status ${response.statusCode}): ${bucket}/${relativePath}`);
        failed++;
        resolve();
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(storagePath, () => {});
      console.error(`❌ ERROR: ${bucket}/${relativePath} - ${err.message}`);
      failed++;
      resolve();
    });
  });
};

/**
 * Lê o banco de dados e extrai URLs de imagens
 */
const extractImagesFromDatabase = async () => {
  const dataDir = path.join(__dirname, '../data/database/tables');
  const images = [];

  console.log('\n📂 Procurando arquivos SQL com URLs de imagens...\n');

  if (!fs.existsSync(dataDir)) {
    console.warn(`⚠️  Diretório não encontrado: ${dataDir}`);
    return images;
  }

  const files = fs.readdirSync(dataDir);
  
  for (const file of files) {
    if (!file.endsWith('.sql')) continue;

    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extrair URLs do Supabase Cloud
    const urlRegex = /https:\/\/cbzwrxmcuhsxehdrsrvi\.supabase\.co\/storage\/v1\/object\/public\/([^\/]+)\/(.+?)([',"]|\s|$)/g;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      const bucket = match[1];
      const filePath = match[2];
      const url = `https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;

      images.push({ bucket, filePath, url });
    }
  }

  return images;
};

/**
 * Script principal
 */
const main = async () => {
  console.log('🚀 Sincronizando imagens do Supabase para Storage Local...\n');
  console.log(`📍 Diretório de Storage: ${STORAGE_BASE_DIR}`);
  console.log(`📍 Tenant ID: ${TENANT_ID}\n`);

  // Criar diretório base se não existir
  if (!fs.existsSync(STORAGE_BASE_DIR)) {
    console.log(`📁 Criando diretório: ${STORAGE_BASE_DIR}`);
    fs.mkdirSync(STORAGE_BASE_DIR, { recursive: true });
  }

  // Extrair imagens do banco
  const images = await extractImagesFromDatabase();

  if (images.length === 0) {
    console.log('⚠️  Nenhuma imagem encontrada no banco de dados.');
    console.log('💡 Se estiver rodando fora do Docker, copie o banco manualmente para:');
    console.log(`   ${path.join(__dirname, '../data/database/tables')}\n`);
    process.exit(0);
  }

  console.log(`\n📊 ${images.length} imagem(ns) encontrada(s) no banco.\n`);
  console.log('Iniciando download em paralelo (max 5 simultâneos)...\n');

  // Baixar com limite de concorrência
  const maxConcurrent = 5;
  for (let i = 0; i < images.length; i += maxConcurrent) {
    const batch = images.slice(i, i + maxConcurrent);
    await Promise.all(
      batch.map(img => downloadImage(img.url, img.bucket, img.filePath))
    );
  }

  // Resumo
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DA SINCRONIZAÇÃO');
  console.log('='.repeat(60));
  console.log(`✅ Downloaded: ${downloaded}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(60) + '\n');

  if (failed > 0) {
    console.log('⚠️  Alguns downloads falharam. Verifique a conexão e tente novamente.\n');
  } else {
    console.log('🎉 Sincronização completa! As imagens estão prontas no storage local.\n');
  }
};

main().catch(err => {
  console.error('❌ Erro fatal:', err);
  process.exit(1);
});
