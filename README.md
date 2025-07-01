# OPIN (Observatório dos Professores Indígenas no Estado de São Paulo)

Um portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil. O projeto visa facilitar o acesso a dados educacionais e culturais dessas instituições, promovendo maior visibilidade e compreensão da educação indígena.

---

## 🎯 Guia do Administrador

### Painel de Administração

O painel de administração permite editar todas as informações das escolas indígenas através de abas organizadas:

#### Como Acessar
1. Acesse `/admin` na aplicação
2. Selecione uma escola na lista lateral
3. Use as abas para navegar entre as seções

#### Abas Disponíveis

**📋 Dados Básicos**
- Nome da escola, município, endereço completo
- Terra Indígena (TI), diretoria de ensino
- Ano de criação, parcerias com município

**👥 Povos**
- Povos indígenas atendidos
- Línguas faladas na comunidade

**🎓 Modalidades**
- Modalidade de ensino/turnos
- Número de alunos
- Turnos de funcionamento

**🏗️ Infraestrutura**
- Espaço escolar e estrutura
- Acesso à água, coleta de lixo
- Internet, equipamentos tecnológicos
- Modo de acesso à escola

**👨‍🏫 Gestores**
- Gestão/nome do diretor
- Quantidade de professores (indígenas/não indígenas)
- Formação dos professores
- Formação continuada oferecida

**📚 Material Pedagógico**
- PPP próprio da escola
- PPP elaborado com a comunidade

**🤝 Projetos e Parcerias**
- Projetos em andamento
- Parcerias com universidades
- Ações com ONGs ou coletivos
- Desejos da comunidade

**📱 Redes Sociais**
- Uso de redes sociais pela escola
- Links das redes sociais

**🎥 Vídeo**
- Link para vídeos da escola
- Pré-visualização automática

**📖 Histórias**
- História da escola

**👨‍🏫 História dos Professores** ⭐ **NOVO**
- Sistema para múltiplos professores registrarem suas histórias
- Cada professor pode ter sua história individual
- Ordenação personalizável das histórias

**📍 Coordenadas**
- Latitude e longitude da escola

**🖼️ Imagens da Escola**
- Upload e gerenciamento de imagens
- Legendas editáveis para cada imagem

**👨‍🏫 Imagens dos Professores**
- Upload e gerenciamento de fotos dos professores
- Legendas editáveis para cada foto

**📄 Documentos**
- Adicionar, editar e remover documentos
- Links para PDFs (Google Drive recomendado)

---

## 🗄️ Estrutura das Tabelas

### Tabela Principal: `escolas_completa`
Armazena todos os dados básicos das escolas:

```sql
-- Campos principais
id (int, primary key)
Escola (text) -- Nome da escola
Município (text)
Endereço (text)
Terra Indigena (TI) (text)
Povos indigenas (text)
Linguas faladas (text)
Modalidade de Ensino/turnos de funcionamento (text)
Numero de alunos (text)
Espaço escolar e estrutura (text)
Gestão/Nome (text)
Quantidade de professores indígenas (text)
Quantidade de professores não indígenas (text)
historia_da_escola (text)
latitude (numeric)
longitude (numeric)
link_para_videos (text)
-- ... outros campos
```

### Nova Tabela: `historias_professor` ⭐
Permite que múltiplos professores registrem suas histórias:

```sql
id (int, primary key)
escola_id (int, foreign key) -- Referência à escola
nome_professor (text, NOT NULL) -- Nome do professor
historia (text, NOT NULL) -- História do professor
ordem (int, default 1) -- Ordem de exibição
ativo (boolean, default true) -- Se a história está ativa
created_at (timestamp)
updated_at (timestamp)
```

**Como usar:**
1. Acesse a aba "História dos Professores"
2. Clique em "Nova História" para adicionar um professor
3. Preencha nome e história do professor
4. Use os botões de seta para reordenar as histórias
5. Clique em "Editar" para modificar uma história existente

### Tabela: `documentos_escola`
Armazena documentos relacionados às escolas:

```sql
id (int, primary key)
escola_id (int, foreign key)
titulo (text, NOT NULL)
autoria (text)
tipo (text)
link_pdf (text, NOT NULL)
created_at (timestamp)
```

### Tabelas de Imagens
- `escola_images`: Imagens da escola com legendas
- `professor_images`: Imagens dos professores com legendas

---

## 🛠️ Funcionalidades Especiais

### Sistema de Vídeos
- Suporte a YouTube, Vimeo e outros
- Pré-visualização automática
- Títulos editáveis

### Gerenciamento de Imagens
- Upload direto via interface
- Legendas editáveis em tempo real
- Organização por escola

