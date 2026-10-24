-- ==========================================
-- Migration: Criação das tabelas do Mapa de Seres
-- Feature: VITE_MAPA_SERES
-- ATENÇÃO: NÃO RODAR EM PRODUÇÃO ATÉ A FEATURE SER APROVADA
-- ==========================================

-- Criação de tabela isolada
CREATE TABLE IF NOT EXISTS public.mapa_seres (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    coordenadas JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aqui entrarão as novas views e políticas de acesso (RLS) associadas apenas à nova tabela
