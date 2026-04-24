# OPIN - Observatório dos Professores Indígenas
Plataforma de mapeamento e documentação de escolas indígenas no estado de São Paulo. Projeto [LINDI/UNIFESP](https://www.unifesp.br/) (2025).

---

## Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Início Rápido](#in%C3%ADcio-r%C3%A1pido)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documenta%C3%A7%C3%A3o)
- [Licença](#licen%C3%A7a)

---

## Sobre

O OPIN é um observatório digital que reúne dados, mapas e informações sobre **escolas indígenas** em São Paulo. A plataforma busca tornar visíveis as realidades, histórias e práticas pedagógicas dessas comunidades por meio de uma interface colaborativa e acessível.

## Funcionalidades

- **Mapa interativo** — Localização e contexto geográfico de escolas e territórios indígenas
- **Painéis de dados** — Indicadores e estatísticas por escola, região e diretoria
- **Busca e filtros** — Pesquisa por nome, localidade e atributos relevantes
- **Responsividade** — Layout otimizado para desktop e celular
- **Dados colaborativos** — Maior transparência e atualização contínua

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19 + Vite |
| Estilos | Tailwind CSS 4 |
| Mapas | OpenLayers + Mapbox GL |
| Backend | PostgREST (Dockerizado) |
| Banco de dados | PostgreSQL 16 |
| Testes | Jest + React Testing Library |

## Início Rápido

### Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (somente para desenvolvimento local sem Docker)

### Executando localmente

```bash
# Criar arquivo de ambiente
cp .env.example .env

# Iniciar containers em modo de desenvolvimento
make up
```

### URLs principais

- Site: `http://localhost:8080/opin/`
- API: `http://localhost:8080/opin/rest/v1/`

### Comandos úteis

```bash
make down          # Parar containers
make reset-db      # Resetar banco de dados local
make prod-up       # Iniciar em produção
```

## Estrutura do Projeto

```text
src/
├── components/    # Componentes React (mapa, painéis, etc.)
├── hooks/         # Hooks personalizados
├── services/      # Cliente e chamadas de API
├── data/          # Dados estáticos e formatos
└── utils/         # Funções utilitárias e helpers
```

## Documentação

- [Guia de Instalação](docs/Guia%20para%20Instala%C3%A7%C3%A3o.md)
- [Guia do Administrador](docs/GUIA_ADMINISTRADOR.md)
- [Configurar Secrets no GitHub](docs/CONFIGURAR_SECRETS_GITHUB.md)

## Licença

Este projeto está licenciado sob a licença indicada no arquivo `LICENSE`.

