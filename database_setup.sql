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

-- Script para adicionar campos de endereço detalhado à tabela escolas_completa
-- Execute este script no SQL Editor do Supabase

-- Adicionar novos campos de endereço
ALTER TABLE escolas_completa 
ADD COLUMN IF NOT EXISTS logradouro TEXT,
ADD COLUMN IF NOT EXISTS numero TEXT,
ADD COLUMN IF NOT EXISTS complemento TEXT,
ADD COLUMN IF NOT EXISTS bairro TEXT,
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'SP';

-- Adicionar comentários para documentação
COMMENT ON COLUMN escolas_completa.logradouro IS 'Nome da rua, avenida, etc.';
COMMENT ON COLUMN escolas_completa.numero IS 'Número do endereço';
COMMENT ON COLUMN escolas_completa.complemento IS 'Complemento do endereço (apartamento, sala, etc.)';
COMMENT ON COLUMN escolas_completa.bairro IS 'Nome do bairro';
COMMENT ON COLUMN escolas_completa.cep IS 'CEP do endereço';
COMMENT ON COLUMN escolas_completa.estado IS 'Estado (padrão: SP)';

-- Criar função para gerar endereço completo a partir dos campos separados
CREATE OR REPLACE FUNCTION gerar_endereco_completo()
RETURNS TRIGGER AS $$
BEGIN
    -- Montar endereço completo a partir dos campos separados
    NEW."Endereço" = COALESCE(
        TRIM(
            CONCAT_WS(', ',
                NULLIF(NEW.logradouro, ''),
                NULLIF(NEW.numero, ''),
                NULLIF(NEW.complemento, ''),
                NULLIF(NEW.bairro, ''),
                NULLIF(NEW.municipio, ''),
                NULLIF(NEW.estado, ''),
                NULLIF(NEW.cep, '')
            )
        ),
        NEW."Endereço" -- Manter endereço original se não houver campos separados
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar automaticamente o campo "Endereço"
DROP TRIGGER IF EXISTS trigger_gerar_endereco_completo ON escolas_completa;
CREATE TRIGGER trigger_gerar_endereco_completo
    BEFORE INSERT OR UPDATE ON escolas_completa
    FOR EACH ROW
    EXECUTE FUNCTION gerar_endereco_completo();

-- Atualizar registros existentes (opcional - execute apenas se quiser preencher os novos campos)
-- UPDATE escolas_completa 
-- SET logradouro = SPLIT_PART("Endereço", ',', 1),
--     numero = SPLIT_PART("Endereço", ',', 2),
--     bairro = SPLIT_PART("Endereço", ',', 3)
-- WHERE "Endereço" IS NOT NULL AND "Endereço" != '';

-- Verificar se as alterações foram aplicadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'escolas_completa' 
AND column_name IN ('logradouro', 'numero', 'complemento', 'bairro', 'cep', 'estado')
ORDER BY column_name;

-- Script de migração para dados existentes (opcional)
-- Execute este script apenas se quiser tentar extrair informações dos endereços existentes

-- Função para tentar extrair informações do endereço existente
CREATE OR REPLACE FUNCTION extrair_info_endereco(endereco_completo TEXT)
RETURNS TABLE (
    logradouro_ext TEXT,
    numero_ext TEXT,
    bairro_ext TEXT
) AS $$
BEGIN
    -- Tentar extrair logradouro (primeira parte antes da vírgula)
    logradouro_ext := TRIM(SPLIT_PART(endereco_completo, ',', 1));
    
    -- Tentar extrair número (segunda parte, se contiver números)
    numero_ext := TRIM(SPLIT_PART(endereco_completo, ',', 2));
    IF numero_ext ~ '^[0-9]+$' THEN
        -- Se a segunda parte é apenas números, é o número
    ELSE
        -- Tentar encontrar número no logradouro
        numero_ext := (REGEXP_MATCH(logradouro_ext, '([0-9]+)'))[1];
        IF numero_ext IS NOT NULL THEN
            logradouro_ext := TRIM(REGEXP_REPLACE(logradouro_ext, '[0-9]+', ''));
        END IF;
    END IF;
    
    -- Tentar extrair bairro (terceira parte)
    bairro_ext := TRIM(SPLIT_PART(endereco_completo, ',', 3));
    
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Atualizar registros existentes com informações extraídas
-- DESCOMENTE AS LINHAS ABAIXO SE QUISER EXECUTAR A MIGRAÇÃO
/*
UPDATE escolas_completa 
SET 
    logradouro = info.logradouro_ext,
    numero = info.numero_ext,
    bairro = info.bairro_ext
FROM (
    SELECT 
        id,
        (extrair_info_endereco("Endereço")).logradouro_ext,
        (extrair_info_endereco("Endereço")).numero_ext,
        (extrair_info_endereco("Endereço")).bairro_ext
    FROM escolas_completa 
    WHERE "Endereço" IS NOT NULL AND "Endereço" != ''
) AS info
WHERE escolas_completa.id = info.id;
*/

-- Limpar função após uso
-- DROP FUNCTION IF EXISTS extrair_info_endereco(TEXT); 