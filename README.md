# OPIN - Observatório dos Professores Indígenas no Estado de São Paulo

O OPIN (Observatório dos Professores Indígenas no Estado de São Paulo) é um site que mapeia as escolas indígenas no estado de São Paulo. Feito durante o projeto "Ação Saberes Indígenas nas Escolas", da LINDI/UNIFESP (2025), o site documenta dados sobre essas escolas, destacando suas realidades, histórias e práticas pedagógicas. Os diagnósticos foram feitos pelos próprios professores indígenas das escolas.


![OPIN Logo](public/opin.png)

**Site:** https://hericmr.github.io/opin/

---

## Screenshots

![Exemplo da Interface](public/exemplo1.png)

## Funcionalidades

- **Mapa Interativo**: Visualização geográfica das escolas indígenas
- **Painel de Informações**: Dados completos sobre cada escola
- **Painel Administrativo**: Interface para gerenciamento de dados
- **Busca**: Pesquisa por localização e características
- **Materiais Didáticos**: Recursos educacionais (em construção)

![Exemplo](public/exemplo2.png)

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

![Exemplo do Painel de Informações](public/exemplo3.png)

---

## Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server (migrado de Create React App)
- **Tailwind CSS** - Framework CSS utilitário
- **OpenLayers** - Biblioteca para mapas interativos
- **Supabase** - Backend como serviço (BaaS)
- **Jest** - Framework de testes

## Documentação

### Para Desenvolvedores
Se você quer clonar este repositório e executar o projeto localmente:

**[Guia para Instalação](Guia%20para%20Instalação.md)**

### Migração para Vite

Este projeto foi migrado de `react-scripts` (Create React App) para **Vite** para melhorar performance, reduzir dependências e permitir atualizações futuras. Veja [planning.md](planning.md) para detalhes da migração.

### Para Administradores
Se você é administrador do OPIN e tem alguma dúvida, provavelmente ela será respondida nesta documentação:

**[Guia do Administrador](docs/GUIA_ADMINISTRADOR.md)**


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

---

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## Contato

**GitHub**

Feel free to contact me at heric.moura@unifesp.br.

Para dúvidas ou sugestões sobre o projeto, entre em contato através dos issues do GitHub ou pelo email do desenvolvedor.
