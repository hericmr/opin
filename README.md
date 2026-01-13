# OPIN - Observatório dos Professores Indígenas no Estado de São Paulo

O OPIN mapeia escolas indígenas no estado de São Paulo, documentando suas realidades, histórias e práticas pedagógicas. Projeto da LINDI/UNIFESP (2025).

![OPIN Logo](public/opin.png)

**Site:** https://hericmr.github.io/opin/

---

## Funcionalidades
- **Mapa Interativo**: Visualização geográfica das escolas e terras indígenas.
- **Painéis**: Informações detalhadas por escola e área administrativa.
- **Busca Avançada**: Filtros por localização e características.

![Exemplo da Interface](public/exemplo1.png)

---

## Stack Tecnológico (2025)
- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Mapas**: [OpenLayers](https://openlayers.org/) + [Mapbox GL](https://www.mapbox.com/)
- **Backend/API**: [PostgREST](https://postgrest.org/) (Dockerizado)
- **Banco de Dados**: PostgreSQL 16
- **Testes**: Jest + React Testing Library

---

## Como Rodar (Docker)

O projeto é totalmente dockerizado para facilitar o desenvolvimento e deploy.

### 1. Configuração de Segredos
**Nunca commite senhas no repositório.**
1. Copie o exemplo: `cp .env.example .env`
2. Configure o `.env` com suas senhas (para produção) ou mantenha os defaults (apenas para dev local).

### 2. Comandos Rápidos
Use o `Makefile` incluído:

- **Iniciar (Dev/Local)**: `make up`
  - Site: http://localhost:8080/opin/
  - API: http://localhost:8080/opin/rest/v1/
- **Iniciar (Produção)**: `make prod-up` (Usa variáveis do `.env`)
- **Parar**: `make down`
- **Resetar Banco**: `make reset-db` (Cuidado: Apaga dados locais!)

---

## Estrutura do Projeto
```bash
src/
├── components/   # Componentes React (Mapa, Painéis, Navbar...)
├── hooks/        # Custom Hooks (useEscolasData, useAuth...)
├── services/     # Comunicação com API
├── data/         # Dados estáticos e SQLs
└── scripts/      # Utilitários de build/manutenção
```

## Documentação Adicional
- [Guia para Instalação](Guia%20para%20Instalação.md) (Detalhado)
- [Guia do Administrador](docs/GUIA_ADMINISTRADOR.md)

---

## Contato
**GitHub**: [hericmr/opin](https://github.com/hericmr/opin)
**Email**: heric.moura@unifesp.br
