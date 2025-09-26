# OPIN - Observatório dos Professores Indígenas no Estado de São Paulo

O OPIN (Observatório dos Professores Indígenas no Estado de São Paulo) é uma plataforma que mapeia escolas indígenas no estado de São Paulo. Integrante do projeto "Ação Saberes Indígenas nas Escolas", da LINDI/UNIFESP (2025), o site visa documentar e compartilhar dados sobre essas escolas, destacando suas realidades, histórias e práticas pedagógicas.


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

Este guia inclui informações sobre:
- Painel de administração (`/admin`)
- Sistema de meta tags e compartilhamento
- Estrutura do banco de dados
- Funcionalidades especiais
- Configuração do Supabase
- Campos obrigatórios
- Boas práticas
- Solução de problemas


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

---

## Configuração do Supabase

### Permissões Necessárias

```sql
-- Liberar permissões para histórias dos professores
GRANT ALL ON TABLE historias_professor TO authenticated;
GRANT ALL ON TABLE historias_professor TO anon;

-- Liberar permissões para documentos
GRANT ALL ON TABLE documentos_escola TO authenticated;
GRANT ALL ON TABLE documentos_escola TO anon;

-- Liberar permissões para imagens
GRANT ALL ON TABLE escola_images TO authenticated;
GRANT ALL ON TABLE escola_images TO anon;
GRANT ALL ON TABLE professor_images TO authenticated;
GRANT ALL ON TABLE professor_images TO anon;
```

### Políticas de Segurança (RLS)

Configure as políticas de Row Level Security (RLS) conforme necessário para controlar acesso aos dados.

---

## Campos Obrigatórios

### Para Funcionamento do Mapa
- **Latitude** e **Longitude**: Essenciais para posicionamento dos marcadores
- **Nome da escola**: Exibido no popup do marcador
- **Município**: Informação básica para identificação

### Para Funcionamento do Sistema
- **Nome da escola** (Dados Básicos)
- **Nome do professor** (História dos Professores)
- **História do professor** (História dos Professores)
- **Título e link do documento** (Documentos)

---

## Boas Práticas

### Dados
- Use links do Google Drive para documentos (com permissão pública)
- Mantenha histórias dos professores organizadas por ordem
- Verifique coordenadas antes de salvar
- Teste links de vídeo antes de salvar

### Desenvolvimento
- Mantenha componentes modulares e reutilizáveis
- Use TypeScript para melhor tipagem (quando aplicável)
- Documente componentes complexos
- Teste funcionalidades em diferentes navegadores

### SEO e Compartilhamento
- Verifique meta tags com ferramentas de debug das redes sociais
- Mantenha URLs limpas e descritivas
- Otimize imagens para web
- Teste compartilhamento em diferentes plataformas

---

## Solução de Problemas

### Formulário não salva
- Verifique campos obrigatórios
- Confirme erros no console do navegador
- Verifique permissões no Supabase
- Teste conexão com internet

### Imagens não carregam
- Verifique se o arquivo não excede 5MB
- Confirme formato suportado (JPG, PNG, GIF)
- Verifique conexão com internet
- Confirme URL da imagem

### Meta tags não aparecem
- Verifique se HelmetProvider está configurado
- Confirme se MetaTagsDetector está sendo renderizado
- Teste com ferramentas de debug das redes sociais
- Verifique se escola não é null/undefined

### Mapa não carrega
- Verifique coordenadas válidas
- Confirme dados no formato correto
- Teste conexão com Supabase
- Verifique console para erros JavaScript

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

Para dúvidas ou sugestões sobre o projeto, entre em contato através dos issues do GitHub ou pelo email do desenvolvedor.

