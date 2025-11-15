-- Migration: Add imagens_desenhos column to escolas_completa table
-- This column stores an array of image URLs for the "Desenhos" (Drawings) section
-- Similar to how imagem_header stores a single header image URL

-- Add the column if it doesn't exist
ALTER TABLE escolas_completa 
ADD COLUMN IF NOT EXISTS imagens_desenhos TEXT;

-- Add a comment to document the column purpose
COMMENT ON COLUMN escolas_completa.imagens_desenhos IS 
'JSON array of image URLs selected for the Drawings section. Stored as JSON string. Example: ["url1", "url2", "url3"]';

-- Optional: Set default value to NULL (already default, but explicit is better)
ALTER TABLE escolas_completa 
ALTER COLUMN imagens_desenhos SET DEFAULT NULL;

