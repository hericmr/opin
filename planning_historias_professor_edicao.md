# planning_historias_professor_edicao.md

## Objetivo

Adicionar uma nova aba "História dos Professores" no painel de edição de escolas (EditEscolaPanel), permitindo o gerenciamento (CRUD) das histórias dos professores associadas à escola, utilizando a tabela `historias_professor`.

---

## 1. Levantamento das Mudanças

- Adicionar uma nova aba "História dos Professores" no painel de edição.
- Integrar o CRUD (criar, editar, remover, listar) das histórias dos professores para a escola selecionada.
- Utilizar o serviço já existente (`historiaProfessorService.js`) para operações na tabela `historias_professor`.
- Exibir múltiplas histórias, com título, texto, imagem e ordem.
- Garantir responsividade e usabilidade.
- Adicionar feedback visual para loading, sucesso e erro.

---

## 2. Passos Técnicos

- [ ] Criar/ajustar componente para gerenciar histórias dos professores (pode ser reutilizado do AdminPanel se já existir).
- [ ] Adicionar a nova aba "História dos Professores" no array de abas do EditEscolaPanel.
- [ ] Renderizar o componente de gerenciamento de histórias quando a aba estiver ativa.
- [ ] Passar o `escola.id` como prop para o componente de histórias.
- [ ] Garantir que o CRUD funcione corretamente (adicionar, editar, remover, listar).
- [ ] Adicionar estados de loading, erro e sucesso.
- [ ] Testar responsividade e fallback visual.

---

## 3. Testes

- [ ] Testar visualização, adição, edição e remoção de histórias.
- [ ] Testar com e sem imagens.
- [ ] Testar em diferentes tamanhos de tela.

---

## 4. Documentação

- [ ] Atualizar a documentação do projeto para incluir a nova aba e instruções de uso.

---

## 5. Checklist de Deploy

- [ ] Garantir que a nova aba aparece e funciona no painel de edição.
- [ ] Validar que o CRUD está funcional e integrado ao Supabase.
- [ ] Garantir que não há regressões nas outras abas do painel de edição. 