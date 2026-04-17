# Páginas Estáticas por Escola

## Objetivo
Criar uma página editorial para cada escola do banco de dados, acessível via `/escola/:id`, com todo o conteúdo atualmente exibido no PainelInformacoes, mas formatada como página estática independente do mapa.

---

## Steps

### Step 1 — Rota e página esqueleto ✅
- [x] Criar `src/views/pages/EscolaPage.jsx`
- [x] Registrar rota `/escola/:id` em `src/router/index.js`
- [x] Adicionar `/escola` ao `isHeroNavbarRoute` em `App.js`

### Step 2 — Carregamento de dados ✅
- [x] `useEscolaDetalhes(id)` carregando dados completos
- [x] Estados de loading, erro e escola não encontrada

### Step 3 — Header editorial ✅
- [x] `PageHeader` com nome da escola + breadcrumbs
- [x] Metadados OG dinâmicos por escola
- [x] Botão "Ver no mapa"

### Step 4 — Galeria de fotos ✅
- [x] `GaleriaHorizontal` abaixo do header
- [x] `GaleriaPanel` fullscreen ao clicar

### Step 5 — Seções de informação ✅
- [x] BasicInfo, Modalidades, Infraestrutura, GestaoProfessores

### Step 6 — Conteúdo editorial ✅
- [x] HistoriaEscola, HistoriaTerraIndigena, HistoriadoProfessor, ProjetosParcerias

### Step 7 — Integração com o resto do site ✅
- [x] Link "Ver página da escola" nos resultados de busca (`search.js`)
- [x] Botão "Ver página da escola" no PainelHeader do mapa (ícone FileText)

### Step 8 — Polimento
- [ ] Revisar layout editorial das seções reutilizadas
- [ ] Ocultar seções sem dados

### Step 9 — Deploy e testes
- [ ] Build sem erros ✅
- [ ] Testar navegação direta (GitHub Pages 404 redirect)
- [ ] Commit, push e deploy

---

## Decisões técnicas
- URL: `/escola/:id` (ID numérico do banco)
- Dados: reusar hooks existentes, não duplicar lógica
- Componentes: reusar seções do PainelInformacoes com layout editorial adaptado
- Imagem OG: primeira foto da galeria da escola (fallback: hero_grayscale.webp)
