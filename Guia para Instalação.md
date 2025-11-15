# Guia de Instalação - OPIN

## Pré-requisitos

Antes de iniciar, instale os seguintes componentes:

- Node.js 16 ou superior
- npm ou yarn (incluído no Node.js)
- Git
- Conta ativa no Supabase

## Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/hericmr/opin.git
cd opin
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:

```env
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
REACT_APP_ADMIN_PASSWORD=sua_senha_admin
REACT_APP_JWT_SECRET=sua_chave_jwt_secreta
```

### 4. Execute o Projeto

```bash
# Modo desenvolvimento (com hot reload)
npm run dev
# ou
npm start

# Build de produção
npm run build

# Preview do build de produção
npm run preview
```

**Nota**: Este projeto usa **Vite** como build tool. O servidor de desenvolvimento roda na porta 3000 por padrão.

### 5. Configure o Banco de Dados Supabase

#### Criar Tabelas

Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
CREATE TABLE escolas_completa (
  id SERIAL PRIMARY KEY,
  Escola TEXT,
  Municipio TEXT,
  Endereco TEXT,
  "Terra Indigena (TI)" TEXT,
  "Povos indigenas" TEXT,
  "Linguas faladas" TEXT,
  "Modalidade de Ensino/turnos de funcionamento" TEXT,
  "Numero de alunos" TEXT,
  "Espaco escolar e estrutura" TEXT,
  "Gestao/Nome" TEXT,
  "Quantidade de professores indigenas" TEXT,
  "Quantidade de professores nao indigenas" TEXT,
  historia_da_escola TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  link_para_videos TEXT,
  diferenciada TEXT,
  merenda_diferenciada TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cep TEXT,
  estado TEXT DEFAULT 'SP',
  imagem_header TEXT,
  imagens_desenhos TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE historias_professor (
  id SERIAL PRIMARY KEY,
  escola_id INTEGER REFERENCES escolas_completa(id),
  nome_professor TEXT NOT NULL,
  historia TEXT NOT NULL,
  ordem INTEGER DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  foto_rosto TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documentos_escola (
  id SERIAL PRIMARY KEY,
  escola_id INTEGER REFERENCES escolas_completa(id),
  titulo TEXT NOT NULL,
  autoria TEXT,
  tipo TEXT,
  link_pdf TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE escola_images (
  id SERIAL PRIMARY KEY,
  escola_id INTEGER REFERENCES escolas_completa(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  ordem INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE professor_images (
  id SERIAL PRIMARY KEY,
  professor_id INTEGER REFERENCES historias_professor(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  ordem INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Configurar Row Level Security (RLS)

```sql
ALTER TABLE escolas_completa ENABLE ROW LEVEL SECURITY;
ALTER TABLE historias_professor ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_escola ENABLE ROW LEVEL SECURITY;
ALTER TABLE escola_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública" ON escolas_completa FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON historias_professor FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON documentos_escola FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON escola_images FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON professor_images FOR SELECT USING (true);

CREATE POLICY "Permitir operações admin" ON escolas_completa FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON historias_professor FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON documentos_escola FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON escola_images FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON professor_images FOR ALL USING (true);
```

#### Configurar Storage Buckets

Crie os seguintes buckets no painel do Supabase, em Storage:

- `imagens-das-escolas`
- `imagens-professores`
- `pdfs`

Configure as políticas de storage:

```sql
CREATE POLICY "Permitir acesso público às imagens das escolas" ON storage.objects
FOR SELECT USING (bucket_id = 'imagens-das-escolas');

CREATE POLICY "Permitir acesso público às imagens dos professores" ON storage.objects
FOR SELECT USING (bucket_id = 'imagens-professores');

CREATE POLICY "Permitir acesso público aos PDFs" ON storage.objects
FOR SELECT USING (bucket_id = 'pdfs');
```

### 5. Execute o Projeto

```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`.

## Comandos Disponíveis

```bash
npm start      # Iniciar servidor de desenvolvimento
npm run build  # Build para produção
npm run deploy # Deploy no GitHub Pages
npm test       # Executar testes
npm run lint   # Verificar código com ESLint
```

## Fluxo de Desenvolvimento

Para contribuir com o projeto:

1. Fork o repositório no GitHub
2. Clone seu fork localmente
3. Crie uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
4. Faça as alterações e teste localmente
5. Commit as mudanças:
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
6. Push para sua branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
7. Abra um Pull Request no GitHub

## Deploy em Produção

Configure as variáveis de ambiente de produção, execute o build e faça o deploy:

```bash
npm run build
npm run deploy
```

## Solução de Problemas

**Erro de Conexão com Supabase**: Verifique se as URLs e chaves estão corretas no `.env.local`, confirme se as políticas RLS estão configuradas e teste a conexão no painel do Supabase.

**Erro de Build**: Instale novamente as dependências com `npm install`, limpe o cache com `npm run build -- --reset-cache` e verifique erros de lint com `npm run lint`.

**Problemas com Imagens**: Verifique se os buckets do Supabase estão criados, confirme as políticas de storage e teste o upload manualmente no painel.

**Erro de Permissões**: Verifique as políticas RLS nas tabelas, confirme se as políticas de storage estão corretas e teste as operações no painel do Supabase.

## Recursos Técnicos

- Documentação do Supabase: https://supabase.com/docs
- Documentação do React: https://reactjs.org/docs
- OpenLayers: https://openlayers.org/doc/
- Guia do Administrador: docs/GUIA_ADMINISTRADOR.md

## Contato

Para problemas durante a instalação, abra uma issue no GitHub ou entre em contato através de: heric.moura@unifesp.br
