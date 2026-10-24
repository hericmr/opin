const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');
const INDEX_FILE = path.join(BUILD_DIR, 'index.html');
// Cópia do index.html sem canonical, servida pelo nginx para as rotas sem página estática
// (senão /mapa, /escola/... herdariam o canonical da página inicial)
const FALLBACK_FILE = path.join(BUILD_DIR, '200.html');
const SITE_URL = 'https://opin.unifesp.br';

// Rotas públicas fixas que entram no sitemap (as histórias e escolas são somadas depois)
const ROTAS_SITEMAP = ['', 'mapa', 'escolas', 'historias', 'sobre', 'conteudo', 'jogos', 'lindiflix', 'painel-dados'];

const pages = [
  {
    path: 'jogos',
    title: 'Jogos - OPIN',
    description: 'Jogos e materiais didáticos para impressão, são produzidos no âmbito da ação Saberes Indígenas na Escola.',
    image: 'https://opin.unifesp.br/materiais/CAPA_Livro_R01.webp'
  },
  {
    path: 'conteudo',
    title: 'Materiais Didáticos - OPIN',
    description: 'Jogos e materiais didáticos para impressão, são produzidos no âmbito da ação Saberes Indígenas na Escola.',
    image: 'https://opin.unifesp.br/materiais/CAPA_Livro_R01.webp'
  },
  {
    path: 'sobre',
    title: 'Sobre - OPIN',
    description: 'Saiba mais sobre o OPIN e nossa missão.',
    image: 'https://opin.unifesp.br/opin.webp'
  },
  {
    path: 'historias',
    title: 'Histórias – OPIN',
    description: 'No tempo das transformações: histórias que se passaram nos tempos de origem, quando todos os seres se comunicavam na mesma linguagem e se reconheciam como gente.',
    image: 'https://opin.unifesp.br/seres-transforma%C3%A7%C3%B5es/pagina_93_img_1.webp'
  }
];

if (!fs.existsSync(INDEX_FILE)) {
  console.error('index.html não encontrado no build. Execute o build primeiro.');
  process.exit(1);
}

// Remove um canonical de execução anterior para o script poder rodar de novo sobre o mesmo build
const indexContent = fs.readFileSync(INDEX_FILE, 'utf-8').replace(/\s*<link rel="canonical"[^>]*>/g, '');

const escaparAtributo = (texto) =>
  String(texto).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// data-rh deixa o react-helmet-async substituir a tag ao navegar entre rotas
const comCanonical = (html, url) =>
  html.replace('</head>', `  <link rel="canonical" href="${url}" data-rh="true" />\n  </head>`);

const gerarPagina = (page) => {
  const pageDir = path.join(BUILD_DIR, page.path);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  let newContent = indexContent;

  if (page.type) {
    newContent = newContent.replace(
      /<meta property="og:type" content="[^"]*"\s*\/>/g,
      `<meta property="og:type" content="${page.type}" />`
    );
  }

  // Replace title
  newContent = newContent.replace(
    /<title>.*?<\/title>/,
    `<title>${page.title}</title>`
  );

  // Replace og:title
  newContent = newContent.replace(
    /<meta property="og:title" content="[^"]*"\s*\/>/g,
    `<meta property="og:title" content="${page.title}" />`
  );

  // Replace twitter:title
  newContent = newContent.replace(
    /<meta property="twitter:title" content="[^"]*"\s*\/>/g,
    `<meta property="twitter:title" content="${page.title}" />`
  );

  // Replace description
  newContent = newContent.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/g,
    `<meta name="description" content="${page.description}" />`
  );

  newContent = newContent.replace(
    /<meta property="og:description" content="[^"]*"\s*\/>/g,
    `<meta property="og:description" content="${page.description}" />`
  );

  newContent = newContent.replace(
    /<meta property="twitter:description" content="[^"]*"\s*\/>/g,
    `<meta property="twitter:description" content="${page.description}" />`
  );

  // Replace url — sem isso o link compartilhado aponta para a página inicial
  const pageUrl = `${SITE_URL}/${page.path}`;
  newContent = newContent.replace(
    /<meta property="og:url" content="[^"]*"\s*\/>/g,
    `<meta property="og:url" content="${pageUrl}" />`
  );

  newContent = newContent.replace(
    /<meta property="twitter:url" content="[^"]*"\s*\/>/g,
    `<meta property="twitter:url" content="${pageUrl}" />`
  );

  // Replace image
  newContent = newContent.replace(
    /<meta property="og:image" content="[^"]*"\s*\/>/g,
    `<meta property="og:image" content="${page.image}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:site_name" content="OPIN - Saberes Indígenas" />`
  );

  newContent = newContent.replace(
    /<meta property="twitter:image" content="[^"]*"\s*\/>/g,
    `<meta property="twitter:image" content="${page.image}" />`
  );

  newContent = comCanonical(newContent, pageUrl);

  fs.writeFileSync(path.join(pageDir, 'index.html'), newContent, 'utf-8');
  console.log(`Página estática gerada: ${page.path}/index.html`);
};

