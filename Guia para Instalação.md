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

### 5. Configure o Banco de Dados Local

O projeto utiliza um banco de dados PostgreSQL local.

1.  Certifique-se de ter o PostgreSQL instalado e rodando.
2.  Crie um banco de dados (ex: `opin_local`).
3.  Execute o script de reset para criar as tabelas e popular os dados:

```bash
./scripts/reset-db.sh
```

**Nota:** Você pode precisar ajustar as credenciais no arquivo `scripts/reset-db.sh` se o seu Postgres local usar configurações diferentes do padrão.

### 6. Configure as Variáveis de Ambiente

Edite o arquivo `.env.local` para apontar para o seu backend local (se houver) ou banco de dados.

**Nota:** O frontend atualmente espera uma API compatível com Supabase (PostgREST). Se você não estiver usando o Supabase Local (`npx supabase start`), precisará adaptar a camada de conexão (`src/dbClient.js`) para se comunicar com sua própria API.

### 7. Execute o Projeto

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

**Erro de Conexão com Banco de Dados**: Verifique se as URLs e chaves estão corretas no `.env.local` e se o banco de dados local está rodando.

**Erro de Build**: Instale novamente as dependências com `npm install`, limpe o cache com `npm run build -- --reset-cache` e verifique erros de lint com `npm run lint`.

**Problemas com Imagens**: Verifique se os arquivos estão acessíveis e se as URLs no banco de dados estão corretas.

**Erro de Permissões**: Verifique as configurações do banco de dados e as políticas de acesso.

## Recursos Técnicos

- Documentação do Supabase: https://supabase.com/docs
- Documentação do React: https://reactjs.org/docs
- OpenLayers: https://openlayers.org/doc/
- Guia do Administrador: docs/GUIA_ADMINISTRADOR.md

## Contato

Para problemas durante a instalação, abra uma issue no GitHub ou entre em contato através de: heric.moura@unifesp.br
