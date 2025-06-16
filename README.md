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
│   │   │   │   ├── BasicInfo.js    # Dados básicos (nome, endereço, etc)
│   │   │   │   ├── HistoriaAldeia.js # História da aldeia
│   │   │   │   ├── PovosLinguas.js # Informações étnicas e linguísticas
│   │   │   │   ├── Ensino.js       # Dados educacionais
│   │   │   │   ├── Infraestrutura.js # Dados de infraestrutura
│   │   │   │   ├── GestaoProfessores.js # Gestão e corpo docente
│   │   │   │   ├── RedesSociais.js # Links para redes sociais
│   │   │   │   └── Localizacao.js  # Dados de localização
│   │   │   ├── InfoSection.js      # Seção de informação reutilizável
│   │   │   ├── InfoItem.js         # Item de informação (label/valor)
│   │   │   ├── BooleanValue.js     # Componente para valores booleanos
│   │   │   └── ShareSection.js     # Seção de compartilhamento
│   │   ├── hooks/                  # Hooks customizados
│   │   │   ├── usePainelVisibility.js # Controle de visibilidade
│   │   │   ├── useAudio.js         # Gerenciamento de áudio
│   │   │   ├── useShare.js         # Funcionalidades de compartilhamento
│   │   │   ├── useDynamicURL.js    # Gerenciamento de URLs
│   │   │   ├── useClickOutside.js  # Detecção de cliques externos
│   │   │   └── usePainelDimensions.js # Responsividade
│   │   ├── icons/                  # Ícones customizados
│   │   │   └── HandFistIcon.js     # Ícone para terras indígenas
│   │   ├── IntroPanel.js           # Painel introdutório
│   │   ├── TerraIndigenaInfo.js    # Informações de terras indígenas
│   │   └── index.js                # Componente principal
│   ├── MapaEscolasIndigenas/       # Componente do mapa
│   │   ├── components/             # Componentes do mapa
│   │   │   ├── MapaBase.js         # Base do mapa Leaflet
│   │   │   ├── Marcadores.js       # Marcadores no mapa
│   │   │   ├── TerrasIndigenas.js  # Camada de terras indígenas
│   │   │   ├── EstadoSP.js         # Camada do estado de SP
│   │   │   └── MenuCamadas.js      # Menu de controle de camadas
│   │   └── index.js                # Componente principal do mapa
│   ├── PainelHeader/               # Cabeçalho do painel
│   │   └── index.js                # Componente do cabeçalho
│   ├── PainelDescricao/            # Componente de descrição
│   │   └── index.js                # Renderização de descrições
│   └── PainelLinks/                # Componente de links
│       └── index.js                # Lista de links
├── hooks/                          # Hooks globais
│   ├── useMapData.js               # Gerenciamento de dados do mapa
│   └── useMapInteractions.js       # Interações com o mapa
├── utils/                          # Utilitários
│   ├── textFormatting.js           # Formatação de texto
│   ├── mapUtils.js                 # Utilitários para mapas
│   └── dataProcessing.js           # Processamento de dados
├── data/                          # Dados estáticos
│   ├── escolas.csv                # Dados das escolas
│   └── terras_indigenas.geojson   # Dados geográficos
├── styles/                        # Estilos globais
│   └── globals.css                # Estilos globais Tailwind
└── App.js                         # Componente raiz
```

## 🎯 Componentes Principais

### PainelInformacoes
Componente central que gerencia a exibição de informações detalhadas sobre escolas e terras indígenas. Utiliza uma arquitetura modular com:

#### Subcomponentes
- **EscolaInfo**: Exibe informações detalhadas das escolas
  - `BasicInfo`: Dados básicos (nome, endereço, tipo)
  - `HistoriaAldeia`: História da aldeia
  - `PovosLinguas`: Informações sobre povos e línguas
  - `Ensino`: Dados educacionais (modalidade, alunos, etc)
  - `Infraestrutura`: Detalhes da infraestrutura
  - `GestaoProfessores`: Gestão e corpo docente
  - `RedesSociais`: Links para redes sociais
  - `Localizacao`: Dados de localização

- **TerraIndigenaInfo**: Exibe informações sobre terras indígenas
  - Dados de superfície
  - Localização
  - Fase e modalidade
  - Informações administrativas

- **IntroPanel**: Painel introdutório com descrição e áudio
  - Suporte a conteúdo markdown
  - Player de áudio integrado

#### Componentes Utilitários
- `InfoSection`: Seção de informação reutilizável
  - Suporte a ícones
  - Colapso/expansão
  - Estilização consistente

- `InfoItem`: Item de informação (label/valor)
  - Layout em grid
  - Suporte a valores booleanos
  - Estilização responsiva

- `BooleanValue`: Componente para valores booleanos
  - Exibição visual de sim/não
  - Estilização consistente

#### Hooks Customizados
- `usePainelVisibility`: Controla visibilidade e responsividade
- `useAudio`: Gerencia recursos de áudio
- `useShare`: Funcionalidades de compartilhamento
- `useDynamicURL`: Gerenciamento de URLs dinâmicas
- `useClickOutside`: Detecção de cliques externos
- `usePainelDimensions`: Responsividade e dimensões

### MapaEscolasIndigenas
Componente responsável pela visualização e interação com o mapa:

#### Subcomponentes
- `MapaBase`: Configuração base do Leaflet
- `Marcadores`: Marcadores de escolas no mapa
- `TerrasIndigenas`: Camada de terras indígenas
- `EstadoSP`: Camada do estado de São Paulo
- `MenuCamadas`: Controle de visibilidade das camadas

#### Funcionalidades
- Visualização interativa
- Controle de camadas
- Interação com marcadores
- Responsividade
- Suporte a diferentes tipos de dados

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

## Conversões e Limpeza de Dependências

As conversões de arquivos GeoJSON e imagens (para WebP) já foram realizadas durante o processo de otimização do projeto. Por isso, as dependências e scripts auxiliares utilizados para essas tarefas (como `sharp`, `geojson` e scripts de conversão) foram removidos do projeto para manter o ambiente de produção limpo e enxuto.

Essas ferramentas só são necessárias caso novas conversões sejam feitas no futuro. Para rodar o site em produção, não é preciso instalar essas dependências.
