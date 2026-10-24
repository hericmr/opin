const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const STORAGE_DIR = path.join(__dirname, '../data/storage/opin');
const SQL_FILE = path.join(__dirname, '../data/database/init_full.sql');
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];

const findImages = (dir) => {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findImages(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
};

const run = async () => {
  const images = findImages(STORAGE_DIR);
  console.log(`Encontradas ${images.length} imagens para converter`);

  let converted = 0;
  let errors = 0;

  for (const inputPath of images) {
    const ext = path.extname(inputPath);
    const outputPath = inputPath.slice(0, -ext.length) + '.webp';

    if (fs.existsSync(outputPath)) {
      console.log(`Já existe, pulando: ${path.relative(STORAGE_DIR, outputPath)}`);
      fs.unlinkSync(inputPath);
      converted++;
      continue;
    }

    try {
      await sharp(inputPath).webp({ quality: 82 }).toFile(outputPath);
      fs.unlinkSync(inputPath);
      console.log(`Convertido: ${path.relative(STORAGE_DIR, inputPath)} → .webp`);
      converted++;
    } catch (err) {
      console.error(`Erro em ${path.relative(STORAGE_DIR, inputPath)}:`, err.message);
      errors++;
    }
  }

  console.log(`\nConversão concluída: ${converted} convertidas, ${errors} erros`);

  // Atualizar init_full.sql substituindo as extensões nas referências de imagens
  if (fs.existsSync(SQL_FILE)) {
    let sql = fs.readFileSync(SQL_FILE, 'utf8');
    const before = sql;
    sql = sql.replace(/\.(jpeg|jpg|png)(?=['"\\])/gi, '.webp');
    if (sql !== before) {
      fs.writeFileSync(SQL_FILE, sql, 'utf8');
      const count = (before.match(/\.(jpeg|jpg|png)(?=['"\\])/gi) || []).length;
      console.log(`init_full.sql atualizado: ${count} referências substituídas por .webp`);
    } else {
      console.log('init_full.sql: nenhuma referência de imagem encontrada para atualizar');
    }
  }
};

run();
