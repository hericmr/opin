# Dashboard - Estrutura de Dados OPIN

Documentação detalhada da estrutura de dados para criação de dashboard com Python.

---

## 🗄️ Estrutura do Banco de Dados Supabase

### Tabela Principal: `escolas_completa`

```sql
-- Estrutura completa da tabela principal
CREATE TABLE escolas_completa (
    id SERIAL PRIMARY KEY,
    
    -- Dados Básicos
    "Escola" TEXT NOT NULL,
    "Município" TEXT,
    "Endereço" TEXT,
    "Terra Indigena (TI)" TEXT,
    "Parcerias com o município" TEXT,
    "Diretoria de Ensino" TEXT,
    "Ano de criação da escola" TEXT,
    
    -- Povos e Línguas
    "Povos indigenas" TEXT,
    "Linguas faladas" TEXT,
    
    -- Modalidades de Ensino
    "Modalidade de Ensino/turnos de funcionamento" TEXT,
    "Numero de alunos" TEXT,
    "turnos_funcionamento" TEXT,
    
    -- Infraestrutura
    "Espaço escolar e estrutura" TEXT,
    "Acesso à água" TEXT,
    "Tem coleta de lixo?" TEXT,
    "Acesso à internet" TEXT,
    "Equipamentos Tecnológicos (Computadores, tablets e impressoras)" TEXT,
    "Modo de acesso à escola" TEXT,
    
    -- Novos campos de infraestrutura (2024)
    "cozinha" TEXT, -- "Sim", "Não", "Em construção"
    "merenda_escolar" TEXT, -- "Sim", "Não", "Parcial"
    "diferenciada" TEXT, -- "Sim", "Não", "Específica"
    "merenda_diferenciada" TEXT, -- Detalhes sobre a merenda
    
    -- Gestão e Professores
    "Gestão/Nome" TEXT,
    "Outros funcionários" TEXT,
    "Quantidade de professores indígenas" TEXT,
    "Quantidade de professores não indígenas" TEXT,
    "Professores falam a língua indígena?" TEXT,
    "Formação dos professores" TEXT,
    "Formação continuada oferecida" TEXT,
    
    -- Projeto Pedagógico
    "A escola possui PPP próprio?" TEXT,
    "PPP elaborado com a comunidade?" TEXT,
    
    -- Projetos e Parcerias
    "Projetos em andamento" TEXT,
    "Parcerias com universidades?" TEXT,
    "Ações com ONGs ou coletivos?" TEXT,
    "Desejos da comunidade para a escola" TEXT,
    
    -- Redes Sociais e Links
    "Escola utiliza redes sociais?" TEXT,
    "Links das redes sociais" TEXT,
    "links" TEXT,
    "link_para_videos" TEXT,
    
    -- Histórias
    "historia_da_escola" TEXT,
    
    -- Localização
    "latitude" NUMERIC,
    "longitude" NUMERIC,
    
    -- Endereço Detalhado
    "logradouro" TEXT,
    "numero" TEXT,
    "complemento" TEXT,
    "bairro" TEXT,
    "cep" TEXT,
    "estado" TEXT DEFAULT 'SP',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `historias_professor`

```sql
CREATE TABLE historias_professor (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id) ON DELETE CASCADE,
    nome_professor TEXT NOT NULL,
    historia TEXT NOT NULL,
    ordem INTEGER DEFAULT 1,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `documentos_escola`

