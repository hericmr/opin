# planning_historias_professor.md

## Objetivo

Atualizar o frontend para buscar e exibir as histórias dos professores a partir da nova tabela `historias_professor`, refletindo a normalização feita no banco de dados.

---

## 1. Levantamento das Mudanças

- Remover dependência do campo `historia_do_prof` em `escolas_completa`.
- Buscar as histórias dos professores usando a nova tabela `historias_professor`, filtrando por `escola_id`.
- Exibir múltiplas histórias de professor, com suporte a imagem, título, descrição e ordenação.
- Atualizar componentes e hooks que consumiam o campo antigo.
- Garantir fallback visual caso não haja histórias cadastradas para a escola.

---

## 2. Passos Técnicos

### 2.1. Backend/API

- [ ] Atualizar o serviço/função que busca os dados da escola para também buscar as histórias dos professores na tabela `historias_professor` usando o `escola_id`.
- [ ] Se necessário, criar um novo endpoint ou função utilitária para buscar as histórias dos professores.

### 2.2. Frontend

- [ ] Remover qualquer uso do campo `historia_do_prof` do objeto escola.
- [ ] Atualizar o componente responsável por exibir a história do professor (`HistoriadoProfessor` ou similar) para:
  - Buscar as histórias via Supabase (usando o `escola_id`).
  - Exibir todas as histórias retornadas, respeitando a ordem e o campo `ativo`.
  - Exibir imagem, título e descrição, se existirem.
- [ ] Ajustar o carregamento dos dados no PainelInformações para garantir que as histórias dos professores sejam carregadas junto com os dados da escola.
- [ ] Adicionar estados de loading e fallback (ex: "Nenhuma história de professor cadastrada para esta escola").

### 2.3. Admin Panel (opcional)

- [ ] Atualizar o painel administrativo para permitir CRUD completo das histórias dos professores na nova tabela (se ainda não estiver implementado).

---

## 3. Testes

- [ ] Testar visualização de escolas com e sem histórias de professor.
- [ ] Testar exibição de múltiplas histórias, com e sem imagens.
- [ ] Testar responsividade e fallback visual.
- [ ] Testar integração com o painel administrativo (se aplicável).

---

## 4. Documentação

- [ ] Atualizar a documentação do projeto para refletir a nova fonte dos dados de história do professor.
- [ ] Incluir instruções para desenvolvedores sobre como buscar e exibir as histórias dos professores.

---

## 5. Checklist de Deploy

- [ ] Garantir que o campo antigo foi removido do frontend.
- [ ] Garantir que todas as escolas com histórias de professor continuam exibindo corretamente.
- [ ] Validar que o sistema está pronto para múltiplas histórias por escola. 