# Requisitos — Autenticação admin no backend (JWT via PostgREST)

## Introdução

Hoje a autenticação do painel administrativo é feita inteiramente no cliente e
não protege os dados. A senha fica embutida no bundle do navegador
(`VITE_ADMIN_PASSWORD`, com fallback `admin123`), o "token" é apenas um Base64
não assinado (forjável), e o `dbClient` envia sempre o `anon key` em todas as
requisições. Como as policies de RLS são `FOR ALL USING (true)`, qualquer pessoa
de posse do `anon key` (também presente no bundle) pode inserir, atualizar e
apagar dados via API, sem login algum. O gate de senha no front é cosmético:
apenas esconde o botão do painel na interface.

Este documento especifica a mudança da autorização de escrita para o backend,
usando o suporte nativo a JWT do PostgREST (já configurado via
`PGRST_JWT_SECRET`). O objetivo é que:

- A leitura pública continue funcionando com o role anônimo (somente `SELECT`).
- Operações de escrita (`INSERT`/`UPDATE`/`DELETE`) só sejam aceitas pelo banco
  mediante um JWT válido e assinado, correspondente a um role administrativo.
- A senha deixe de existir no bundle; a verificação de credencial ocorra no
  backend, com hash armazenado no banco.

Escopo escolhido: **Opção A** — login via função RPC no PostgREST emitindo JWT
assinado, sem introduzir um novo serviço. Modelo de senha única (um role
administrativo compartilhado), suficiente para o contexto atual.

## Fora de escopo

- Múltiplos usuários individuais, cadastro de usuários ou trilha de auditoria por
  usuário (seria Opção B/C; pode ser evolução futura).
- Integração com SSO/provedor externo (Opção C).
- Correção do upload/gestão de imagens do painel admin, que depende de um
  `storage-api` inexistente nesta implantação (limitação separada já conhecida).

## Requisitos

### Requisito 1 — Remover a senha e o segredo de admin do cliente

**História:** Como responsável pela segurança do projeto, quero que nenhuma
senha ou segredo administrativo seja embutido no bundle do front, para que não
possam ser extraídos via DevTools.

#### Critérios de aceitação
1. QUANDO o bundle de produção for gerado, ENTÃO ele NÃO DEVE conter o valor de
   `VITE_ADMIN_PASSWORD` nem o fallback `admin123`.
2. O build NÃO DEVE depender da build-arg/env `VITE_ADMIN_PASSWORD` em nenhum
   lugar (`Dockerfile`, `docker-compose*.yml`, variáveis de CI/CD).
3. O código do front NÃO DEVE ler `import.meta.env.VITE_ADMIN_PASSWORD` nem
   `REACT_APP_ADMIN_PASSWORD`.
4. QUANDO a aplicação iniciar sem configuração de admin no cliente, ENTÃO ela
   DEVE continuar servindo normalmente o conteúdo público.

### Requisito 2 — Verificação de credencial no backend

**História:** Como administrador, quero autenticar informando uma senha que é
verificada no servidor contra um hash armazenado no banco, para que a senha não
trafegue nem resida no cliente.

#### Critérios de aceitação
1. O sistema DEVE expor um endpoint de login no backend (função RPC do
   PostgREST) que recebe a senha e a verifica contra um hash armazenado no banco.
2. O hash DEVE ser gerado com algoritmo adequado (ex.: bcrypt via `pgcrypto`),
   NÃO em texto claro.
3. QUANDO a senha estiver correta, ENTÃO o endpoint DEVE retornar um JWT assinado
   com o `JWT_SECRET` do servidor, contendo o claim `role` do role
   administrativo e um `exp` (expiração) definido.
4. QUANDO a senha estiver incorreta, ENTÃO o endpoint DEVE falhar sem revelar se
   o motivo foi usuário ou senha, e NÃO DEVE retornar token.
5. O endpoint de login DEVE poder ser chamado pelo role anônimo (é o único jeito
   de obter o token), mas NÃO DEVE expor o hash nem o segredo.

