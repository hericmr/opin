# planning_remover_imagens_historias_professor.md

## Objetivo

Remover todos os campos relacionados a imagens da tabela `historias_professor` no Supabase e do frontend, simplificando o gerenciamento das histórias dos professores.

---

## 1. Levantamento das Mudanças

- Remover os campos `imagem_url` e `descricao_imagem` da tabela `historias_professor` no Supabase.
- Remover qualquer referência a imagens de histórias do professor no frontend (CRUD, visualização, upload, exibição, etc).
- Garantir que o CRUD de histórias continue funcionando normalmente sem os campos de imagem.
- Atualizar mensagens, placeholders e instruções para não mencionar imagens.

---

## 2. Passos Técnicos

### 2.1. Supabase (Banco de Dados)
- [ ] Executar um `ALTER TABLE` para remover as colunas `imagem_url` e `descricao_imagem` da tabela `historias_professor`.
- [ ] (Opcional) Remover arquivos antigos do bucket `historia-professor-imagens` se não forem mais necessários.

### 2.2. Frontend
- [ ] Remover campos, inputs e botões de upload de imagem do CRUD de histórias do professor.
- [ ] Remover exibição de imagens e descrições de imagem nas histórias.
- [ ] Remover validações, funções e serviços relacionados a upload, visualização e exclusão de imagens de histórias do professor.
- [ ] Atualizar componentes, serviços e hooks para refletir a ausência desses campos.
- [ ] Testar o CRUD e a visualização das histórias sem imagens.

---

## 3. Testes
- [ ] Testar adição, edição, remoção e visualização de histórias sem campos de imagem.
- [ ] Testar responsividade e fallback visual.

---

## 4. Documentação
- [ ] Atualizar a documentação do projeto para refletir a remoção dos campos de imagem das histórias do professor.

---

## 5. Checklist de Deploy
- [ ] Garantir que não há mais referências a imagens de histórias do professor no banco e no frontend.
- [ ] Validar que o CRUD de histórias funciona normalmente. 