# PageHeader Component

Um componente reutilizável para criar headers de página com o padrão visual consistente do site OPIN.

## Características

- **Layout horizontal**: Título à esquerda, barra verde separadora, descrição à direita
- **Design responsivo**: Adapta-se a diferentes tamanhos de tela
- **Customizável**: Permite personalizar fontes, tamanhos e conteúdo
- **Consistente**: Mantém o padrão visual da navbar em outras páginas

## Uso

```jsx
import PageHeader from '../PageHeader';

// Uso básico
<PageHeader
  title="Título da Página"
  description="Descrição da página aqui"
/>

// Uso customizado
<PageHeader
  title="Materiais Didáticos"
  titleFontFamily="Caveat, cursive"
  titleSize="text-3xl md:text-4xl lg:text-5xl"
  descriptionSize="text-base md:text-lg"
  description="Descrição customizada"
>
  {/* Conteúdo adicional opcional */}
</PageHeader>
```

## Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `title` | string | - | Título da página (obrigatório) |
| `description` | string/JSX | - | Descrição da página (obrigatório) |
| `titleFontFamily` | string | `'PapakiloLight, sans-serif'` | Família da fonte do título |
| `titleSize` | string | `'text-4xl md:text-5xl lg:text-6xl'` | Classes de tamanho do título |
| `descriptionSize` | string | `'text-sm md:text-base'` | Classes de tamanho da descrição |
| `className` | string | `''` | Classes CSS adicionais |
| `children` | JSX | - | Conteúdo adicional opcional |

## Exemplos de Implementação

### Dashboard (Painel de Dados)
```jsx
<PageHeader
  title="Painel de Dados"
  description={
    <>
      Este espaço reúne informações sobre as escolas indígenas...
      <a href="https://dados.educacao.sp.gov.br/" target="_blank">
        dados.educacao.sp.gov.br
      </a>
    </>
  }
/>
```

### Materiais Didáticos
```jsx
<PageHeader
  title="Materiais Didáticos Indígenas"
  titleSize="text-3xl md:text-4xl lg:text-5xl"
  descriptionSize="text-base md:text-lg"
  description="Conteúdos produzidos por professores indígenas..."
/>
```

## Benefícios

1. **Consistência**: Mantém o padrão visual em todas as páginas
2. **Reutilização**: Evita duplicação de código
3. **Manutenibilidade**: Mudanças no design afetam todas as páginas
4. **Flexibilidade**: Permite customizações quando necessário
5. **Responsividade**: Funciona bem em todos os dispositivos