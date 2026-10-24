-- ==========================================
-- Migration: login do admin no servidor, sem papéis novos no Postgres
--
-- O PostgREST continua conectando e operando como opin_user (anônimo), que não
-- tem CREATEROLE em produção. A proteção fica em privado.verificar_jwt
-- (PGRST_DB_PRE_REQUEST), que roda antes de cada requisição:
--   - leitura (GET/HEAD/OPTIONS) e POST /rpc/login: liberados;
--   - qualquer outra escrita: exige JWT com "admin": true, emitido por
--     public.login() (8h) e assinado com o JWT_SECRET.
--
-- Requer no PostgREST:
--   PGRST_DB_PRE_REQUEST=privado.verificar_jwt
--   PGRST_APP_SETTINGS_JWT_SECRET=<mesmo valor de PGRST_JWT_SECRET>
--
-- Idempotente: pode ser executada mais de uma vez.
-- A senha do admin NÃO fica aqui; defina com (psql):
--   INSERT INTO privado.admin_usuarios (username, senha_hash)
--   VALUES ('admin', privado.crypt('<senha>', privado.gen_salt('bf')))
--   ON CONFLICT (username) DO UPDATE SET senha_hash = EXCLUDED.senha_hash;
-- ==========================================

-- Schema fora de db-schemas: não é exposto pelo PostgREST
CREATE SCHEMA IF NOT EXISTS privado;
REVOKE ALL ON SCHEMA privado FROM PUBLIC;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA privado;

-- ─── Usuários do admin ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS privado.admin_usuarios (
  username   text PRIMARY KEY,
  senha_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── JWT HS256 ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION privado.base64url(data bytea) RETURNS text
LANGUAGE sql IMMUTABLE AS $$
  SELECT translate(rtrim(replace(encode(data, 'base64'), E'\n', ''), '='), '+/', '-_')
$$;

CREATE OR REPLACE FUNCTION privado.jwt_sign(payload json, secret text) RETURNS text
LANGUAGE sql IMMUTABLE SET search_path = privado, pg_temp AS $$
  WITH p AS (
    SELECT base64url(convert_to('{"alg":"HS256","typ":"JWT"}', 'utf8')) || '.' ||
           base64url(convert_to(payload::text, 'utf8')) AS unsigned
  )
  SELECT unsigned || '.' || base64url(hmac(convert_to(unsigned, 'utf8'), convert_to(secret, 'utf8'), 'sha256'))
  FROM p
$$;

-- ─── Login (POST /rest/v1/rpc/login) ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.login(senha text, usuario text DEFAULT 'admin') RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = privado, pg_temp AS $$
DECLARE
  u privado.admin_usuarios;
  segredo text := current_setting('app.settings.jwt_secret', true);
BEGIN
  IF segredo IS NULL OR length(segredo) < 32 THEN
    RAISE EXCEPTION 'app.settings.jwt_secret não configurado';
  END IF;

  SELECT * INTO u FROM privado.admin_usuarios WHERE username = usuario;
  IF NOT FOUND OR u.senha_hash <> crypt(senha, u.senha_hash) THEN
    -- 28P01 → PostgREST responde 403
    RAISE EXCEPTION 'Senha incorreta' USING ERRCODE = '28P01';
  END IF;

  -- Sem claim "role": o PostgREST segue como opin_user; quem libera a escrita
  -- é privado.verificar_jwt, ao ver "admin": true.
  RETURN json_build_object(
    'token', jwt_sign(json_build_object(
      'admin', true,
      'username', u.username,
      'iat', extract(epoch FROM now())::bigint,
      'exp', extract(epoch FROM now() + interval '8 hours')::bigint
    ), segredo),
    'username', u.username,
    'role', 'admin'
  );
END $$;

REVOKE ALL ON FUNCTION public.login(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.login(text, text) TO CURRENT_USER;

-- ─── Verificação antes de cada requisição ───────────────────────────────────
-- PGRST_DB_PRE_REQUEST=privado.verificar_jwt
CREATE OR REPLACE FUNCTION privado.verificar_jwt() RETURNS void
LANGUAGE plpgsql STABLE AS $$
DECLARE
  claims json := nullif(current_setting('request.jwt.claims', true), '')::json;
  metodo text := current_setting('request.method', true);
  caminho text := current_setting('request.path', true);
BEGIN
  -- Só tokens sem "role" (admin) ou com o próprio papel de conexão (anon key
  -- antiga, role opin_user) são aceitos; nenhum token troca de papel.
  IF claims ->> 'role' IS NOT NULL AND claims ->> 'role' <> session_user THEN
    RAISE EXCEPTION 'Token não autorizado' USING ERRCODE = '42501';
  END IF;

  IF metodo IN ('GET', 'HEAD', 'OPTIONS') THEN
    RETURN;
  END IF;
  IF metodo = 'POST' AND caminho = '/rpc/login' THEN
    RETURN;
  END IF;
  IF coalesce(claims ->> 'admin', '') = 'true' THEN
    RETURN;
  END IF;

  -- 42501 (insufficient_privilege) sem JWT → PostgREST responde 401
  RAISE EXCEPTION 'Escrita exige login de admin' USING ERRCODE = '42501';
END $$;

REVOKE ALL ON FUNCTION privado.verificar_jwt() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION privado.verificar_jwt() TO CURRENT_USER;

-- Recarregar o schema cache do PostgREST
NOTIFY pgrst, 'reload schema';
