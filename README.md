# Escolas Indígenas

Um portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil. O projeto visa facilitar o acesso a dados educacionais e culturais dessas instituições, promovendo maior visibilidade e compreensão da educação indígena.

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

## Estrutura dos arquivos CSV utilizados no Supabase

Os arquivos CSV importados/exportados para o Supabase devem seguir a estrutura abaixo para a tabela principal de escolas indígenas (`escolas_completa`). Cada coluna representa um campo da tabela. Certifique-se de que o cabeçalho do CSV corresponda exatamente aos nomes das colunas listadas.

### Tabela: escolas_completa

| Coluna                        | Tipo         | Descrição                                                                 |
|-------------------------------|--------------|--------------------------------------------------------------------------|
| id                            | inteiro      | Identificador único da escola                                            |
| Escola                        | texto        | Nome da escola                                                          |
| Município                     | texto        | Município onde a escola está localizada                                  |
| Endereço                      | texto        | Endereço completo da escola                                              |
| Terra Indigena (TI)           | texto        | Nome da terra indígena associada                                         |
| Escola Estadual ou Municipal  | texto        | Tipo administrativo da escola                                            |
| Parcerias com o município     | booleano     | Indica se há parcerias com o município                                   |
| Diretoria de Ensino           | texto        | Diretoria de ensino responsável                                          |
| Ano de criação da escola      | inteiro      | Ano de fundação da escola                                                |
| Povos indigenas               | texto        | Povos indígenas atendidos                                               |
| Linguas faladas               | texto        | Línguas faladas na escola                                               |
| Modalidade de Ensino/turnos de funcionamento | texto | Modalidade e turnos de ensino                                 |
| Numero de alunos              | inteiro      | Número de alunos                                                        |
| Disciplinas bilíngues?        | booleano     | Indica se há disciplinas bilíngues                                       |
| Material pedagógico não indígena | booleano  | Indica se há material pedagógico não indígena                            |
| Material pedagógico indígena  | booleano     | Indica se há material pedagógico indígena                                |
| Práticas pedagógicas indígenas| texto        | Descrição das práticas pedagógicas indígenas                             |
| Formas de avaliação           | texto        | Métodos de avaliação utilizados                                          |
| Espaço escolar e estrutura    | texto        | Descrição da infraestrutura física                                       |
| Cozinha/Merenda escolar/diferenciada | texto | Informações sobre alimentação escolar                          |
| Acesso à água                 | texto        | Descrição do acesso à água                                               |
| Tem coleta de lixo?           | booleano     | Indica se há coleta de lixo                                              |
| Acesso à internet             | booleano     | Indica se há acesso à internet                                           |
| Equipamentos Tecnológicos (Computadores, tablets e impressoras) | texto | Equipamentos disponíveis |
| Modo de acesso à escola       | texto        | Como se chega à escola                                                   |
| Gestão/Nome                   | texto        | Nome da gestão                                                          |
| Outros funcionários           | texto        | Outros funcionários da escola                                            |
| Quantidade de professores indígenas | inteiro | Número de professores indígenas                                 |
| Quantidade de professores não indígenas | inteiro | Número de professores não indígenas                          |
| Professores falam a língua indígena? | booleano | Se professores falam a língua indígena                        |
| Formação dos professores      | texto        | Formação dos professores                                                 |
| Formação continuada oferecida | texto        | Formação continuada disponível                                           |
| A escola possui PPP próprio?  | booleano     | Se possui Projeto Político Pedagógico próprio                            |
| PPP elaborado com a comunidade? | booleano   | Se o PPP foi elaborado com a comunidade                                  |
| Projetos em andamento         | texto        | Projetos em andamento                                                    |
| Parcerias com universidades?  | booleano     | Se há parcerias com universidades                                        |
| Ações com ONGs ou coletivos?  | booleano     | Se há ações com ONGs ou coletivos                                        |
| Desejos da comunidade para a escola | texto  | Expectativas/desejos da comunidade                                       |
| Escola utiliza redes sociais? | booleano     | Se a escola utiliza redes sociais                                        |
| Links das redes sociais       | texto        | URLs das redes sociais, separados por vírgula                            |
| historia_da_escola            | texto        | História da escola                                                       |
| Latitude                      | número       | Latitude geográfica                                                      |
| Longitude                     | número       | Longitude geográfica                                                     |
| links                         | texto        | Links diversos relacionados à escola                                     |
| imagens                       | texto        | URLs de imagens, separados por vírgula                                   |
| audio                         | texto        | URLs de arquivos de áudio                                                |
| video                         | texto        | URLs de vídeos                                                           |
| link_para_documentos          | texto        | URLs de documentos (PDFs, etc.)                                          |
| link_para_videos              | texto        | URLs de vídeos adicionais                                                |

> **Observações:**
> - Campos booleanos devem ser preenchidos com `TRUE`/`FALSE` ou `1`/`0`.
> - Campos de lista (como imagens, links, redes sociais) devem ser separados por vírgula.
> - Certifique-se de que os nomes das colunas estejam exatamente como acima para evitar erros de importação.
> - Para outros CSVs (como documentos, mídias, etc.), siga a mesma lógica: cada coluna representa um campo da tabela correspondente no Supabase.

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
