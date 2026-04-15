# Planning — Melhorias técnicas do OPIN

Ordem: do mais crítico para o menos crítico.  
Fluxo de cada passo: implementar → testar manualmente → commit + deploy.

---

## Passo 1 — Remover console.logs de produção
**Por quê:** 92 logs ativos em produção poluem o DevTools, vazam informações internas e indicam código inacabado. Já existe `logger.js` no projeto.

**O que fazer:**
- Substituir todos os `console.log` / `console.warn` / `console.error` nos componentes por chamadas ao `logger.js`
- Manter apenas os que estão dentro de blocos `catch` como `console.error` (erros reais)
- Arquivos prioritários: `ImagensdasEscolas.js`, `SidebarMediaViewer.js`, `ImagemHistoriadoProfessor.js`, `PainelInformacoes/index.js`, `useEscolasData.js`

**Teste manual:** Abrir o site, navegar por uma escola, abrir o painel maximizado → DevTools Console deve estar limpo (sem logs de debug)

**Status:** [x] implementado [ ] testado [ ] publicado

---

## Passo 2 — Extrair `hasContent()` para utilitário compartilhado
**Por quê:** A mesma função de 5 linhas está copiada em pelo menos 3 arquivos. Qualquer mudança precisa ser feita em vários lugares.

**O que fazer:**
- Criar `src/utils/contentValidation.js` com a função `hasContent(value)`
- Remover as cópias locais de `SidebarMediaViewer.js`, `ImagensdasEscolas.js`, `ImagemHistoriadoProfessor.js`
- Importar de `contentValidation.js` nos 3 arquivos

**Teste manual:** Abrir painel de uma escola com fotos e legendas → imagens e legendas aparecem normalmente

**Status:** [x] implementado [ ] testado [ ] publicado

---

## Passo 3 — Corrigir N+1 queries nas fotos de professores
**Por quê:** Para cada foto de professor, `SidebarMediaViewer.js` e `ImagemHistoriadoProfessor.js` fazem uma query separada buscando a legenda. Com 10 fotos = 10 queries extras. Lento e caro.

**O que fazer:**
- Em `SidebarMediaViewer.js` (no `fetchBucketList` de `professor`): buscar todas as legendas em uma única query filtrando por `escola_id` e `tipo_foto = 'professor'`, depois fazer o match em memória
- Mesmo ajuste em `ImagemHistoriadoProfessor.js`

**Teste manual:** Abrir painel de uma escola com fotos de professores → fotos e legendas aparecem; verificar no DevTools → Network que o número de requests caiu

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Passo 4 — Eliminar prop drilling do `refreshKey`
**Por quê:** `refreshKey` desce por props por 10+ componentes aninhados. O `RefreshContext` já existe mas não é usado no painel.

**O que fazer:**
- No `PainelInformacoes/index.js` e nos componentes filhos que recebem `refreshKey` como prop, trocar para `const { refreshKey } = useRefresh()` direto
- Remover `refreshKey` das assinaturas de props onde não for mais necessário

**Teste manual:** Editar uma escola no admin e salvar → painel atualiza corretamente sem precisar recarregar

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Passo 5 — Quebrar `SidebarMediaViewer.js` em hook + componente
**Por quê:** 436 linhas com lógica de fetch, estado, e renderização misturados. Difícil de testar e manter.

**O que fazer:**
- Criar `src/hooks/useSidebarImages.js` extraindo toda a lógica de busca de imagens (estados, effects, fetchBucketList, deduplicação do header)
- `SidebarMediaViewer.js` fica responsável só pela renderização (carrossel, botões, legenda)

**Teste manual:** Abrir painel maximizado → imagens carregam, navegação entre fotos funciona, header não duplica

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Passo 6 — Quebrar `AdminPanel/index.js` (762 linhas)
**Por quê:** Um único arquivo gerencia tabs, estado global, salvamento, upload de imagens e lógica de visibilidade.

**O que fazer:**
- Extrair lógica de controle de abas para `useAdminTabs.js`
- Extrair lógica de estado do formulário para `useAdminForm.js` (se ainda não existir)
- O `index.js` fica como orquestrador leve chamando os hooks

**Teste manual:** Criar e editar uma escola pelo admin → todos os campos salvam corretamente, upload de imagem funciona

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Passo 7 — Quebrar `TabelasIntegraisTab.js` (1104 linhas)
**Por quê:** A aba de tabelas tem tabela de dados, backups, logs e exportação num único arquivo gigante.

**O que fazer:**
- Separar em subcomponentes: `EscolasTable.js`, `BackupSection.js`, `LogsSection.js`
- Manter `TabelasIntegraisTab.js` como container que importa os três

**Teste manual:** Aba "Tabelas" no admin funciona → tabela exibe escolas, exportação funciona, logs aparecem

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Passo 8 — Melhorar tratamento de erros
**Por quê:** Catches vazios e mensagens genéricas escondem problemas reais do usuário e do desenvolvedor.

**O que fazer:**
- Substituir `catch (e) { }` vazio em `ImagemHistoriadoProfessor.js:118` por log + estado de erro
- Em `useEscolasData.js`, distinguir erro de rede (`Failed to fetch`) de erro de dados, com mensagens diferentes
- Adicionar estado de erro visível em `SidebarMediaViewer` quando todas as imagens falham ao carregar

**Teste manual:** Desconectar da internet e abrir o site → mensagens de erro aparecem em vez de tela em branco

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Passo 9 — Acessibilidade: ARIA nos elementos interativos
**Por quê:** Carrossel de imagens, modais de zoom e botões de fechar são inacessíveis para usuários de leitores de tela.

**O que fazer:**
- `SidebarMediaViewer.js`: adicionar `aria-label="Imagem anterior"` / `"Próxima imagem"` nos botões (já tem em alguns, verificar todos)
- `ImagensdasEscolas.js`: adicionar `role="dialog"`, `aria-modal="true"` e gestão de foco no modal de zoom (ao fechar, retornar foco ao `<figure>` que foi clicado)
- `PainelInformacoes`: verificar que o botão fechar tem `aria-label`

**Teste manual:** Navegar pelo painel usando só o teclado (Tab, Enter, Esc) → consegue abrir/fechar modal de zoom, navegar entre fotos

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Passo 10 — Deletar código morto
**Por quê:** Arquivos que existem mas não fazem nada confundem quem lê o código.

**O que fazer:**
- Deletar `src/components/AdminPanel/AdminToolbar.js` (retorna `null`, não é usado)
- Remover variável `showShareOptions` comentada em `ShareButton.js`
- Verificar e remover outros imports não utilizados que o ESLint apontar

**Teste manual:** Rodar `npm run build` → sem warnings de imports não utilizados; site funciona normalmente

**Status:** [ ] implementado [ ] testado [ ] publicado

---

## Notas

- Cada passo é independente — podem ser feitos em qualquer ordem se necessário
- Build + deploy só depois de teste manual confirmado
- Testes automatizados ficam para uma fase futura (após estabilizar a arquitetura)
