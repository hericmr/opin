# OPIN (Observatório dos Professores Indígenas no Estado de São Paulo)

Um portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil. O projeto visa facilitar o acesso a dados educacionais e culturais dessas instituições, promovendo maior visibilidade e compreensão da educação indígena.

---

## 🆕 Novidade: Aba de Vídeo no Painel de Edição

O painel de administração agora conta com uma **aba exclusiva para inserção de vídeo**. Nela, é possível adicionar um link de vídeo (YouTube, Vimeo, etc.) relacionado à escola indígena, com pré-visualização automática do conteúdo.

**Como usar:**
1. Acesse o painel de administração e selecione uma escola para editar.
2. Clique na aba **Vídeo**.
3. Cole o link do vídeo desejado no campo indicado.
4. Veja a pré-visualização do vídeo diretamente no painel.

> **Obs:** O campo de vídeo foi removido da aba "Redes Sociais" e agora está centralizado na nova aba "Vídeo".

---

## Tecnologias

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

## Instalação

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

## Estrutura do Projeto

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

## Componentes Principais

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

## Estilização

O projeto utiliza TailwindCSS com configurações personalizadas:
- Sistema de cores verde para identidade visual
- Componentes responsivos
- Tipografia otimizada para leitura
- Animações suaves para interações



## Estrutura dos arquivos CSV utilizados no Supabase

Os arquivos CSV importados/exportados para o Supabase devem seguir a estrutura abaixo para a tabela principal de escolas indígenas (`escolas_completa`). Cada coluna representa um campo da tabela. Certifique-se de que o cabeçalho do CSV corresponda exatamente aos nomes das colunas listadas.

### Estrutura da tabela: escolas_completa (Supabase)

| Coluna                                      | Tipo     | Obrigatório | Observação |
|---------------------------------------------|----------|-------------|------------|
| id                                          | integer  | Sim         | Chave primária, auto-incremento |
| Escola                                      | text     | Não         | Nome da escola |
| Município                                   | text     | Não         | |
| Endereço                                    | text     | Não         | |
| Terra Indigena (TI)                         | text     | Não         | |
| Escola Estadual ou Municipal                | text     | Não         | |
| Parcerias com o município                   | text     | Não         | |
| Diretoria de Ensino                         | text     | Não         | |
| Povos indigenas                             | text     | Não         | |
| Linguas faladas                             | text     | Não         | |
| Ano de criação da escola                    | text     | Não         | |
| Modalidade de Ensino/turnos de funcionamento| text     | Não         | |
| Numero de alunos                            | text     | Não         | |
| Espaço escolar e estrutura                  | text     | Não         | |
| Cozinha/Merenda escolar/diferenciada        | text     | Não         | |
| Acesso à água                               | text     | Não         | |
| Tem coleta de lixo?                         | text     | Não         | |
| Acesso à internet                           | text     | Não         | |
| Equipamentos Tecnológicos                   | text     | Não         | |
| Modo de acesso à escola                     | text     | Não         | |
| Gestão/Nome                                 | text     | Não         | |
| Outros funcionários                         | text     | Não         | |
| Quantidade de professores indígenas         | text     | Não         | |
| Quantidade de professores não indígenas     | text     | Não         | |
| Professores falam a língua indígena?        | text     | Não         | |
| Formação dos professores                    | text     | Não         | |
| Formação continuada oferecida               | text     | Não         | |
| A escola possui PPP próprio?                | text     | Não         | |
| PPP elaborado com a comunidade?             | text     | Não         | |
| Disciplinas bilíngues?                      | text     | Não         | |
| Material pedagógico não indígena            | text     | Não         | |
| Material pedagógico indígena                | text     | Não         | |
| Práticas pedagógicas indígenas              | text     | Não         | |
| Formas de avaliação                         | text     | Não         | |
| Projetos em andamento                       | text     | Não         | |
| Parcerias com universidades?                | text     | Não         | |
| Ações com ONGs ou coletivos?                | text     | Não         | |
| Desejos da comunidade para a escola         | text     | Não         | |
| Escola utiliza redes sociais?               | text     | Não         | |
| Links das redes sociais                     | text     | Não         | |
| historia_da_escola                          | text     | Não         | |
| Latitude                                    | numeric  | Não         | |
| Longitude                                   | numeric  | Não         | |
| link_para_videos                            | text     | Não         | |
| historia_do_prof                            | text     | Não         | |

> Observação: Apenas o campo 'id' é obrigatório (not null). Todos os outros campos podem ser nulos. Para uso no frontend, trate todos os campos como string, exceto 'id', 'Latitude' e 'Longitude', que devem ser tratados como números.

# Tutorial: Como Preencher as Tabelas no Supabase para o Mapa Leaflet

## 1. Introdução
O site utiliza o Supabase como banco de dados para alimentar o mapa interativo feito com Leaflet. Cada marcador representa uma escola indígena, e ao clicar, são exibidas informações detalhadas, imagens e documentos. Todos esses dados vêm das tabelas do Supabase.

---

## 2. Tabelas Necessárias

- **escolas_completa**: tabela principal, reúne todas as informações da escola, incluindo localização (latitude/longitude), descrição, dados administrativos, etc.
- **imagens_escola**: armazena URLs de imagens associadas a cada escola.
- **documentos_escola**: armazena URLs de documentos (PDFs, links, etc) associados a cada escola.

---

## 3. Estrutura das Tabelas

### Tabela: `escolas_completa`

