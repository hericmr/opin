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

  // Usar o primeiro script principal (geralmente main.*.js)
  const scriptSrc = scripts.find(s => s.includes('main.')) || scripts[0];
  // Usar o primeiro CSS principal (geralmente main.*.css)
  const cssHref = cssFiles.find(c => c.includes('main.')) || cssFiles[0];

  // Ler o dashboard/index.html
  let dashboardHtml = fs.readFileSync(dashboardIndexPath, 'utf8');

  // Substituir %PUBLIC_URL% por /opin
  dashboardHtml = dashboardHtml.replace(/%PUBLIC_URL%/g, '/opin');

  // Adicionar os scripts antes do fechamento do </body>
  // Verificar se os scripts já não estão presentes
  if (!dashboardHtml.includes(scriptSrc)) {
    const scriptTag = `    <script defer="defer" src="${scriptSrc}"></script>`;
    const cssTag = `    <link href="${cssHref}" rel="stylesheet">`;
    
    // Inserir CSS no <head> antes do </head> (se não existir)
    if (!dashboardHtml.includes(cssHref)) {
      dashboardHtml = dashboardHtml.replace('</head>', `    ${cssTag}\n</head>`);
    }
    
    // Inserir script antes do último </body> ou antes do último script existente
    if (dashboardHtml.includes('</body>')) {
      dashboardHtml = dashboardHtml.replace('</body>', `    ${scriptTag}\n</body>`);
    } else {
      // Se não houver </body>, adicionar antes do fechamento do HTML
      dashboardHtml = dashboardHtml.replace('</html>', `    ${scriptTag}\n</html>`);
    }
  }

  // Salvar o arquivo processado
  fs.writeFileSync(dashboardIndexPath, dashboardHtml, 'utf8');
  
  console.log('✅ build/dashboard/index.html processado com sucesso!');
  console.log(`   - Script adicionado: ${scriptSrc}`);
  console.log(`   - CSS adicionado: ${cssHref}`);
}

// Executar o script
processDashboardHtml();

