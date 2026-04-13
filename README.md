# OPIN - Observatório dos Professores Indígenas

Plataforma de mapeamento e documentação de escolas indígenas no estado de São Paulo. Projeto [LINDI/UNIFESP](https://www.unifesp.br/) (2025).

![OPIN Interface](public/hero.webp)

---

## Sobre

O OPIN é um observatório que mapeia **escolas indígenas** em São Paulo, documentando suas realidades, histórias e práticas pedagógicas através de uma plataforma interativa com dados colaborativos.

## Funcionalidades

- **Mapa Interativo** — Visualização geográfica de escolas e terras indígenas
- **Painéis de Dados** — Estatísticas por escola e região administrativa
- **Busca e Filtros** — Consulta avançada por localização e características
- **Responsivo** — Funciona em desktop e mobile

---

## Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + Vite |
| **Estilos** | Tailwind CSS 4 |
| **Mapas** | OpenLayers + Mapbox GL |
| **Backend** | PostgREST (Dockerizado) |
| **Banco** | PostgreSQL 16 |
| **Testes** | Jest + React Testing Library |

---

## Quick Start (Docker)

### Pré-requisitos
- Docker & Docker Compose
- Node.js 20+ (para dev local sem Docker)

### Executar

```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar (desenvolvimento)
make up

# Acessar
# → Site: http://localhost:8080/opin/
# → API: http://localhost:8080/opin/rest/v1/
```

**Comandos úteis:**
```bash
make down          # Parar containers
make reset-db      # Resetar banco (apaga dados locais)
make prod-up       # Iniciar em produção
```

---

## 📁 Estrutura

```
src/
├── components/    # React components (Mapa, Painéis, etc)
├── hooks/         # Custom hooks
├── services/      # API client
├── data/          # Static data
└── utils/         # Helpers
```

---

## 📚 Documentação

- [Guia de Instalação Detalhado](Guia%20para%20Instalação.md)
- [Guia do Administrador](docs/GUIA_ADMINISTRADOR.md)
- [Deploy e CI/CD](docs/GUIA_DEPLOY.md)

---

## Contato & Repositórios

- **GitHub**: [hericmr/opin](https://github.com/hericmr/opin)
- **GitLab**: [hericmr/opin](https://gitlab.com/hericmr/opin)
- **Email**: heric.moura@unifesp.br
- **LINDI**: [Laboratório de Línguas Indígenas](https://www.unifesp.br/)
