# Design — Autenticação admin no backend (JWT via PostgREST)

## Visão geral

A autorização de escrita passa do cliente para o banco de dados, usando o
suporte nativo a JWT do PostgREST. Fluxo-alvo:

```
┌──────────┐   POST /rest/v1/rpc/login {senha}      ┌───────────┐
│  Front   │ ─────────────────────────────────────► │ PostgREST │
│ (admin)  │                                         │  (anon)   │
│          │ ◄───────────────────────────────────── │           │
└──────────┘   { token: <JWT assinado role=admin> }  └─────┬─────┘
     │                                                      │ SQL (SECURITY DEFINER)
     │ guarda JWT                                           ▼
     │                                                ┌───────────┐
     │  PATCH/POST/DELETE  Authorization: Bearer JWT  │  Postgres │
     └──────────────────────────────────────────────►│  login()  │ verifica hash
                                                       │  RLS      │ role=opin_admin → escrita
                                                       └───────────┘
```

- Leitura pública: segue com o role anônimo (`PGRST_DB_ANON_ROLE`), somente
  `SELECT`.
- Login: função SQL `public.login(senha)` valida o hash (bcrypt/`pgcrypto`) e
  retorna um JWT assinado com `JWT_SECRET`, claim `role = opin_admin`.
- Escrita: PostgREST valida a assinatura do JWT, assume o role `opin_admin`, e a
  RLS libera a operação. Sem JWT (só anon key), a escrita é negada.

Decisão-chave: **Opção A** (RPC no PostgREST), reutilizando PostgREST +
`JWT_SECRET` já presentes no `docker-compose`, sem novo serviço. Modelo de senha
única.

## Componentes e mudanças

### 1. Banco de dados (migrations idempotentes)

Novas migrations em `data/database/migrations/` (seguindo a numeração atual, a
partir de `005_`):

**a) Extensões e roles**
- Habilitar `pgcrypto` (para `crypt()`/`gen_salt()` e, se preciso, geração do
  JWT) e garantir função de assinatura JWT (`sign()` do padrão PostgREST, via
  `pgjwt` ou implementação equivalente com `hmac`).
- Criar role `opin_admin NOLOGIN` com `GRANT` de `INSERT/UPDATE/DELETE` (e
  `SELECT`) nas tabelas de conteúdo e `USAGE/SELECT` nas sequências.
- Garantir que o role anônimo (`usu_opin`/`web_anon`, conforme
  `PGRST_DB_ANON_ROLE`) permaneça **somente** com `SELECT` (reafirma a 004).
- O `authenticator`/role de conexão do PostgREST precisa poder assumir
  `opin_admin` (`GRANT opin_admin TO <role_conexao>`), para que o `SET ROLE` via
  JWT funcione.

**b) Armazenamento da credencial**
- Tabela `admin_credential` (ou linha em `configuracao_global`) guardando o
  **hash** da senha (bcrypt via `crypt(senha, gen_salt('bf'))`). Nunca texto
  claro.
- A tabela NÃO deve ser legível pelo role anônimo (sem `SELECT` para anon).

**c) Função de login**
```sql
CREATE OR REPLACE FUNCTION public.login(senha text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER            -- roda como owner, enxerga admin_credential
AS $$
DECLARE
  _hash text;
  _token text;
BEGIN
  SELECT password_hash INTO _hash FROM admin_credential LIMIT 1;
  IF _hash IS NULL OR _hash <> crypt(senha, _hash) THEN
    RAISE insufficient_privilege USING message = 'credenciais inválidas';
  END IF;

  _token := sign(
    json_build_object(
      'role', 'opin_admin',
      'exp',  extract(epoch from now())::integer + 60*60*8   -- 8h
    ),
    current_setting('app.jwt_secret')   -- ver nota de configuração
  );
  RETURN json_build_object('token', _token);
END;
$$;

-- Expor só o necessário ao anônimo:
REVOKE ALL ON FUNCTION public.login(text) FROM public;
GRANT EXECUTE ON FUNCTION public.login(text) TO <role_anon>;
```
Notas:
- O segredo para assinar precisa estar acessível à função. Duas abordagens: (i)
  configurar `app.jwt_secret` no banco (`ALTER DATABASE ... SET app.jwt_secret`)
  com o mesmo valor de `PGRST_JWT_SECRET`; (ii) usar a extensão `pgjwt`. Deve
  bater exatamente com `JWT_SECRET` para o PostgREST validar.
- `SECURITY DEFINER` + `REVOKE/GRANT` restritos garantem que o anônimo só executa
  a função, sem ler o hash.
- Falha com `insufficient_privilege` → PostgREST responde erro genérico (não
  distingue usuário/senha).

**d) Policies de RLS**
- Substituir `FOR ALL USING (true)` por:
  - `FOR SELECT USING (true)` (leitura pública — manter).
  - Policies de escrita restritas ao role `opin_admin`
    (`TO opin_admin USING (true) WITH CHECK (true)`), ou GRANTs de tabela a
    `opin_admin` sem policy permissiva para anon.
- Aplicar nas tabelas hoje com `FOR ALL`: `escolas_completa`,
  `historias_professor`, `documentos_escola`, `legendas_fotos`, `imagens_escola`,
  `imagens_professores`, `fontes_dados`, `configuracao_global`, `titulos_videos`,
  `versoes_dados`.

### 2. PostgREST (configuração)

- `PGRST_JWT_SECRET` já está setado (`${JWT_SECRET}`) em ambos os composes —
  manter e garantir valor forte.