| Coluna                        | Tipo         | Obrigatório | Exemplo                | Descrição                                 |
|-------------------------------|--------------|-------------|------------------------|-------------------------------------------|
| id                            | inteiro      | Sim         | 1                      | Identificador único da escola             |
| Escola                        | texto        | Sim         | Escola Indígena X      | Nome da escola                            |
| Município                     | texto        | Sim         | Santos                 | Município                                 |
| Endereço                      | texto        | Não         | Rua Exemplo, 123       | Endereço completo                         |
| Terra Indigena (TI)           | texto        | Não         | Terra X                | Nome da terra indígena associada          |
| Escola Estadual ou Municipal  | texto        | Não         | Estadual               | Tipo administrativo                       |
| Parcerias com o município     | booleano     | Não         | TRUE                   | Parcerias com município                   |
| Diretoria de Ensino           | texto        | Não         | Diretoria Y            | Diretoria responsável                     |
| Ano de criação da escola      | inteiro      | Não         | 2001                   | Ano de fundação                           |
| Povos indigenas               | texto        | Não         | Povo X, Povo Y         | Povos atendidos                           |
| Linguas faladas               | texto        | Não         | Tupi, Guarani          | Línguas faladas                           |
| Modalidade de Ensino/turnos de funcionamento | texto | Não | Integral | Modalidade e turnos de ensino             |
| Numero de alunos              | inteiro      | Não         | 120                    | Número de alunos                          |
| ...                           | ...          | ...         | ...                    | ... (outros campos descritivos)           |
| historia_da_escola            | texto        | Não         | ...                    | História da escola                        |
| Latitude                      | número       | Sim         | -23.5505               | Latitude geográfica                       |
| Longitude                     | número       | Sim         | -46.6333               | Longitude geográfica                      |
| links                         | texto        | Não         | http://...             | Links diversos                            |
| imagens                       | texto        | Não         | http://.../img1.jpg    | URLs de imagens (pode ser ignorado se usar imagens_escola) |
| audio                         | texto        | Não         | http://.../audio.mp3   | URLs de áudio                             |
| video                         | texto        | Não         | http://.../video.mp4   | URLs de vídeo                             |
| link_para_documentos          | texto        | Não         | http://.../doc.pdf     | URLs de documentos                        |
| link_para_videos              | texto        | Não         | http://.../video2.mp4  | URLs de vídeos adicionais                 |

> **Obs:** Os nomes das colunas devem ser exatamente iguais aos do Supabase.

---

### Tabela: `imagens_escola`

| Coluna      | Tipo   | Obrigatório | Exemplo                                 | Descrição                  |
|-------------|--------|-------------|-----------------------------------------|----------------------------|
| id          | inteiro| Sim         | 1                                       | Identificador da imagem    |
| escola_id   | inteiro| Sim         | 1                                       | Relaciona à tabela escolas_completa |
| url         | texto  | Sim         | https://.../imagem1.jpg                 | URL pública da imagem      |
| descricao   | texto  | Não         | Fachada da escola                       | Descrição da imagem        |

---

### Tabela: `documentos_escola`

| Coluna      | Tipo   | Obrigatório | Exemplo                                 | Descrição                  |
|-------------|--------|-------------|-----------------------------------------|----------------------------|
| id          | inteiro| Sim         | 1                                       | Identificador do documento |
| escola_id   | inteiro| Sim         | 1                                       | Relaciona à tabela escolas_completa |
| url         | texto  | Sim         | https://.../documento1.pdf              | URL pública do documento   |
| titulo      | texto  | Não         | Projeto Político Pedagógico              | Título do documento        |
| tipo        | texto  | Não         | PDF                                     | Tipo do documento          |

---

## 4. Como Cadastrar um Novo Ponto

### Via Interface do Supabase

1. Acesse o projeto no [Supabase](https://app.supabase.com/).
2. No menu lateral, clique em **Table Editor**.
3. Selecione a tabela `escolas_completa` e clique em **Insert Row**.
   - Preencha todos os campos obrigatórios, especialmente `id`, `Escola`, `Município`, `Latitude` e `Longitude`.
4. Para adicionar imagens, vá para a tabela `imagens_escola` e insira uma nova linha:
   - Preencha `escola_id` com o mesmo `id` da escola cadastrada.
   - Preencha `url` com o link da imagem.
   - (Opcional) Preencha `descricao`.
5. Para adicionar documentos, vá para a tabela `documentos_escola` e insira uma nova linha:
   - Preencha `escola_id` com o mesmo `id` da escola cadastrada.
   - Preencha `url` com o link do documento.
   - (Opcional) Preencha `titulo` e `tipo`.

### Via Importação CSV

1. Prepare um arquivo CSV para cada tabela, com as colunas correspondentes.
2. No Supabase, acesse a tabela desejada e clique em **Import Data**.
3. Faça upload do CSV e confira se os dados foram importados corretamente.
4. Repita para cada tabela.

---

## 5. Campos Obrigatórios e Validações

- **Latitude** e **Longitude** são essenciais para que o marcador apareça no mapa. Se estiverem ausentes ou inválidos, o ponto não será exibido.
- O campo `id` em `escolas_completa` deve ser único e usado como referência em `imagens_escola` e `documentos_escola` via `escola_id`.
- Se algum campo obrigatório estiver ausente, o marcador pode não aparecer ou as informações exibidas podem ficar incompletas.

---

## 6. Atualização dos Dados

- O site busca os dados diretamente do Supabase. **Se o frontend estiver configurado para buscar dados em tempo real ou a cada carregamento, as alterações aparecerão automaticamente ao recarregar a página.**
- Caso o site utilize build estático (SSG), pode ser necessário rodar novamente o comando de build e deploy para refletir as mudanças.
- Em caso de dúvida, após atualizar os dados no Supabase, recarregue o site e confira se os novos pontos e informações aparecem corretamente.

---

**Dica:** Sempre valide as coordenadas e os relacionamentos entre as tabelas para garantir que todos os marcadores funcionem como esperado no mapa.