### Histórias dos Professores
- Sistema independente para cada professor
- Ordenação personalizável
- Ativação/desativação de histórias
- Formulário dedicado fora do form principal

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm install    # Instalar dependências
npm start      # Iniciar servidor de desenvolvimento
npm run build  # Build para produção
```

### Supabase (Permissões)
```sql
-- Liberar permissões para histórias dos professores
GRANT ALL ON TABLE historias_professor TO authenticated;
GRANT ALL ON TABLE historias_professor TO anon;

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'historias_professor';
```

---

## 📝 Notas Importantes

### Formulários
- **História dos Professores**: Formulário independente (não afeta outros dados)
- **Outras abas**: Todas dentro do form principal da escola
- **Salvamento**: Cada aba salva independentemente

### Dados Obrigatórios
- Nome da escola (Dados Básicos)
- Nome do professor (História dos Professores)
- História do professor (História dos Professores)
- Título e link do documento (Documentos)

### Boas Práticas
- Use links do Google Drive para documentos (permissão pública)
- Mantenha histórias dos professores organizadas por ordem
- Verifique coordenadas antes de salvar
- Teste links de vídeo antes de salvar

---

## 🆘 Solução de Problemas

### Formulário não salva
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se não há erros no console do navegador
- Verifique permissões no Supabase

### Imagens não carregam
- Verifique se o arquivo não excede 5MB
- Confirme formato (JPG, PNG, GIF)
- Verifique conexão com internet

### Histórias dos professores não atualizam
- O formulário é independente - não afeta outros dados
- Verifique logs no console do navegador
- Confirme se o professor está ativo na lista

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
│   ├── AdminPanel/                 # Painel de administração
│   │   ├── components/             # Componentes do painel admin
│   │   │   ├── VideoSection.js     # Gerenciamento de vídeos
│   │   │   ├── LegendasFotosSection.js # Gerenciamento de legendas
│   │   │   └── HistoriaProfessorManager.js # Gerenciamento de histórias
│   │   └── index.js                # Painel principal de admin
│   ├── EditEscolaPanel/            # Painel de edição de escolas
│   │   ├── ImageUploadSection.js   # Upload de imagens da escola
│   │   ├── ProfessorImageUploadSection.js # Upload de imagens dos professores
│   │   ├── VideoSection.js         # Seção de vídeos integrada
│   │   └── index.js                # Painel de edição
│   ├── PainelHeader/               # Cabeçalho do painel
│   │   └── index.js                # Componente do cabeçalho
│   ├── PainelDescricao/            # Componente de descrição
│   │   └── index.js                # Renderização de descrições
│   └── PainelLinks/                # Componente de links
│       └── index.js                # Lista de links
├── hooks/                          # Hooks globais
│   ├── useMapData.js               # Gerenciamento de dados do mapa
│   └── useMapInteractions.js       # Interações com o mapa
├── services/                       # Serviços de API
│   ├── legendasService.js          # Serviço de legendas de fotos
│   ├── escolaImageService.js       # Serviço de imagens da escola
│   ├── historiaProfessorService.js # Serviço de histórias do professor
│   └── supabaseClient.js           # Cliente Supabase
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

### AdminPanel
Painel de administração para gerenciar conteúdo das escolas:

#### Componentes
- `VideoSection`: Gerenciamento integrado de vídeos
  - Vídeo principal com título editável
  - Múltiplos vídeos adicionais
  - Pré-visualização automática
  - Interface intuitiva

- `LegendasFotosSection`: Gerenciamento de legendas de fotos
  - Suporte a fotos da escola e dos professores
  - Campo tipo_foto para diferenciação
  - CRUD completo de legendas

- `HistoriaProfessorManager`: Gerenciamento de histórias dos professores
  - CRUD de histórias
  - Upload de imagens para histórias
  - Interface completa

### EditEscolaPanel
Painel de edição específico para escolas:

#### Componentes
- `ImageUploadSection`: Upload e gerenciamento de imagens da escola
  - Drag & drop para upload
  - Campos de legenda diretos abaixo de cada imagem
  - Salvamento automático ao pressionar Enter
  - Interface responsiva e intuitiva

- `ProfessorImageUploadSection`: Upload e gerenciamento de imagens dos professores
  - Mesmas funcionalidades do ImageUploadSection
  - Suporte a gênero (professor/professora)
  - Campo de título da história

- `VideoSection`: Seção integrada de vídeos
  - Mesma funcionalidade do AdminPanel
  - Integração direta no painel de edição

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

## Funcionalidades Avançadas

### Sistema de Legendas de Fotos
- **Tipos de Foto**: Suporte a fotos da escola e dos professores
- **Campos Diretos**: Input de legenda diretamente abaixo de cada imagem
- **Salvamento Inteligente**: Salva ao pressionar Enter ou sair do campo
- **Feedback Visual**: Atualização imediata da interface
- **Validação**: Prevenção de legendas duplicadas

### Sistema de Vídeos Integrado
- **Vídeo Principal**: Campo para vídeo principal com título editável
- **Vídeos Múltiplos**: Suporte a múltiplos vídeos por escola
- **Pré-visualização**: Visualização automática de vídeos do YouTube, Vimeo, etc.
- **Gerenciamento Completo**: Adicionar, editar, remover vídeos
- **Interface Intuitiva**: Design limpo e fácil de usar

### Upload de Imagens
- **Drag & Drop**: Interface moderna para upload de imagens
- **Validação**: Verificação de tipo e tamanho de arquivo
- **Progress Bar**: Indicador visual de progresso do upload
- **Limites**: Controle de quantidade máxima de imagens
- **Responsividade**: Interface adaptável a diferentes dispositivos

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
| logradouro                    | texto        | Não         | Rua Exemplo, 123       | Nome da rua, avenida, etc.                 |
| numero                        | texto        | Não         | 123                   | Número do endereço                         |
| complemento                   | texto        | Não         | Apto 101               | Complemento do endereço                     |
| bairro                        | texto        | Não         | Centro                 | Nome do bairro                             |
| cep                           | texto        | Não         | 12345-678             | CEP do endereço                            |
| estado                        | texto        | Não         | SP                    | Estado (padrão: SP)                         |
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
