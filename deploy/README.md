# Deploy — OPIN em Produção

Instruções para a equipe de TI colocar o sistema no ar em `opin.unifesp.br`.

## Pré-requisitos no servidor

- Docker >= 24
- Docker Compose >= 2.20
- Porta 80 aberta no firewall
- DNS `opin.unifesp.br` apontando para o IP do servidor

## Passo a passo

### 1. Clonar o repositório

```bash
git clone https://gitlab.com/SEU_NAMESPACE/opin.git /opt/opin
cd /opt/opin
```

### 2. Criar o arquivo `.env`

```bash
cp deploy/.env.example .env
nano .env
```

Preencha os valores marcados com `# senha forte` e `# fornecida pela equipe`.
A equipe de desenvolvimento fornecerá os valores de `VITE_API_ANON_KEY` e `FRONT_IMAGE`.

### 3. Autenticar no registry do GitLab

```bash
docker login registry.gitlab.com
```

Use um **Deploy Token** gerado em: GitLab → Settings → Repository → Deploy tokens
(solicitar à equipe de desenvolvimento caso não tenha).

### 4. Criar a estrutura de diretórios de mídia

```bash
mkdir -p /opt/opin/data/storage/opin
```

Se houver imagens existentes a serem migradas, a equipe de desenvolvimento fornecerá os arquivos para copiar para este diretório.

### 5. Subir os containers

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

### 6. Verificar se está no ar

```bash
docker compose -f docker-compose.prod.yml ps
```

Todos os containers devem estar com status `running`. O site estará acessível em `http://opin.unifesp.br`.

## Atualizar para uma nova versão

Quando a equipe de desenvolvimento lançar uma nova versão, basta executar:

```bash
cd /opt/opin
git pull
docker compose -f docker-compose.prod.yml --env-file .env pull
docker compose -f docker-compose.prod.yml --env-file .env up -d
```

## Estrutura de arquivos necessária no servidor

```
/opt/opin/
├── docker-compose.prod.yml       ← versionado no repositório
├── .env                          ← criado manualmente (não está no repositório)
├── data/
│   ├── database/
│   │   ├── init_full.sql         ← versionado no repositório
│   │   └── prod_permissions.sql  ← versionado no repositório
│   └── storage/
│       └── opin/                 ← imagens e arquivos de mídia (fornecidos pela equipe)
```

## Suporte

Em caso de dúvidas, entrar em contato com a equipe de desenvolvimento do projeto OPIN — Unifesp.
