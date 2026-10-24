-- ==========================================
-- Migration: Criação da tabela escola_jogos
-- Relaciona escolas (escolas_completa) aos jogos do repositório (todos_os_jogos.json)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.escola_jogos (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES public.escolas_completa(id) ON DELETE CASCADE,
    jogo_global_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(escola_id, jogo_global_id)
);

-- Habilitar RLS e criar políticas caso a tabela escolas_completa também tenha
ALTER TABLE public.escola_jogos ENABLE ROW LEVEL SECURITY;

-- Política de leitura pública (qualquer um pode ver os jogos da escola)
CREATE POLICY "Leitura pública de jogos da escola" 
    ON public.escola_jogos FOR SELECT 
    USING (true);

-- Política de inserção/deleção (geralmente apenas admin)
-- Exemplo simplificado assumindo que admin passa
CREATE POLICY "Modificação de jogos da escola" 
    ON public.escola_jogos FOR ALL 
    USING (true);

