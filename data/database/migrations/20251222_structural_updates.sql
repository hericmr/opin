-- Migration: Structural updates for removing obsolete fields and adding consolidated info
-- Date: 2025-12-22

-- 1. Add new columns
ALTER TABLE escolas_completa ADD COLUMN IF NOT EXISTS "salas_vinculadas" TEXT;
ALTER TABLE escolas_completa ADD COLUMN IF NOT EXISTS "outras_informacoes" TEXT;

-- 2. Migrate data to 'outras_informacoes'
-- We concatenate existing values with labels, separated by double newlines.
UPDATE escolas_completa
SET "outras_informacoes" = TRIM(BOTH E'\n' FROM CONCAT_WS(
    E'\n\n',
    CASE 
        WHEN "Projetos em andamento" IS NOT NULL AND "Projetos em andamento" <> '' 
        THEN E'Projetos em andamento:\n' || "Projetos em andamento" 
        ELSE NULL 
    END,
    CASE 
        WHEN "Parcerias com universidades?" IS NOT NULL AND "Parcerias com universidades?" <> '' 
        THEN E'Parcerias com universidades:\n' || "Parcerias com universidades?" 
        ELSE NULL 
    END,
    CASE 
        WHEN "Ações com ONGs ou coletivos?" IS NOT NULL AND "Ações com ONGs ou coletivos?" <> '' 
        THEN E'Ações com ONGs ou coletivos:\n' || "Ações com ONGs ou coletivos?" 
        ELSE NULL 
    END,
    CASE 
        WHEN "Desejos da comunidade para a escola" IS NOT NULL AND "Desejos da comunidade para a escola" <> '' 
        THEN E'Desejos da comunidade:\n' || "Desejos da comunidade para a escola" 
        ELSE NULL 
    END
));

-- 3. Drop obsolete columns
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Acesso à água";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Linguas faladas";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Formação continuada oferecida";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Projetos em andamento";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Parcerias com universidades?";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Ações com ONGs ou coletivos?";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Desejos da comunidade para a escola";