```sql
CREATE TABLE documentos_escola (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    autoria TEXT,
    tipo TEXT,
    link_pdf TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `escola_images`

```sql
CREATE TABLE escola_images (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    descricao TEXT,
    ordem INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela: `professor_images`

```sql
CREATE TABLE professor_images (
    id SERIAL PRIMARY KEY,
    escola_id INTEGER REFERENCES escolas_completa(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    descricao TEXT,
    genero TEXT, -- "professor" ou "professora"
    titulo_historia TEXT,
    ordem INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📊 Análise de Dados para Dashboard

### Métricas Principais

#### 1. **Distribuição Geográfica**
```sql
-- Escolas por município
SELECT 
    "Município",
    COUNT(*) as total_escolas
FROM escolas_completa 
WHERE "Município" IS NOT NULL
GROUP BY "Município"
ORDER BY total_escolas DESC;

-- Escolas por Terra Indígena
SELECT 
    "Terra Indigena (TI)",
    COUNT(*) as total_escolas
FROM escolas_completa 
WHERE "Terra Indigena (TI)" IS NOT NULL
GROUP BY "Terra Indigena (TI)"
ORDER BY total_escolas DESC;
```

#### 2. **Infraestrutura**
```sql
-- Status da cozinha
SELECT 
    cozinha,
    COUNT(*) as total_escolas,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM escolas_completa), 2) as percentual
FROM escolas_completa 
WHERE cozinha IS NOT NULL
GROUP BY cozinha;

-- Status da merenda escolar
SELECT 
    merenda_escolar,
    COUNT(*) as total_escolas,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM escolas_completa), 2) as percentual
FROM escolas_completa 
WHERE merenda_escolar IS NOT NULL
GROUP BY merenda_escolar;

-- Acesso à internet
SELECT 
    "Acesso à internet",
    COUNT(*) as total_escolas
FROM escolas_completa 
WHERE "Acesso à internet" IS NOT NULL
GROUP BY "Acesso à internet";
```

#### 3. **Corpo Docente**
```sql
-- Total de professores por tipo
SELECT 
    SUM(CAST("Quantidade de professores indígenas" AS INTEGER)) as total_prof_indigenas,
    SUM(CAST("Quantidade de professores não indígenas" AS INTEGER)) as total_prof_nao_indigenas
FROM escolas_completa 
WHERE "Quantidade de professores indígenas" ~ '^[0-9]+$'
   OR "Quantidade de professores não indígenas" ~ '^[0-9]+$';

-- Escolas com professores que falam língua indígena
SELECT 
    "Professores falam a língua indígena?",
    COUNT(*) as total_escolas
FROM escolas_completa 
WHERE "Professores falam a língua indígena?" IS NOT NULL
GROUP BY "Professores falam a língua indígena?";
```

#### 4. **Modalidades de Ensino**
```sql
-- Distribuição por modalidade
SELECT 
    "Modalidade de Ensino/turnos de funcionamento",
    COUNT(*) as total_escolas
FROM escolas_completa 
WHERE "Modalidade de Ensino/turnos de funcionamento" IS NOT NULL
GROUP BY "Modalidade de Ensino/turnos de funcionamento"
ORDER BY total_escolas DESC;
```

#### 5. **Povos e Línguas**
```sql
-- Povos mais representados
SELECT 
    "Povos indigenas",
    COUNT(*) as total_escolas
FROM escolas_completa 
WHERE "Povos indigenas" IS NOT NULL
GROUP BY "Povos indigenas"
ORDER BY total_escolas DESC
LIMIT 10;

-- Línguas mais faladas
SELECT 
    "Linguas faladas",
    COUNT(*) as total_escolas
FROM escolas_completa 
WHERE "Linguas faladas" IS NOT NULL
GROUP BY "Linguas faladas"
ORDER BY total_escolas DESC
LIMIT 10;
```

---

## 🗂️ Estrutura de Buckets (Storage)

### Bucket: `escola-images`
```
escola-images/
├── escola_{id}/
│   ├── fachada.jpg
│   ├── sala_aula.jpg
│   ├── patio.jpg
│   └── ...
```

### Bucket: `professor-images`
```
professor-images/
├── escola_{id}/
│   ├── professor_1.jpg
│   ├── professor_2.jpg
│   └── ...
```

### Bucket: `documentos`
```
documentos/
├── escola_{id}/
│   ├── ppp.pdf
│   ├── projeto_pedagogico.pdf
│   └── ...
```

---

## 📈 Sugestões de Bibliotecas Python para Dashboard

### 1. **Streamlit** (Recomendado para início)
```python
# Exemplo básico
import streamlit as st
import pandas as pd
from supabase import create_client

