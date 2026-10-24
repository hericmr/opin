# Makefile para projeto React com Docker Compose

# Variáveis
DOCKER_COMPOSE = docker compose
DOCKER = docker
PROJECT_NAME = react-app
REACT_CONTAINER = react-app
NODE_CONTAINER = node

# Cores para output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

# Comandos principais
.PHONY: help up down stop start restart build rebuild logs shell clean prune

## Ajuda - exibe esta mensagem
help:
	@echo "$(GREEN)Comandos disponíveis:$(NC)"
	@echo ""
	@echo "$(YELLOW)Desenvolvimento:$(NC)"
	@echo "  make up           - Inicia os containers em foreground"
	@echo "  make up-d         - Inicia os containers em background (detached)"
	@echo "  make down         - Para e remove containers, redes e volumes"
	@echo "  make stop         - Para os containers sem removê-los"
	@echo "  make start        - Inicia containers previamente parados"
	@echo "  make restart      - Reinicia os containers"
	@echo ""
	@echo "$(YELLOW)Build:$(NC)"
	@echo "  make build        - Constrói/rebuilda as imagens"
	@echo "  make rebuild      - Rebuilda as imagens sem cache"
	@echo ""
	@echo "$(YELLOW)Monitoramento:$(NC)"
	@echo "  make logs         - Mostra logs dos containers"
	@echo "  make logs-f       - Mostra logs em tempo real"
	@echo "  make ps           - Lista containers do projeto"
	@echo ""
	@echo "$(YELLOW)Manutenção:$(NC)"
	@echo "  make reset-db     - PARA TUDO e remove o volume do banco (reset total)"

	@echo "  make prod-up      - Inicia ambiente de PRODUÇÃO (usa .env)"
	@echo ""

## Inicia os containers em foreground (desenvolvimento)
up:
	@echo "$(GREEN)Iniciando containers em foreground...$(NC)"
	$(DOCKER_COMPOSE) up

## Inicia ambiente de produção
prod-up:
	@echo "$(RED)Iniciando em MODO PRODUÇÃO...$(NC)"
	@if [ ! -f .env ]; then echo "$(RED)Erro: Arquivo .env não encontrado. Copie .env.example e configure.$(NC)"; exit 1; fi
	$(DOCKER_COMPOSE) -f docker-compose.prod.yml --env-file .env up -d
	@echo "$(GREEN)Produção iniciada na porta 80 (ou definida em .env).$(NC)"

## Inicia os containers em background
up-d:
	@echo "$(GREEN)Iniciando containers em background...$(NC)"
	$(DOCKER_COMPOSE) up -d
	@echo "$(GREEN)Containers iniciados em background. Use 'make logs' para ver os logs.$(NC)"

## Para e remove containers, redes e volumes
down:
	@echo "$(YELLOW)Parando e removendo containers...$(NC)"
	$(DOCKER_COMPOSE) down

## Para os containers sem removê-los
stop:
	@echo "$(YELLOW)Parando containers...$(NC)"
	$(DOCKER_COMPOSE) stop

## Inicia containers previamente parados
start:
	@echo "$(GREEN)Iniciando containers parados...$(NC)"
	$(DOCKER_COMPOSE) start

## Reinicia os containers
restart:
	@echo "$(YELLOW)Reiniciando containers...$(NC)"
	$(DOCKER_COMPOSE) restart

## Constrói/rebuilda as imagens
build:
	@echo "$(GREEN)Construindo imagens...$(NC)"
	$(DOCKER_COMPOSE) build

## Rebuilda as imagens sem cache
rebuild:
	@echo "$(GREEN)Rebuildando imagens sem cache...$(NC)"
	$(DOCKER_COMPOSE) build --no-cache

## Mostra logs dos containers
logs:
	@echo "$(GREEN)Mostrando logs dos containers...$(NC)"
	$(DOCKER_COMPOSE) logs

## Mostra logs em tempo real
logs-f:
	@echo "$(GREEN)Mostrando logs em tempo real...$(NC)"
	$(DOCKER_COMPOSE) logs -f

## Lista containers do projeto
ps:
	@echo "$(GREEN)Listando containers do projeto...$(NC)"
	$(DOCKER_COMPOSE) ps
## Reseta o banco de dados (CUIDADO: APAGA DADOS)
reset-db:
	@echo "$(RED)Parando containers e removendo volume do banco...$(NC)"
	$(DOCKER_COMPOSE) down -v
	@echo "$(GREEN)Volume removido. Na próxima vez que subir (make up), o banco será recriado do zero.$(NC)"
