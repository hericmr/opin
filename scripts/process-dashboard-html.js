const fs = require('fs');
const path = require('path');

/**
 * Script para processar o dashboard/index.html após o build
 * Adiciona os scripts do React que são injetados no index.html principal
 */
function processDashboardHtml() {
  const buildDir = path.join(__dirname, '..', 'build');
  const mainIndexPath = path.join(buildDir, 'index.html');
  const dashboardIndexPath = path.join(buildDir, 'dashboard', 'index.html');

  // Verificar se os arquivos existem
  if (!fs.existsSync(mainIndexPath)) {
    console.error('❌ build/index.html não encontrado. Execute o build primeiro.');
    process.exit(1);
  }

  if (!fs.existsSync(dashboardIndexPath)) {
    console.warn('⚠️ build/dashboard/index.html não encontrado. Pulando processamento...');
    return; // Não falhar o build se o dashboard não existir
  }

  // Ler o index.html principal para extrair os scripts
  const mainHtml = fs.readFileSync(mainIndexPath, 'utf8');
  
  // Extrair scripts e CSS do index.html principal
  // Procurar por todos os scripts e CSS
  const scriptMatches = mainHtml.matchAll(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g);
  const cssMatches = mainHtml.matchAll(/<link[^>]*href="([^"]+\.css)"[^>]*>/g);

  const scripts = Array.from(scriptMatches).map(m => m[1]);
  const cssFiles = Array.from(cssMatches).map(m => m[1]);

  if (scripts.length === 0 || cssFiles.length === 0) {
    console.error('❌ Não foi possível extrair scripts do index.html principal.');
    console.error(`   Scripts encontrados: ${scripts.length}`);
    console.error(`   CSS encontrados: ${cssFiles.length}`);
    process.exit(1);
  }

  // Ler o dashboard/index.html
  let dashboardHtml = fs.readFileSync(dashboardIndexPath, 'utf8');

  // Substituir %PUBLIC_URL% por /opin
  dashboardHtml = dashboardHtml.replace(/%PUBLIC_URL%/g, '/opin');

  // Adicionar todos os CSS no <head> antes do </head> (se não existirem)
  const cssTagsToAdd = cssFiles
    .filter(cssHref => !dashboardHtml.includes(cssHref))
    .map(cssHref => `    <link href="${cssHref}" rel="stylesheet">`)
    .join('\n');
  
  if (cssTagsToAdd) {
    dashboardHtml = dashboardHtml.replace('</head>', `${cssTagsToAdd}\n</head>`);
  }
  
  // Adicionar todos os scripts antes do fechamento do </body>
  // Verificar se os scripts já não estão presentes
  const scriptTagsToAdd = scripts
    .filter(scriptSrc => !dashboardHtml.includes(scriptSrc))
    .map(scriptSrc => `    <script defer="defer" src="${scriptSrc}"></script>`)
    .join('\n');
  
  if (scriptTagsToAdd) {
    // Inserir scripts antes do último </body>
    if (dashboardHtml.includes('</body>')) {
      dashboardHtml = dashboardHtml.replace('</body>', `${scriptTagsToAdd}\n</body>`);
    } else {
      // Se não houver </body>, adicionar antes do fechamento do HTML
      dashboardHtml = dashboardHtml.replace('</html>', `${scriptTagsToAdd}\n</html>`);
    }
  }

  // Salvar o arquivo processado
  fs.writeFileSync(dashboardIndexPath, dashboardHtml, 'utf8');
  
  console.log('✅ build/dashboard/index.html processado com sucesso!');
  console.log(`   - Scripts adicionados: ${scripts.length}`);
  console.log(`   - CSS adicionados: ${cssFiles.length}`);
}

// Executar o script
processDashboardHtml();

