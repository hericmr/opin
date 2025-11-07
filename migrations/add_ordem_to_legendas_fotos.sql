-- Migration: Add ordem field to legendas_fotos table
-- This migration adds an 'ordem' (order) field to the legendas_fotos table
-- to allow custom ordering of images in the information panel.

-- Check if the column already exists before adding it
DO $$ 
BEGIN
    -- Add ordem column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'legendas_fotos' 
        AND column_name = 'ordem'
    ) THEN
        ALTER TABLE legendas_fotos 
        ADD COLUMN ordem INTEGER DEFAULT NULL;
        
        -- Create an index on ordem for better query performance
        CREATE INDEX IF NOT EXISTS idx_legendas_fotos_ordem 
        ON legendas_fotos(escola_id, tipo_foto, ordem) 
        WHERE ordem IS NOT NULL;
        
        RAISE NOTICE 'Column "ordem" added to legendas_fotos table';
    ELSE
        RAISE NOTICE 'Column "ordem" already exists in legendas_fotos table';
    END IF;
END $$;

-- Optional: Set default ordem values for existing records based on created_at
-- This ensures existing images have an order
UPDATE legendas_fotos
SET ordem = subquery.row_number
FROM (
    SELECT 
        id,
        ROW_NUMBER() OVER (
            PARTITION BY escola_id, tipo_foto 
            ORDER BY created_at ASC
        ) as row_number
    FROM legendas_fotos
    WHERE ordem IS NULL
) AS subquery
WHERE legendas_fotos.id = subquery.id;

