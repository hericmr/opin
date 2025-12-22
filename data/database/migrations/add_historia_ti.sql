-- Migration: Phase 3 - Add Indigenous Land History field
-- Date: 2025-12-22

ALTER TABLE escolas_completa ADD COLUMN IF NOT EXISTS "historia_terra_indigena" TEXT;
