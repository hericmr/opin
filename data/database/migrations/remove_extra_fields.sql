-- Migration: Phase 2 Structural updates - Removing extra fields
-- Date: 2025-12-22
-- Fields to remove: "Tem coleta de lixo?", "Modo de acesso à escola", "diferenciada" (merenda)

ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Tem coleta de lixo?";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "Modo de acesso à escola";
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "diferenciada";

-- Also check for "merenda_diferenciada" if it exists (some inconsistent naming might exist)
ALTER TABLE escolas_completa DROP COLUMN IF EXISTS "merenda_diferenciada";
