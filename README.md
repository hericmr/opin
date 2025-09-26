# OPIN - Observatório dos Professores Indígenas no Estado de São Paulo

O OPIN (Observatório dos Professores Indígenas no Estado de São Paulo) é um site que mapeia as escolas indígenas no estado de São Paulo. Feito durante o projeto "Ação Saberes Indígenas nas Escolas", da LINDI/UNIFESP (2025), o site documenta dados sobre essas escolas, destacando suas realidades, histórias e práticas pedagógicas. Os diagnósticos foram feitos pelos próprios professores indígenas das escolas.


![OPIN Logo](public/opin.png)

**Site:** https://hericmr.github.io/opin/

---

## Screenshots

![Exemplo da Interface](public/exemplo1.png)

![Exemplo](public/exemplo2.png)

![Exemplo do Painel de Informações](public/exemplo3.png)

---

### Funcionalidades

- **Mapa Interativo**: Visualização geográfica das escolas indígenas
- **Painel de Informações**: Dados completos sobre cada escola
- **Painel Administrativo**: Interface para gerenciamento de dados
- **Busca**: Pesquisa por localização e características
- **Materiais Didáticos**: Recursos educacionais (em construção)

---

## Estrutura do Mapa Dinâmico

Mapa interativo com base em imagem de satélite e três camadas principais:

### Camadas
1. **Estado de São Paulo** - Limites administrativos e divisão municipal
2. **Terras Indígenas** - Demarcação oficial das áreas protegidas  
3. **Escolas Indígenas** - Marcadores com informações detalhadas

### Funcionalidades
- Zoom e navegação livre
- Controles de camadas
- Busca geográfica
- Painel lateral com dados completos

---

## Documentação para Administradores

Se você é administrador do OPIN e tem alguma dúvida, provavelmente ela será respondida nesta documentação:

**[📋 Guia do Administrador](docs/GUIA_ADMINISTRADOR.md)**


---

## Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 16 ou superior
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/hericmr/opin.git
cd opin
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

### Comandos Disponíveis

```bash
npm start      # Iniciar servidor de desenvolvimento
npm run build  # Build para produção
npm run deploy # Deploy no GitHub Pages
npm test       # Executar testes
npm run lint   # Verificar código com ESLint
```

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── MetaTags/              # Sistema de meta tags dinâmicas
│   ├── PainelInformacoes/     # Informações detalhadas das escolas
│   ├── MapaEscolasIndigenas/  # Mapa interativo principal
│   ├── AdminPanel/            # Painel de administração
│   ├── Navbar/                # Barra de navegação
│   ├── SearchResults/         # Resultados de busca
│   └── ...
├── hooks/                     # Hooks personalizados
│   ├── useEscolasData.js      # Hook para dados das escolas
│   ├── useEscolaAtual.js      # Hook para detecção de escola atual
│   └── useMetaTags.js         # Hook para meta tags
├── services/                  # Serviços de API
├── utils/                     # Utilitários e helpers
├── config/                    # Configurações
└── App.js                     # Componente raiz
```