# Conexão com Supabase
supabase = create_client(url, key)

# Carregar dados
@st.cache_data
def load_data():
    response = supabase.table('escolas_completa').select('*').execute()
    return pd.DataFrame(response.data)

# Dashboard
st.title('Dashboard OPIN')
df = load_data()

# Métricas
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Total de Escolas", len(df))
with col2:
    st.metric("Municípios", df['Município'].nunique())
with col3:
    st.metric("Terras Indígenas", df['Terra Indigena (TI)'].nunique())
```

### 2. **Dash/Plotly** (Mais avançado)
```python
import dash
from dash import dcc, html
import plotly.express as px
import plotly.graph_objects as go

app = dash.Dash(__name__)

# Layout com gráficos interativos
app.layout = html.Div([
    html.H1('Dashboard OPIN'),
    dcc.Graph(id='mapa-escolas'),
    dcc.Graph(id='distribuicao-infraestrutura'),
    dcc.Graph(id='professores-por-tipo')
])
```

### 3. **Gradio** (Interface simples)
```python
import gradio as gr
import pandas as pd

def analisar_dados():
    # Lógica de análise
    return "Relatório gerado"

interface = gr.Interface(
    fn=analisar_dados,
    inputs=[],
    outputs="text"
)
```

### 4. **Panel** (Para dashboards complexos)
```python
import panel as pn
import hvplot.pandas

# Dashboard interativo com múltiplas visualizações
dashboard = pn.Column(
    pn.pane.Markdown('# Dashboard OPIN'),
    pn.Row(
        pn.Column(df.hvplot.scatter('longitude', 'latitude')),
        pn.Column(df['Município'].value_counts().hvplot.bar())
    )
)
```

---

## 🔧 Configuração do Ambiente Python

### Requirements.txt
```txt
# Conexão com banco
supabase==2.0.0
psycopg2-binary==2.9.7

# Análise de dados
pandas==2.0.3
numpy==1.24.3

# Visualização
plotly==5.15.0
matplotlib==3.7.2
seaborn==0.12.2

# Dashboard
streamlit==1.25.0
dash==2.11.1
dash-bootstrap-components==1.4.1

# Geografia
geopandas==0.13.2
folium==0.14.0

# Utilitários
python-dotenv==1.0.0
```

### Script de Conexão
```python
# config.py
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
```

---

## 📊 Visualizações Sugeridas

### 1. **Mapa Interativo**
- Localização das escolas
- Clusters por região
- Popup com informações básicas

### 2. **Gráficos de Distribuição**
- Escolas por município (bar chart)
- Status da infraestrutura (pie chart)
- Evolução temporal (line chart)

### 3. **Métricas de Resumo**
- Total de escolas
- Total de professores
- Cobertura geográfica
- Taxa de conectividade

### 4. **Análise de Correlação**
- Infraestrutura vs. localização
- Professores indígenas vs. línguas faladas
- Modalidade vs. número de alunos

---

## 🚀 Próximos Passos

1. **Escolher biblioteca**: Recomendo começar com Streamlit
2. **Configurar ambiente**: Instalar dependências e conectar com Supabase
3. **Criar MVP**: Dashboard básico com métricas principais
4. **Iterar**: Adicionar visualizações e funcionalidades
5. **Deploy**: Publicar dashboard (Streamlit Cloud, Heroku, etc.)

### Exemplo de Estrutura de Projeto
```
dashboard-opin/
├── app.py              # Aplicação principal
├── config.py           # Configurações
├── data_loader.py      # Carregamento de dados
├── visualizations.py   # Funções de visualização
├── requirements.txt    # Dependências
├── .env               # Variáveis de ambiente
└── README.md          # Documentação
``` 