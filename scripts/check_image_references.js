#!/usr/bin/env node

/**
 * Script para validar e corrigir referências de imagens no banco
 * Remove ou atualiza URLs que não existem mais no Supabase
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data/database/tables');

// Imagens que falharam (conhecidas como deletadas)
const knownMissing = new Set([
  'imagens-professores/20/3Z8C9571.jpg',
  'imagens-professores/20/2Z8C9570.jpg',
  'imagens-das-escolas/20/escola_frente.jpg',
  'imagens-das-escolas/20/sala_aula.jpg',
  'imagens-das-escolas/20/patio.jpg',
]);

/**
 * Testa se uma imagem existe no Supabase
 */
const checkImageExists = (url) => {
  return new Promise((resolve) => {
    https.head(url, { timeout: 5000 }, (response) => {
      resolve(response.statusCode === 200);
    }).on('error', () => {
      resolve(false);
    });
  });
};

/**
 * Encontra referências de imagens no banco
 */
const findImageReferences = () => {
  const refs = [];

  if (!fs.existsSync(DATA_DIR)) {
    console.log('⚠️  Diretório não encontrado:', DATA_DIR);
    return refs;
  }

  const files = fs.readdirSync(DATA_DIR);

  for (const file of files) {
    if (!file.endsWith('.sql')) continue;

    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Encontrar URLs
    const urlRegex = /https:\/\/cbzwrxmcuhsxehdrsrvi\.supabase\.co\/storage\/v1\/object\/public\/([^\/]+)\/(.+?)(?=[',"\s\)]|$)/g;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      const bucket = match[1];
      const filePath = match[2].trim();
      const url = `https://cbzwrxmcuhsxehdrsrvi.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;

      refs.push({
        file,
        bucket,
        filePath,
        url,
        relativePath: `${bucket}/${filePath}`
      });
    }
  }

  return refs;
};

/**
 * Gera relatório de imagens problemáticas
 */
const generateReport = async () => {
  console.log('\n🔍 Analisando referências de imagens no banco...\n');

  const refs = findImageReferences();

  if (refs.length === 0) {
    console.log('✅ Nenhuma referência de imagem encontrada.');
    return;
  }

  console.log(`📊 Total de referências: ${refs.length}\n`);

  // Agrupar por status
  const missing = refs.filter(r => knownMissing.has(r.relativePath));
  const unknown = refs.filter(r => !knownMissing.has(r.relativePath));

  if (missing.length > 0) {
    console.log(`❌ ${missing.length} imagem(ns) conhecidas como deletadas:\n`);
    missing.forEach(ref => {
      console.log(`   📁 ${ref.bucket}/${ref.filePath}`);
      console.log(`      Arquivo SQL: ${ref.file}`);
    });
  }

  if (unknown.length > 0) {
    console.log(`\n⚠️  ${unknown.length} imagem(ns) desconhecidas (precisa verificar):\n`);
    console.log('   Testando conectividade... (isso pode demorar)\n');

    for (let i = 0; i < unknown.length; i += 3) {
      const batch = unknown.slice(i, i + 3);
      const results = await Promise.all(batch.map(async (ref) => {
        process.stdout.write(`   Verificando ${i + batch.indexOf(ref) + 1}/${unknown.length}...  `);
        const exists = await checkImageExists(ref.url);
        process.stdout.write(`\r`);
        return { ...ref, exists };
      }));

      results.forEach(({ relativePath, exists, file }) => {
        if (!exists) {
          console.log(`   ❌ ${relativePath} (em: ${file})`);
          knownMissing.add(relativePath);
        } else {
          console.log(`   ✅ ${relativePath}`);
        }
      });
    }
  }

  // Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('📋 RESUMO');
  console.log('='.repeat(60));
  console.log(`Total de referências: ${refs.length}`);
  console.log(`Imagens faltando: ${knownMissing.size}`);
  console.log(`Taxa de sucesso: ${(((refs.length - knownMissing.size) / refs.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(60) + '\n');

  if (knownMissing.size > 0) {
    console.log('💡 Próximos passos:\n');
    console.log('   1. Para remover as referências órfãs do banco, execute:');
    console.log('      node scripts/cleanup_missing_images.js\n');
    console.log('   2. Ou, para substituir por URLs locais:');
    console.log('      node scripts/fallback_missing_images.js\n');
  }
};

generateReport().catch(console.error);