### Requisito 3 — Autorização de escrita imposta pelo banco (RLS + roles)

**História:** Como responsável pelos dados, quero que o banco só aceite escrita
de quem apresenta um JWT administrativo válido, para que o anon key não permita
mais alterar dados.

#### Critérios de aceitação
1. O role anônimo (usado como `PGRST_DB_ANON_ROLE`) DEVE ter apenas `SELECT` nas
   tabelas públicas; NÃO DEVE ter `INSERT`/`UPDATE`/`DELETE`.
2. DEVE existir um role administrativo (ex.: `opin_admin`) com permissão de
   `INSERT`/`UPDATE`/`DELETE` nas tabelas de conteúdo.
3. As policies de RLS DEVEM ser revisadas para que leitura seja pública
   (`SELECT`) e escrita exija o role administrativo; as policies atuais
   `FOR ALL USING (true)` DEVEM ser substituídas.
4. QUANDO uma requisição de escrita chegar com apenas o anon key (sem JWT admin),
   ENTÃO o banco DEVE recusá-la.
5. QUANDO uma requisição de escrita chegar com um JWT admin válido, ENTÃO o banco
   DEVE aceitá-la.
6. A leitura pública (mapa, páginas de escola, galerias) DEVE continuar
   funcionando sem autenticação após a mudança.

### Requisito 4 — Cliente envia o JWT nas operações autenticadas

**História:** Como administrador autenticado, quero que o painel use meu token
real nas operações de escrita, para que elas sejam aceitas pelo backend.

#### Critérios de aceitação
1. QUANDO existir um JWT admin válido armazenado, ENTÃO o `dbClient` DEVE
   enviá-lo no cabeçalho `Authorization: Bearer <jwt>` nas requisições.
2. QUANDO não houver JWT admin, ENTÃO o `dbClient` DEVE usar o anon key (leitura
   pública), como hoje.
3. O token DEVE ser lido no momento da requisição (não fixado uma única vez na
   construção), para refletir login/logout/renovação.
4. O `authService` DEVE substituir o token Base64 caseiro pelo JWT retornado pelo
   backend, e `verifyToken`/`isAuthenticated` DEVEM passar a refletir o novo
   formato (sem alegar validade que o backend não garante).

### Requisito 5 — Expiração, logout e falhas de autorização

**História:** Como administrador, quero que minha sessão expire e que erros de
autorização sejam tratados com clareza, para evitar estados inconsistentes.

#### Critérios de aceitação
1. O JWT DEVE ter expiração; após expirar, o cliente DEVE tratar o usuário como
   não autenticado.
2. QUANDO o backend recusar uma escrita por falta/expiração de token (ex.: 401),
   ENTÃO o painel DEVE orientar o usuário a autenticar novamente.
3. O logout DEVE remover o JWT do armazenamento do cliente.
4. O JWT NÃO DEVE ser armazenado de forma que seja trivialmente exfiltrável além
   do necessário para a sessão (documentar a escolha de armazenamento e seus
   tradeoffs — ex.: `localStorage` vs cookie).

### Requisito 6 — Segurança operacional e migração sem downtime da leitura

**História:** Como operador, quero aplicar a mudança sem derrubar a leitura
pública nem travar o painel por engano.

#### Critérios de aceitação
1. O `JWT_SECRET` DEVE ser forte e tratado como segredo (nunca no bundle; apenas
   variável de servidor/CI).
2. As migrações de banco (roles, grants, policies, função de login) DEVEM ser
   idempotentes e versionadas no diretório de migrations.
3. DEVE haver um procedimento de verificação pós-migração que confirme: (a)
   leitura pública OK com anon key; (b) escrita negada só com anon key; (c)
   escrita aceita com JWT admin.
4. QUANDO a migração for aplicada, ENTÃO a leitura pública NÃO DEVE sofrer
   interrupção perceptível.
5. O procedimento DEVE documentar como definir/rotacionar a senha admin (gerar o
   hash) sem expô-la em texto claro em arquivos versionados.
