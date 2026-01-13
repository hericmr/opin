-- Arquivo: data/database/prod_permissions.sql

-- 1. Criação da Role Anônima (sem login, não pode conectar diretamente)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'web_anon') THEN
    CREATE ROLE web_anon NOLOGIN;
  END IF;
END
$$;

-- 2. Conceder uso do schema public
GRANT USAGE ON SCHEMA public TO web_anon;

-- 3. Conceder permissão de SELECT em todas as tabelas atuais
GRANT SELECT ON ALL TABLES IN SCHEMA public TO web_anon;

-- 4. Garantir permissões para futuras tabelas (Default Privileges)
-- Nota: Isso se aplica a tabelas criadas pelo usuário que rodar este script (geralmente postgres/superuser na init)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO web_anon;

-- Permissões de Sequências (necessário se for fazer inserts, mas aqui é read-only por enquanto)
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO web_anon;
