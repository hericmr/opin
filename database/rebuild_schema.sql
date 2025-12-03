-- Drop all tables to ensure clean state
DROP TABLE IF EXISTS fontes_dados CASCADE;
DROP TABLE IF EXISTS imagens_professores CASCADE;
DROP TABLE IF EXISTS imagens_escola CASCADE;
DROP TABLE IF EXISTS legendas_fotos CASCADE;
DROP TABLE IF EXISTS documentos_escola CASCADE;
DROP TABLE IF EXISTS historias_professor CASCADE;
DROP TABLE IF EXISTS escolas_completa CASCADE;
DROP TABLE IF EXISTS escola_images CASCADE;
DROP TABLE IF EXISTS professor_images CASCADE;

-- Create escolas_completa with exact columns from dump
CREATE TABLE escolas_completa (
    id SERIAL PRIMARY KEY,
    "Escola" TEXT,
    "Município" TEXT,
    "Endereço" TEXT,
    "Terra Indigena (TI)" TEXT,
    "Escola Estadual ou Municipal" TEXT,
    "Parcerias com o município" TEXT,
    "Diretoria de Ensino" TEXT,
    "Povos indigenas" TEXT,
    "Linguas faladas" TEXT,
    "Ano de criação da escola" TEXT,
    "Modalidade de Ensino/turnos de funcionamento" TEXT,
    "Numero de alunos" TEXT,
    "Espaço escolar e estrutura" TEXT,
    "Acesso à água" TEXT,
    "Tem coleta de lixo?" TEXT,
    "Acesso à internet" TEXT,
    "Equipamentos Tecs" TEXT,
    "Modo de acesso à escola" TEXT,
    "Gestão/Nome" TEXT,
    "Outros funcionários" TEXT,
    "Quantidade de professores indígenas" TEXT,
    "Quantidade de professores não indígenas" TEXT,
    "Professores falam a língua indígena?" TEXT,
    "Formação dos professores" TEXT,
    "Formação continuada oferecida" TEXT,
    "PPP elaborado com a comunidade?" TEXT,
    "Material pedagógico não indígena" TEXT,
    "Material pedagógico indígena" TEXT,
    "Práticas pedagógicas indígenas" TEXT,
    "Formas de avaliação" TEXT,
    "Projetos em andamento" TEXT,
    "Parcerias com universidades?" TEXT,
    "Ações com ONGs ou coletivos?" TEXT,
    "Desejos da comunidade para a escola" TEXT,
    "Escola utiliza redes sociais?" TEXT,
    "Links das redes sociais" TEXT,
    "historia_da_escola" TEXT,
    "Latitude" NUMERIC,
    "Longitude" NUMERIC,
    "link_para_videos" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "estado" TEXT DEFAULT 'SP',
    "turnos_funcionamento" TEXT,
    "diferenciada" TEXT,
    "imagem_header" TEXT,
    "cards_visibilidade" TEXT,
    "imagens_desenhos" TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create historias_professor
CREATE TABLE historias_professor (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id),
    nome_professor TEXT,
    historia TEXT,
    ordem INTEGER DEFAULT 1,
    ativo BOOLEAN DEFAULT true,
    foto_rosto TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create documentos_escola (UUID id)
CREATE TABLE documentos_escola (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escola_id INTEGER REFERENCES escolas_completa(id),
    titulo TEXT,
    link_pdf TEXT,
    autoria TEXT,
    tipo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legendas_fotos
CREATE TABLE legendas_fotos (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id),
    imagem_url TEXT,
    legenda TEXT,
    descricao_detalhada TEXT,
    autor_foto TEXT,
    data_foto TEXT,
    categoria TEXT,
    ativo BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tipo_foto TEXT,
    ordem INTEGER
);

-- Create imagens_escola
CREATE TABLE imagens_escola (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id),
    url TEXT,
    descricao TEXT,
    tipo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create imagens_professores
CREATE TABLE imagens_professores (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id),
    imagem_url TEXT,
    nome_arquivo TEXT,
    autor TEXT,
    data_upload TIMESTAMP WITH TIME ZONE,
    ativo BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fontes_dados (UUID id)
CREATE TABLE fontes_dados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT,
    descricao TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE escolas_completa ENABLE ROW LEVEL SECURITY;
ALTER TABLE historias_professor ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_escola ENABLE ROW LEVEL SECURITY;
ALTER TABLE legendas_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens_escola ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagens_professores ENABLE ROW LEVEL SECURITY;
ALTER TABLE fontes_dados ENABLE ROW LEVEL SECURITY;

-- Create Policies (Public Read, Admin All)
CREATE POLICY "Permitir leitura pública" ON escolas_completa FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON historias_professor FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON documentos_escola FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON legendas_fotos FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON imagens_escola FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON imagens_professores FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON fontes_dados FOR SELECT USING (true);

CREATE POLICY "Permitir operações admin" ON escolas_completa FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON historias_professor FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON documentos_escola FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON legendas_fotos FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON imagens_escola FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON imagens_professores FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON fontes_dados FOR ALL USING (true);

-- Storage Buckets


-- Create configuracao_global
CREATE TABLE configuracao_global (
    id SERIAL PRIMARY KEY,
    chave TEXT,
    valor JSONB,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create titulos_videos
CREATE TABLE titulos_videos (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id),
    video_url TEXT,
    titulo TEXT,
    descricao TEXT,
    duracao TEXT,
    plataforma TEXT,
    categoria TEXT,
    ativo BOOLEAN,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create versoes_dados
CREATE TABLE versoes_dados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_tabela TEXT,
    chave_linha TEXT,
    fonte_id UUID REFERENCES fontes_dados(id),
    autor TEXT,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT NOW(),
    nome_campo TEXT
);

-- Enable RLS for new tables
ALTER TABLE configuracao_global ENABLE ROW LEVEL SECURITY;
ALTER TABLE titulos_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE versoes_dados ENABLE ROW LEVEL SECURITY;

-- Policies for new tables (Public Read, Admin All)
CREATE POLICY "Permitir leitura pública" ON configuracao_global FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON titulos_videos FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON versoes_dados FOR SELECT USING (true);

CREATE POLICY "Permitir operações admin" ON configuracao_global FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON titulos_videos FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON versoes_dados FOR ALL USING (true);