// Os dados das histórias importam imagens (.webp), então os módulos de src/ são carregados
// pelo Vite em modo SSR.
const carregarModulosSrc = async () => {
  const { createServer } = await import('vite');
  const server = await createServer({
    root: path.join(__dirname, '..'),
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const { historiasSeres } = await server.ssrLoadModule('/src/data/historiasSeres.js');
    const { historiaSlug } = await server.ssrLoadModule('/src/utils/historiasSeres.js');
    const { escolaUrlSlug } = await server.ssrLoadModule('/src/utils/slug.js');
    return { historiasSeres, historiaSlug, escolaUrlSlug };
  } finally {
    await server.close();
  }
};

// Uma página por história, para o link compartilhado mostrar o título e a ilustração dela.
const paginasHistorias = ({ historiasSeres, historiaSlug }) =>
  historiasSeres.map((historia) => {
    const capa = historia.imagens?.[0];
    return {
      path: `historia/${historiaSlug(historia)}`,
      type: 'article',
      title: escaparAtributo(`${historia.subtitulo} – OPIN`),
      description: escaparAtributo(
        `${historia.titulo} – uma história do tempo das transformações, quando todos os seres se comunicavam na mesma linguagem e se reconheciam como gente.`
      ),
      image: capa ? encodeURI(`${SITE_URL}${capa}`) : `${SITE_URL}/opin.webp`,
    };
  });

// As escolas vêm da API pública de produção; se ela não responder, o sitemap sai sem elas
const caminhosEscolas = async ({ escolaUrlSlug }) => {
  try {
    const resposta = await fetch(`${SITE_URL}/rest/v1/escolas_completa?select=id,Escola`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const escolas = await resposta.json();
    return escolas.map((escola) => `escola/${escolaUrlSlug(escola.id, escola.Escola)}`);
  } catch (erro) {
    console.warn(`Sitemap sem as páginas de escolas (${erro.message})`);
    return [];
  }
};

const gerarSitemap = (caminhos) => {
  const urls = caminhos
    .map((caminho) => `  <url><loc>${escaparAtributo(encodeURI(`${SITE_URL}/${caminho}`))}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), xml, 'utf-8');
  console.log(`Sitemap gerado com ${caminhos.length} URLs`);
};

(async () => {
  fs.writeFileSync(FALLBACK_FILE, indexContent, 'utf-8');
  fs.writeFileSync(INDEX_FILE, comCanonical(indexContent, `${SITE_URL}/`), 'utf-8');

  const modulos = await carregarModulosSrc();
  const historias = paginasHistorias(modulos);
  pages.forEach(gerarPagina);
  historias.forEach(gerarPagina);

  gerarSitemap([...ROTAS_SITEMAP, ...historias.map((h) => h.path), ...(await caminhosEscolas(modulos))]);
})().catch((erro) => {
  console.error('Erro ao gerar páginas estáticas:', erro);
  process.exit(1);
});
