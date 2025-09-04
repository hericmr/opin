# Implementação de Rich Text nos Painéis de Informações

## Visão Geral

A funcionalidade de rich text foi implementada nos componentes `HistoriadoProfessor` e `HistoriaEscola` para permitir formatação avançada dos textos de depoimentos dos professores e histórias das escolas.

## Tecnologia Utilizada

- **QuillEditor**: Editor rich text para entrada de dados no painel administrativo
- **dangerouslySetInnerHTML**: Renderização de HTML diretamente no React
- **Tailwind CSS Typography**: Plugin para estilização de conteúdo tipográfico
- **CSS Customizado**: Estilos específicos para cada componente

## Componentes Atualizados

### 1. HistoriadoProfessor.js
- **Localização**: `src/components/PainelInformacoes/components/EscolaInfo/HistoriadoProfessor.js`
- **Funcionalidade**: Exibe depoimentos dos professores com HTML direto
- **Estilos**: `src/components/PainelInformacoes/components/EscolaInfo/HistoriadoProfessor.css`

### 2. HistoriaEscola.js
- **Localização**: `src/components/PainelInformacoes/components/EscolaInfo/HistoriaEscola.js`
- **Funcionalidade**: Exibe história da escola com HTML direto
- **Estilos**: `src/components/PainelInformacoes/components/EscolaInfo/HistoriaEscola.css`

## Funcionalidades Suportadas

### Formatação de Texto
- **Negrito**: `**texto**` ou `__texto__`
- **Itálico**: `*texto*` ou `_texto_`
- **Sublinhado**: `<u>texto</u>`
- **Riscado**: `~~texto~~`

### Títulos
- `# Título 1`
- `## Título 2`
- `### Título 3`
- `#### Título 4`
- `##### Título 5`
- `###### Título 6`

### Listas
- **Lista não ordenada**:
  ```markdown
  - Item 1
  - Item 2
  - Item 3
  ```
- **Lista ordenada**:
  ```markdown
  1. Item 1
  2. Item 2
  3. Item 3
  ```

### Links
- `[Texto do link](https://exemplo.com)`

### Citações
```markdown
> Esta é uma citação
> que pode ter múltiplas linhas
```

### Código
- **Inline**: `código`
- **Bloco**:
  ```markdown
  ```
  código
  em bloco
  ```
  ```

### Imagens
- `![Alt text](url-da-imagem)`

### Divisores
- `---` ou `***`

## Estilos Aplicados

### Cores
- **Títulos**: Verde escuro (`#166534`)
- **Parágrafos**: Verde médio (`#166534`) para história da escola, preto para depoimentos
- **Links**: Verde médio (`#15803d`)
- **Destaque**: Verde claro (`#86efac`)

### Tipografia
- **Responsiva**: Tamanhos adaptáveis para mobile, tablet e desktop
- **Justificada**: Texto alinhado à esquerda e direita
- **Espaçamento**: Line-height de 1.6 para melhor legibilidade

### Elementos Especiais
- **Blockquotes**: Borda esquerda verde com fundo claro
- **Código**: Fundo cinza com bordas arredondadas
- **Imagens**: Bordas arredondadas com sombra
- **Links**: Sublinhado verde com transição suave

## Exemplo de Uso

### Depoimento do Professor
```markdown
# Depoimento da Professora Maria

**Nome:** Maria Silva  
**Disciplina:** Língua Portuguesa

> "A experiência de ensinar em uma escola indígena tem sido muito enriquecedora. Os alunos são muito receptivos e curiosos."

## Principais Desafios

1. **Adaptação cultural**
2. **Recursos limitados**
3. **Integração com a comunidade**

### Metodologias Utilizadas

- Aprendizagem baseada em projetos
- Integração com saberes tradicionais
- Uso de tecnologias educacionais

Para mais informações, visite [nosso site](https://exemplo.com).
```

### História da Escola
```markdown
# História da Escola Indígena

## Fundação

A escola foi fundada em **1995** com o objetivo de preservar a cultura indígena local.

### Primeiros Anos

> "Nos primeiros anos, enfrentamos muitos desafios, mas a comunidade sempre nos apoiou."

## Desenvolvimento

- Construção da primeira sala de aula
- Implementação do currículo diferenciado
- Parcerias com universidades

### Resultados Alcançados

1. **100% de alfabetização** dos alunos
2. **Preservação** da língua materna
3. **Integração** com a comunidade

---

*Esta história continua sendo escrita todos os dias.*
```

## Manutenção

### Adicionando Novos Estilos
Para adicionar novos estilos, edite os arquivos CSS correspondentes:
- `HistoriadoProfessor.css` para depoimentos
- `HistoriaEscola.css` para histórias

### Personalização de Cores
As cores seguem o padrão do projeto:
- Verde primário: `#166534`
- Verde secundário: `#15803d`
- Verde claro: `#86efac`
- Verde muito claro: `#dcfce7`

### Responsividade
Os estilos são responsivos e se adaptam automaticamente a diferentes tamanhos de tela usando as classes do Tailwind CSS.

## Dependências

Certifique-se de que as seguintes dependências estão instaladas:
- `react-quill`: Para o editor rich text
- `@tailwindcss/typography`: Para estilos de tipografia
- `lucide-react`: Para ícones (já utilizado no projeto)

