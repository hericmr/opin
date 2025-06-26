-- Script para verificar e corrigir a estrutura da tabela legendas_fotos
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'legendas_fotos'
) as tabela_existe;

-- 2. Verificar estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'legendas_fotos'
ORDER BY ordinal_position;

-- 3. Criar a tabela se não existir
CREATE TABLE IF NOT EXISTS legendas_fotos (
    id BIGSERIAL PRIMARY KEY,
    escola_id BIGINT NOT NULL,
    imagem_url TEXT NOT NULL,
    legenda TEXT,
    descricao_detalhada TEXT,
    autor_foto TEXT,
    data_foto DATE,
    categoria TEXT DEFAULT 'geral',
    tipo_foto TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Adicionar coluna tipo_foto se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'legendas_fotos' 
        AND column_name = 'tipo_foto'
    ) THEN
        ALTER TABLE legendas_fotos ADD COLUMN tipo_foto TEXT;
    END IF;
END $$;

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_legendas_fotos_escola_id ON legendas_fotos(escola_id);
CREATE INDEX IF NOT EXISTS idx_legendas_fotos_imagem_url ON legendas_fotos(imagem_url);
CREATE INDEX IF NOT EXISTS idx_legendas_fotos_ativo ON legendas_fotos(ativo);
CREATE INDEX IF NOT EXISTS idx_legendas_fotos_tipo_foto ON legendas_fotos(tipo_foto);

-- 6. Verificar dados existentes
SELECT COUNT(*) as total_legendas FROM legendas_fotos;
SELECT * FROM legendas_fotos LIMIT 5;

-- 7. Verificar se há problemas de constraint
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    tc.constraint_type
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'legendas_fotos';

-- 8. Verificar RLS (Row Level Security)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'legendas_fotos';

-- 9. Habilitar RLS se necessário
ALTER TABLE legendas_fotos ENABLE ROW LEVEL SECURITY;

-- 10. Criar política de acesso se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'legendas_fotos' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        CREATE POLICY "Enable read access for all users" ON legendas_fotos
        FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'legendas_fotos' 
        AND policyname = 'Enable insert for authenticated users only'
    ) THEN
        CREATE POLICY "Enable insert for authenticated users only" ON legendas_fotos
        FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'legendas_fotos' 
        AND policyname = 'Enable update for authenticated users only'
    ) THEN
        CREATE POLICY "Enable update for authenticated users only" ON legendas_fotos
        FOR UPDATE USING (auth.role() = 'authenticated');
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'legendas_fotos' 
        AND policyname = 'Enable delete for authenticated users only'
    ) THEN
        CREATE POLICY "Enable delete for authenticated users only" ON legendas_fotos
        FOR DELETE USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- 11. Verificar políticas criadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'legendas_fotos'; 