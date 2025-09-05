-- Script para verificar e criar a tabela legendas_fotos se necessário

-- Verificar se a tabela existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'legendas_fotos'
);

-- Se a tabela não existir, criar ela
CREATE TABLE IF NOT EXISTS legendas_fotos (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER NOT NULL,
    imagem_url TEXT NOT NULL,
    legenda TEXT,
    descricao_detalhada TEXT,
    autor_foto TEXT,
    data_foto DATE,
    categoria TEXT DEFAULT 'geral',
    tipo_foto TEXT DEFAULT 'escola',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_legendas_escola_id ON legendas_fotos(escola_id);
CREATE INDEX IF NOT EXISTS idx_legendas_imagem_url ON legendas_fotos(imagem_url);
CREATE INDEX IF NOT EXISTS idx_legendas_categoria ON legendas_fotos(categoria);

-- Liberar permissões
GRANT ALL ON TABLE legendas_fotos TO authenticated;
GRANT ALL ON TABLE legendas_fotos TO anon;
GRANT USAGE, SELECT ON SEQUENCE legendas_fotos_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE legendas_fotos_id_seq TO anon;

-- Verificar estrutura da tabela
\d legendas_fotos;

-- Testar inserção
INSERT INTO legendas_fotos (escola_id, imagem_url, legenda, categoria, tipo_foto) 
VALUES (999, 'teste/imagem.jpg', 'Legenda de teste', 'teste', 'escola')
ON CONFLICT DO NOTHING;

-- Verificar se a inserção funcionou
SELECT * FROM legendas_fotos WHERE escola_id = 999;

-- Limpar dados de teste
DELETE FROM legendas_fotos WHERE escola_id = 999;
