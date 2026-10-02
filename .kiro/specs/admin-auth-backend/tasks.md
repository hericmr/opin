# Plano de implementação — Autenticação admin no backend (JWT via PostgREST)

- [ ] 1. Preparar roles, grants e extensões no banco (migration idempotente)
  - Criar migration `005_admin_auth_roles.sql`
  - Habilitar `pgcrypto` (e extensão de assinatura JWT: `pgjwt` ou função `sign` equivalente)
  - Criar role `opin_admin NOLOGIN`
  - `GRANT INSERT/UPDATE/DELETE/SELECT` em todas as tabelas de conteúdo e `USAGE/SELECT` nas sequências para `opin_admin`
  - `GRANT opin_admin TO <role_de_conexao_do_postgrest>` (permitir `SET ROLE`)
  - Reafirmar que o role anônimo tem apenas `SELECT` (consistente com 004)
  - _Requisitos: 3.1, 3.2, 6.2_

- [ ] 2. Criar armazenamento seguro da credencial admin
  - Na mesma migration (ou `006_admin_credential.sql`), criar tabela `admin_credential` (hash bcrypt, `updated_at`)
  - Garantir que o role anônimo NÃO tenha `SELECT` nessa tabela
  - Documentar/parametrizar como inserir o hash inicial sem expor a senha em texto claro em arquivo versionado (ex.: `psql` interativo usando `crypt(:senha, gen_salt('bf'))`)
  - _Requisitos: 2.2, 6.5_

- [ ] 3. Implementar a função de login que emite JWT
  - Criar `public.login(senha text) RETURNS json` com `SECURITY DEFINER`
  - Verificar `crypt(senha, password_hash)`; em falha, `RAISE insufficient_privilege` (erro genérico)
  - Assinar JWT com `role='opin_admin'` e `exp` (8h) usando o mesmo segredo do `PGRST_JWT_SECRET`
  - `REVOKE ALL ... FROM public` e `GRANT EXECUTE ... TO <role_anon>`
  - Configurar o segredo acessível à função (`ALTER DATABASE ... SET app.jwt_secret` ou `pgjwt`), igual a `JWT_SECRET`
  - _Requisitos: 2.1, 2.3, 2.4, 2.5_

- [ ] 4. Endurecer as policies de RLS (leitura pública, escrita só admin)
  - Criar migration `007_rls_admin_write.sql`
  - Para cada tabela com `FOR ALL USING (true)` hoje: remover a policy permissiva e criar policy de escrita restrita a `opin_admin` (`TO opin_admin ... WITH CHECK (true)`)
  - Manter `FOR SELECT USING (true)` (leitura pública)
  - Tabelas: escolas_completa, historias_professor, documentos_escola, legendas_fotos, imagens_escola, imagens_professores, fontes_dados, configuracao_global, titulos_videos, versoes_dados
  - _Requisitos: 3.3, 3.4, 3.5, 3.6_

- [ ] 5. Reescrever `authService.js` para usar o backend
  - `authenticate(senha)` chama `POST /rest/v1/rpc/login` e retorna o JWT; remover comparação com `VITE_ADMIN_PASSWORD` e o fallback `admin123`
  - Ajustar `verifyToken`/`isAuthenticated`/`isTokenExpiringSoon` para ler `exp` do JWT (apenas dica de UI)
  - `refreshTokenIfNeeded` sinaliza expiração próxima para a UI pedir novo login (sem refresh token)
  - Remover a geração de token Base64 caseiro
  - _Requisitos: 1.3, 4.4, 5.1, 5.3_

- [ ] 6. Ajustar `dbClient.js` para enviar o JWT nas requisições
  - Resolver o token no momento da requisição (`_run`), não no construtor
  - Com JWT válido: `Authorization: Bearer <jwt>` + `apikey: <anon>`; sem JWT: usar anon (comportamento atual)
  - Garantir que leitura pública não envie JWT quando não houver sessão
  - _Requisitos: 4.1, 4.2, 4.3_

- [ ] 7. Tratar expiração e erros de autorização no painel
  - Detectar 401/403 (ou erro de RLS) em operações de escrita e orientar novo login
  - Garantir que logout remove o JWT e volta ao estado anônimo
  - _Requisitos: 5.2, 5.3_

- [ ] 8. Remover `VITE_ADMIN_PASSWORD` da infraestrutura
  - `Dockerfile`: remover `ARG`/`ENV VITE_ADMIN_PASSWORD`
  - `docker-compose.prod.yml` e `docker-compose.yml`: remover a build-arg do serviço `front`
  - Documentar remoção da variável no CI/CD (GitLab Variables)
  - _Requisitos: 1.1, 1.2, 6.1_

- [ ] 9. Testes automatizados
  - Unit `authService`: mock de `fetch` para `rpc/login` (sucesso, senha errada, token expirado)
  - Unit `dbClient`: seleção de header (JWT vs anon) e resolução no momento da requisição
  - Rodar via container `node:20-alpine` (sem Node local)
  - _Requisitos: 2.4, 4.1, 4.2, 5.1_

- [ ] 10. Verificação de ponta a ponta e documentação de migração
  - Script/checklist: (a) SELECT público OK com anon; (b) escrita negada só com anon; (c) login retorna JWT; (d) escrita aceita com JWT; (e) JWT expirado negado; (f) `JWT_SECRET` da função == PostgREST
  - Confirmar que o bundle de produção não contém a senha (`grep` no build)
  - Documentar ordem de aplicação das migrations e procedimento de rotação da senha
  - _Requisitos: 6.3, 6.4, 1.1_
```