- Confirmar que o role de conexão do PostgREST pode `SET ROLE opin_admin`
  (grant feito na migration).
- Nenhum serviço novo. O endpoint `rpc/login` surge automaticamente a partir da
  função SQL.

### 3. Front — `authService.js`

Reescrever para falar com o backend:
- `authenticate(senha)`: `POST ${BASE}/rest/v1/rpc/login` com `{ senha }`; em
  sucesso, retorna `{ success, token }` com o **JWT** do backend. Remove a
  comparação com `VITE_ADMIN_PASSWORD` e o fallback `admin123`.
- `setToken/getToken/logout`: mantêm o armazenamento (chave
  `opin_admin_token`), agora guardando o JWT.
- `verifyToken`: decodifica o **payload** do JWT (base64url do meio) apenas para
  ler `exp` e exibir estado de sessão. Importante: isso é só uma dica de UI; a
  validação real é do backend. Documentar que o cliente não "confia" no token —
  quem decide é o Postgres via assinatura.
- `isAuthenticated`/`isTokenExpiringSoon`/`refreshTokenIfNeeded`: baseiam-se no
  `exp` do JWT. Renovação = refazer login (não há refresh token nesta opção);
  `refreshTokenIfNeeded` pode apenas sinalizar expiração próxima para a UI pedir
  novo login.

### 4. Front — `dbClient.js`

Hoje `_headers` é fixado no construtor com o anon key. Mudança:
- Resolver o token **no momento da requisição** (`_run`), não na construção:
  - Ler o JWT admin de `localStorage` (via `authService.getToken()` ou leitura
    direta da chave, evitando ciclo de import).
  - Se houver JWT válido (não expirado): `Authorization: Bearer <jwt>` +
    `apikey: <anon>` (o `apikey` pode seguir sendo o anon; o `Authorization`
    manda no role).
  - Se não houver: `Authorization: Bearer <anon>` + `apikey: <anon>` (atual).
- Aplicar a mesma resolução às operações da `StorageBucket` (quando/se o storage
  for habilitado), para consistência — fora do escopo funcional agora.
- Garantir que leitura pública não exija token (não enviar JWT quando não há).

### 5. Infra — remover `VITE_ADMIN_PASSWORD`

- `Dockerfile`: remover `ARG VITE_ADMIN_PASSWORD` e `ENV VITE_ADMIN_PASSWORD`.
- `docker-compose.prod.yml` e `docker-compose.yml`: remover a build-arg
  `VITE_ADMIN_PASSWORD` do serviço `front`.
- CI/CD (GitLab Variables): remover `VITE_ADMIN_PASSWORD`. Manter `JWT_SECRET`
  (forte) e `VITE_API_ANON_KEY`.

## Modelo de dados

`admin_credential`:
| coluna          | tipo        | observação                              |
|-----------------|-------------|-----------------------------------------|
| id              | int PK      | linha única                             |
| password_hash   | text        | bcrypt (`crypt`+`gen_salt('bf')`)       |
| updated_at      | timestamptz | auditoria simples                       |

Sem `SELECT` para o role anônimo. Alterada apenas por owner/admin via SQL.

## Tratamento de erros

- Login com senha errada → função levanta `insufficient_privilege` → PostgREST
  retorna 4xx genérico; front mostra "Senha incorreta" sem detalhar.
- Escrita sem JWT/expirado → PostgREST/Postgres negam (401/403 ou erro de RLS);
  `dbClient` propaga `error`; painel detecta e pede novo login (Req. 5.2).
- Divergência de `JWT_SECRET` entre função e PostgREST → tokens válidos seriam
  rejeitados; a verificação pós-migração deve cobrir esse caso explicitamente.

## Estratégia de teste e verificação

Verificação manual/scriptada pós-migração (documentada na tarefa final):
1. `SELECT` público com anon key → 200 com dados.
2. `POST`/`PATCH`/`DELETE` só com anon key → negado.
3. `rpc/login` com senha correta → retorna JWT; com senha errada → erro genérico.
4. `PATCH` com `Authorization: Bearer <jwt>` → aceito.
5. JWT expirado → escrita negada.
6. Bundle de produção não contém a senha (`grep` no build) e não há request que
   dependa de `VITE_ADMIN_PASSWORD`.

Testes de código:
- Unit no `authService` (mock de `fetch` para `rpc/login`: sucesso/erro/expiração).
- Unit no `dbClient` garantindo seleção de header (JWT quando presente, anon
  quando ausente) e resolução no momento da requisição.

Como não há Node/npm na máquina local, build e testes devem ser validados em
ambiente com Node 20+ ou via container `node:20-alpine` (mesmo do build Docker).

## Decisões e tradeoffs

- **RPC no PostgREST (A) vs serviço dedicado (B):** A tem menor custo
  operacional e reaproveita o que existe; B traria usuários/bcrypt mais
  flexíveis e auditoria, ao custo de mais um serviço. Escolhida A pelo contexto.
- **Senha única:** simplifica, mas não distingue administradores. Aceitável
  agora; migração para B/C fica como evolução.
- **Armazenamento do JWT no cliente (`localStorage`):** conveniente e compatível
  com o código atual, porém suscetível a XSS. Alternativa: cookie `HttpOnly`
  (exige o backend setar o cookie; PostgREST não faz isso nativamente). Mantido
  `localStorage` nesta opção, documentando o tradeoff; mitigar XSS com a CSP já
  existente e sanitização (DOMPurify já está no projeto).
- **Sem refresh token:** expiração força novo login. Simplicidade sobre
  conveniência; expiração de 8h equilibra os dois.
