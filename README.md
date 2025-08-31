# OPIN (Observatório dos Professores Indígenas no Estado de São Paulo)

Portal informativo interativo que mapeia e apresenta informações detalhadas sobre escolas indígenas no estado de São Paulo, Brasil.

**🌐 Site:** https://hericmr.github.io/escolasindigenas/

---

## 🎯 Guia do Administrador

### Painel de Administração (`/admin`)

Edite todas as informações das escolas através de abas organizadas:

#### Abas Principais
- **📋 Dados Básicos**: Nome, município, endereço, TI, diretoria
- **👥 Povos**: Povos indígenas e línguas faladas
- **🎓 Modalidades**: Ensino, alunos, turnos
- **🏗️ Infraestrutura**: Estrutura, água, internet, equipamentos, **cozinha**, **merenda escolar**, **merenda diferenciada**
- **👨‍🏫 Gestores**: Direção, professores, formação
- **📚 Material Pedagógico**: PPP próprio e com comunidade
- **🤝 Projetos**: Parcerias, ONGs, desejos da comunidade
- **📱 Redes Sociais**: Links e uso de redes
- **🎥 Vídeo**: Links para vídeos da escola
- **📖 Histórias**: História da escola
- **👨‍🏫 História dos Professores**: Sistema para múltiplos professores
- **📍 Coordenadas**: Latitude e longitude
- **🖼️ Imagens**: Upload de fotos da escola e professores
- **📄 Documentos**: Gerenciamento de PDFs

---

## 🗄️ Estrutura das Tabelas

### Tabela Principal: `escolas_completa`

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

-- Novos campos de infraestrutura
cozinha (text) -- Ex: "Sim", "Não", "Em construção"
merenda_escolar (text) -- Ex: "Sim", "Não", "Parcial"
diferenciada (text) -- Ex: "Sim", "Não", "Específica"
merenda_diferenciada (text) -- Detalhes sobre a merenda

-- Campos de endereço detalhado
logradouro (text)
numero (text)
complemento (text)
bairro (text)
cep (text)
estado (text, default 'SP')
```

### Tabela: `historias_professor`

```sql
id (int, primary key)
escola_id (int, foreign key)
nome_professor (text, NOT NULL)
historia (text, NOT NULL)
ordem (int, default 1)
ativo (boolean, default true)
created_at (timestamp)
updated_at (timestamp)
```

### Tabela: `documentos_escola`

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

---

## 🔧 Comandos Úteis

```bash
npm install    # Instalar dependências
npm start      # Iniciar servidor de desenvolvimento
npm run build  # Build para produção
npm run deploy # Deploy no GitHub Pages
```

### Supabase (Permissões)
```sql
-- Liberar permissões para histórias dos professores
GRANT ALL ON TABLE historias_professor TO authenticated;
GRANT ALL ON TABLE historias_professor TO anon;
```

---

## 📝 Notas Importantes

### Formulários
- **História dos Professores**: Formulário independente
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
- Verifique campos obrigatórios
- Confirme erros no console do navegador
- Verifique permissões no Supabase

### Imagens não carregam
- Verifique se o arquivo não excede 5MB
- Confirme formato (JPG, PNG, GIF)
- Verifique conexão com internet

---

## Tecnologias

### Frontend
- **React 18** - Biblioteca principal
- **TailwindCSS** - Framework CSS
- **Lucide React** - Ícones
- **OpenLayers** - Mapas interativos de alta performance
- **Framer Motion** - Animações
- **React Router** - Roteamento

### Dados e APIs
- **Supabase** - Backend e banco de dados
- **GeoJSON** - Dados geográficos
- **PapaParse** - Parser CSV
- **React Markdown** - Conteúdo markdown

---

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

3. Inicie o servidor:
```bash
npm start
```

---

## Estrutura do Projeto

```
src/
├── components/
│   ├── PainelInformacoes/     # Informações detalhadas
│   ├── MapaEscolasIndigenas/  # Mapa interativo
│   ├── AdminPanel/            # Painel de administração
│   ├── EditEscolaPanel/       # Edição de escolas
│   └── ...
├── services/                  # Serviços de API
├── utils/                     # Utilitários
└── App.js                     # Componente raiz
```

---

## Campos Obrigatórios para o Mapa

- **Latitude** e **Longitude**: Essenciais para marcadores no mapa
- **Nome da escola**: Exibido no popup do marcador
- **Município**: Informação básica da escola

**Dica:** Sempre valide as coordenadas e relacionamentos entre tabelas para garantir funcionamento correto do mapa.
