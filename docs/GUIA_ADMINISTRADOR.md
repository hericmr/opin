# Guia do Administrador - OPIN

Se você é administrador do OPIN e tem alguma dúvida, provavelmente ela será respondida nesta documentação.

## Painel de Administração (`/admin`)

Acesse o painel administrativo para gerenciar todas as informações das escolas através de abas organizadas:

### Abas Principais
- **Dados Básicos**: Nome, município, endereço, terra indígena, diretoria
- **Povos**: Povos indígenas e línguas faladas
- **Modalidades**: Ensino, alunos, turnos de funcionamento
- **Infraestrutura**: Estrutura física, água, internet, equipamentos, cozinha, merenda escolar
- **Gestores**: Direção, professores, formação profissional
- **Material Pedagógico**: PPP próprio e com comunidade
- **Projetos**: Parcerias, ONGs, desejos da comunidade
- **Redes Sociais**: Links e uso de redes sociais
- **Vídeo**: Links para vídeos da escola
- **Histórias**: História da escola
- **História dos Professores**: Sistema para múltiplos professores
- **Coordenadas**: Latitude e longitude
- **Imagens**: Upload de fotos da escola e professores
- **Documentos**: Gerenciamento de PDFs

---

## Sistema de Meta Tags e Compartilhamento

### URLs Específicas para Escolas

Cada escola possui uma URL única que gera meta tags customizadas para compartilhamento social:

```
https://hericmr.github.io/opin/?panel=e-e-i-nhandepouwa
```

---

## Estrutura do Banco de Dados

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

-- Campos de infraestrutura
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
foto_rosto (text, nullable) -- URL da foto de rosto do professor
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

## Funcionalidades Especiais

### Sistema de Vídeos
- Suporte a YouTube, Vimeo e outras plataformas
- Pré-visualização automática
- Títulos editáveis

### Gerenciamento de Imagens
- Upload direto via interface administrativa
- Legendas editáveis em tempo real
- Organização por escola e professor

### Histórias dos Professores
- Sistema independente para cada professor
- Ordenação personalizável
- Ativação/desativação de histórias
- Upload de fotos de rosto

### Sistema de Busca
- Busca por nome da escola
- Busca por localização geográfica
- Filtros por características específicas
- Resultados com preview de informações

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