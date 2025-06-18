## [EDITPANEL] Planejamento para Inserção de Dados no Supabase

### 1. Objetivo
Desenvolver um EditPanel (painel de edição/cadastro) no frontend que permita inserir e editar dados diretamente nas tabelas do Supabase (`escolas_completa`, `imagens_escola`, `documentos_escola`). O painel deve ser intuitivo, seguro e facilitar o gerenciamento dos dados do mapa.

### 2. Levantamento de Campos
- **escolas_completa**: Todos os campos essenciais para o funcionamento do mapa (id, nome, município, latitude, longitude, etc.)
- **imagens_escola**: Upload/URL de imagens, descrição, associação com escola_id.
- **documentos_escola**: Upload/URL de documentos, título, tipo, associação com escola_id.

### 3. UX/UI do EditPanel
- Interface em abas ou seções: Dados da escola, Imagens, Documentos.
- Formulários dinâmicos e responsivos (mobile/desktop).
- Campos obrigatórios destacados.
- Feedback visual para sucesso/erro.
- Botões claros: Salvar, Cancelar, Adicionar Imagem/Documento, Excluir.
- Confirmação antes de excluir registros.
- Upload de arquivos com preview (imagens/documentos).
- Busca/autocomplete para editar escolas já cadastradas.

### 4. Fluxo de Inserção/Edição
1. Usuário acessa o EditPanel (via botão ou rota protegida).
2. Pode buscar uma escola existente (para editar) ou clicar em "Nova Escola".
3. Preenche os campos obrigatórios e opcionais.
4. Adiciona imagens e documentos (upload ou URL).
5. Validação dos campos (ex: latitude/longitude, campos obrigatórios).
6. Ao salvar:
   - Se for novo, insere na tabela `escolas_completa` e obtém o id.
   - Insere imagens/documentos vinculando ao id da escola.
   - Se for edição, atualiza os dados e gerencia imagens/documentos (adicionar/remover).
7. Feedback de sucesso ou erro.

### 5. Integração com Supabase
- Utilizar o client JS do Supabase para:
  - Inserir (`insert`) e atualizar (`update`) dados nas tabelas.
  - Upload de arquivos para o storage (imagens/documentos) e salvar URLs.
  - Buscar dados para edição (`select`).
- Tratar erros de conexão e validação.
- Garantir que as operações sejam atômicas (rollback em caso de erro).

### 6. Segurança e Permissões
- Proteger o EditPanel com autenticação (login obrigatório).
- Restringir permissões de escrita/edição apenas a usuários autorizados.
- Validar dados no frontend e backend (policies no Supabase).
- Limitar tamanho e tipo de arquivos no upload.

### 7. Testes e Validação
- Testar todos os fluxos: cadastro, edição, deleção, upload.
- Testar responsividade e acessibilidade.
- Validar mensagens de erro e feedbacks.
- Garantir que dados inseridos/alterados aparecem corretamente no mapa.

---

Esse planejamento serve como guia para a reformulação do EditPanel, tornando o processo de inserção e edição de dados no Supabase mais eficiente, seguro e amigável.
