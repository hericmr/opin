# Escolas Indígenas

Um portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil. O projeto visa facilitar o acesso a dados educacionais e culturais dessas instituições, promovendo maior visibilidade e compreensão da educação indígena.

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca principal para construção da interface
- **TailwindCSS** - Framework CSS utilitário para estilização
- **Lucide React** - Biblioteca de ícones
- **Leaflet** - Biblioteca para mapas interativos
- **Framer Motion** - Animações e transições
- **React Router** - Roteamento da aplicação

### Dados e APIs
- **Supabase** - Backend e banco de dados
- **GeoJSON** - Formato para dados geográficos
- **PapaParse** - Parser para arquivos CSV
- **React Markdown** - Renderização de conteúdo markdown

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/hericmr/escolasindigenas.git
cd escolasindigenas
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── PainelInformacoes/           # Componente principal de informações
│   │   ├── components/              # Subcomponentes modulares
│   │   │   ├── EscolaInfo/         # Informações da escola
│   │   │   │   ├── BasicInfo.js    # Dados básicos
│   │   │   │   ├── PovosLinguas.js # Informações étnicas
│   │   │   │   ├── Ensino.js       # Dados educacionais
│   │   │   │   └── ...
│   │   │   ├── InfoSection.js      # Seção de informação reutilizável
│   │   │   ├── InfoItem.js         # Item de informação
│   │   │   └── ...
│   │   ├── hooks/                  # Hooks customizados
│   │   │   ├── usePainelVisibility.js
│   │   │   ├── useAudio.js
│   │   │   └── ...
│   │   └── index.js               # Componente principal
│   └── ...
├── data/                          # Dados estáticos
│   ├── escolas.csv
│   └── terras_indigenas.geojson
└── ...
```

## 🎯 Componentes Principais

### PainelInformacoes
Componente central que gerencia a exibição de informações detalhadas sobre escolas e terras indígenas. Utiliza uma arquitetura modular com:

- **Componentes Modulares**: Separação clara de responsabilidades
- **Hooks Customizados**: Gerenciamento de estado e lógica reutilizável
- **Componentes Utilitários**: Elementos reutilizáveis como `InfoSection` e `InfoItem`

### Hooks Customizados
- `usePainelVisibility`: Controla visibilidade do painel
- `useAudio`: Gerencia recursos de áudio
- `useShare`: Funcionalidades de compartilhamento
- `useDynamicURL`: Gerenciamento de URLs dinâmicas
- `useClickOutside`: Detecção de cliques fora do componente
- `usePainelDimensions`: Responsividade e dimensões

## 🎨 Estilização

O projeto utiliza TailwindCSS com configurações personalizadas:
- Sistema de cores verde para identidade visual
- Componentes responsivos
- Tipografia otimizada para leitura
- Animações suaves para interações

## 🧪 Testes

Execute os testes com:
```bash
npm test           # Executa testes
npm run test:watch # Modo watch
npm run test:coverage # Cobertura de testes
```

## 📝 Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm build`: Gera build de produção
- `npm test`: Executa testes
- `npm run deploy`: Faz deploy para GitHub Pages

## Sobre o Projeto

Esta é uma cartografia social que busca mapear territorialidades, lutas e conquistas dos movimentos sociais e da população na cidade de Santos. O mapa destaca a presença de equipamentos sociais, culturais, religiosos, políticos, educacionais, como escolas, unidades de saúde, assistência social, espaços culturais e de lazer, além de comunidades e locais carregados de memória e história.

Entre os elementos mapeados, estão histórias relacionadas à escravidão e lutas do povo negro, à opressão e resistência à ditadura empresarial-militar (1964-1984), e às lutas que moldaram e continuam moldando a identidade da região.

Os materiais cartográficos e textuais disponíveis aqui foram produzidos pelas(os) estudantes de Serviço Social da UNIFESP do vespertino e noturno durante a Unidade Curricular de Política Social 2, em 2024 e 2025.

### Tipos de Marcadores no Mapa

- **Azul** - Lazer: equipamentos sociais, culturais e de lazer
- **Verde** - Assistência: unidades de assistência social e saúde
- **Amarelo** - Históricos: lugares históricos e de memória
- **Vermelho** - Comunidades: territórios de comunidades
- **Violeta** - Educação: escolas e unidades de ensino
- **Preto** - Religião: estabelecimentos religiosos

## Instalação e Uso

1. Clone o repositório e instale as dependências:
```bash
git clone https://github.com/hericmr/escolasindigenas.git
cd escolasindigenas
npm install
```

2. Configure o ambiente:
- Copie `.env.example` para `.env`
- Adicione suas credenciais do Supabase

3. Execute o projeto:
```bash
npm start
```

## Tecnologias

- React.js com Leaflet para mapas
- Tailwind CSS para estilização
- Supabase para backend

## Contato

Heric Rodrigues - [heric.moura@unifesp.br](mailto:heric.moura@unifesp.br)

---
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
