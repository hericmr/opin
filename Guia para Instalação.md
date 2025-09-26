# Guia para Instalação - OPIN

Se você quer clonar este repositório e executar o projeto localmente, este guia te ajudará com todo o processo de configuração.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 16 ou superior ([Download](https://nodejs.org/))
- **npm** ou **yarn** (vem com o Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Conta no Supabase** ([Criar conta](https://supabase.com/))

## 🚀 Instalação Passo a Passo

### 1. Clone o Repositório

```bash
git clone https://github.com/hericmr/opin.git
cd opin
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Edite o arquivo `.env.local` com suas credenciais do Supabase:
```env
REACT_APP_SUPABASE_URL=sua_url_do_supabase
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
REACT_APP_ADMIN_PASSWORD=sua_senha_admin
REACT_APP_JWT_SECRET=sua_chave_jwt_secreta
```

### 4. Configure o Banco de Dados Supabase

#### Criar as Tabelas Necessárias

Execute os seguintes comandos SQL no editor SQL do Supabase:

```sql
-- Tabela principal das escolas
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
  cozinha TEXT,
  merenda_escolar TEXT,
  diferenciada TEXT,
  merenda_diferenciada TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cep TEXT,
  estado TEXT DEFAULT 'SP',
  imagem_header TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de histórias dos professores
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

-- Tabela de documentos das escolas
CREATE TABLE documentos_escola (
  id SERIAL PRIMARY KEY,
  escola_id INTEGER REFERENCES escolas_completa(id),
  titulo TEXT NOT NULL,
  autoria TEXT,
  tipo TEXT,
  link_pdf TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de imagens das escolas
CREATE TABLE escola_images (
  id SERIAL PRIMARY KEY,
  escola_id INTEGER REFERENCES escolas_completa(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  ordem INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de imagens dos professores
CREATE TABLE professor_images (
  id SERIAL PRIMARY KEY,
  professor_id INTEGER REFERENCES historias_professor(id),
  image_url TEXT NOT NULL,
  caption TEXT,
  ordem INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Configurar Permissões (RLS)

```sql
-- Habilitar RLS nas tabelas
ALTER TABLE escolas_completa ENABLE ROW LEVEL SECURITY;
ALTER TABLE historias_professor ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_escola ENABLE ROW LEVEL SECURITY;
ALTER TABLE escola_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE professor_images ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público (leitura)
CREATE POLICY "Permitir leitura pública" ON escolas_completa FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON historias_professor FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON documentos_escola FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON escola_images FOR SELECT USING (true);
CREATE POLICY "Permitir leitura pública" ON professor_images FOR SELECT USING (true);

-- Políticas para operações administrativas (se necessário)
CREATE POLICY "Permitir operações admin" ON escolas_completa FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON historias_professor FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON documentos_escola FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON escola_images FOR ALL USING (true);
CREATE POLICY "Permitir operações admin" ON professor_images FOR ALL USING (true);
```

#### Configurar Storage Buckets

No painel do Supabase, vá para **Storage** e crie os seguintes buckets:

1. **`imagens-das-escolas`** - Para fotos das escolas
2. **`imagens-professores`** - Para fotos dos professores
3. **`pdfs`** - Para documentos PDF

Configure as políticas de storage:

```sql
-- Política para bucket de imagens das escolas
CREATE POLICY "Permitir acesso público às imagens das escolas" ON storage.objects
FOR SELECT USING (bucket_id = 'imagens-das-escolas');

-- Política para bucket de imagens dos professores
CREATE POLICY "Permitir acesso público às imagens dos professores" ON storage.objects
FOR SELECT USING (bucket_id = 'imagens-professores');

-- Política para bucket de PDFs
CREATE POLICY "Permitir acesso público aos PDFs" ON storage.objects
FOR SELECT USING (bucket_id = 'pdfs');
```

### 5. Execute o Projeto

```bash
npm start
```

O projeto estará disponível em `http://localhost:3000`

## 🛠️ Comandos Disponíveis

```bash
npm start      # Iniciar servidor de desenvolvimento
npm run build  # Build para produção
npm run deploy # Deploy no GitHub Pages
npm test       # Executar testes
npm run lint   # Verificar código com ESLint
```

## 🔧 Configurações Adicionais

### Para Desenvolvimento

Se você quiser contribuir com o projeto:

1. **Fork** o repositório no GitHub
2. **Clone** seu fork localmente
3. **Crie uma branch** para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
4. **Faça suas alterações** e teste localmente
5. **Commit** suas mudanças:
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
6. **Push** para sua branch:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
7. **Abra um Pull Request** no GitHub

### Para Produção

Para fazer deploy em produção:

1. **Configure** as variáveis de ambiente de produção
2. **Execute** o build:
   ```bash
   npm run build
   ```
3. **Deploy** usando o comando disponível:
   ```bash
   npm run deploy
   ```

## 🐛 Solução de Problemas

### Erro de Conexão com Supabase
- Verifique se as URLs e chaves estão corretas no `.env.local`
- Confirme se as políticas RLS estão configuradas
- Teste a conexão no painel do Supabase

### Erro de Build
- Verifique se todas as dependências estão instaladas: `npm install`
- Limpe o cache: `npm run build -- --reset-cache`
- Verifique se há erros de lint: `npm run lint`

### Problemas com Imagens
- Verifique se os buckets do Supabase estão criados
- Confirme as políticas de storage
- Teste o upload manualmente no painel do Supabase

### Erro de Permissões
- Verifique as políticas RLS nas tabelas
- Confirme se as políticas de storage estão corretas
- Teste as operações no painel do Supabase

## 📚 Recursos Úteis

- **Documentação do Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Documentação do React**: [https://reactjs.org/docs](https://reactjs.org/docs)
- **OpenLayers Documentation**: [https://openlayers.org/doc/](https://openlayers.org/doc/)
- **Guia do Administrador**: [docs/GUIA_ADMINISTRADOR.md](docs/GUIA_ADMINISTRADOR.md)

## 💡 Dicas

- **Use o modo de desenvolvimento** para testar alterações rapidamente
- **Monitore o console** do navegador para erros
- **Teste em diferentes navegadores** para garantir compatibilidade
- **Use o painel do Supabase** para verificar dados e configurações
- **Consulte o guia do administrador** para informações técnicas detalhadas

## 📞 Suporte

Se você encontrar problemas durante a instalação:

1. **Verifique** este guia primeiro
2. **Consulte** a documentação do Supabase
3. **Abra uma issue** no GitHub com detalhes do erro
4. **Entre em contato** através do email: heric.moura@unifesp.br

---

**Boa sorte com sua instalação!** 🚀