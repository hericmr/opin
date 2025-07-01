# Planning.md - Gerenciamento de Múltiplos Vídeos por Escola

## Objetivo
Permitir que cada escola tenha múltiplos vídeos cadastrados, com título e URL, editáveis pelo painel de administração, de forma semelhante à aba "História dos Professores".

---

## 1. Estrutura da Tabela de Vídeos
- [ ] Confirmar/ajustar tabela `titulos_videos` (ou `videos_escola`):
  - `id` (int, primary key)
  - `escola_id` (int, foreign key)
  - `titulo` (text, NOT NULL)
  - `url` (text, NOT NULL)
  - `ordem` (int, default 1)
  - `ativo` (boolean, default true)
  - `created_at`, `updated_at` (timestamp)

---

## 2. Service de Vídeos (Supabase)
- [ ] Criar/atualizar `src/services/videoService.js` com funções:
  - `getVideosEscola(escolaId)`
  - `createVideoEscola(data)`
  - `updateVideoEscola(id, data)`
  - `deleteVideoEscola(id)`

---

## 3. Componente de Gerenciamento de Vídeos
- [ ] Criar `VideoManager.js` (ou `VideoSectionManager.js`) no painel admin:
  - [ ] Listar todos os vídeos da escola
  - [ ] Adicionar novo vídeo (título + URL)
  - [ ] Editar vídeo existente
  - [ ] Remover vídeo
  - [ ] Reordenar vídeos (opcional)

---

## 4. Integração no Painel de Edição/Admin
- [ ] Substituir campo único de vídeo pelo novo componente de gerenciamento
- [ ] Garantir que cada escola pode ter múltiplos vídeos

---

## 5. Renderização no PainelInformacoes
- [ ] Alterar para buscar e exibir todos os vídeos da escola
- [ ] Exibir todos os vídeos cadastrados (com título e player)

---

## 6. Checklist Final
- [ ] CRUD de vídeos funcionando no admin
- [ ] Vários vídeos aparecem no PainelInformacoes
- [ ] Permissões Supabase OK
- [ ] Documentar no README.md 