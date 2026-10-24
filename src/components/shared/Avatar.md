# Componente Avatar

O componente `Avatar` é um sistema modular e expansível para exibir avatares de usuários com suporte a diferentes tamanhos, formas, temas e funcionalidades avançadas.

## Características Principais

- **Modular**: Componente base reutilizável
- **Expansível**: Fácil customização e extensão
- **Temático**: Sistema de temas pré-definidos
- **Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Acessível**: Suporte completo a acessibilidade
- **Performance**: Carregamento lazy e otimizações

## Uso Básico

```jsx
import Avatar from './shared/Avatar';

// Uso simples
<Avatar 
  src="/path/to/image.jpg"
  name="João Silva"
  size="medium"
/>

// Com tema customizado
<Avatar 
  src="/path/to/image.jpg"
  name="Maria Santos"
  size="large"
  theme="professor"
  variant="elevated"
/>
```

## Props Principais

### Props Básicas
- `src`: URL da imagem do avatar
- `name`: Nome da pessoa (usado para iniciais e alt text)
- `alt`: Texto alternativo para acessibilidade
- `size`: Tamanho do avatar (`xs`, `small`, `medium`, `large`, `xlarge`, `xxlarge`)

### Customização Visual
- `shape`: Forma do avatar (`circle`, `square`, `rounded`, `none`)
- `variant`: Estilo visual (`default`, `minimal`, `flat`, `elevated`)
- `theme`: Tema de cores (`default`, `professor`, `escola`, `neutral`, `indigena`, etc.)
- `className`: Classes CSS adicionais

### Funcionalidades Avançadas
- `badge`: Badge/indicador no avatar
- `badgePosition`: Posição do badge (`top-left`, `top-right`, `bottom-left`, `bottom-right`, `center`)
- `clickable`: Torna o avatar clicável
- `onClick`: Callback para clique
- `loading`: Estado de carregamento
- `error`: Estado de erro

## Temas Disponíveis

### Temas Pré-definidos
- `default`: Verde padrão
- `professor`: Azul para professores
- `escola`: Laranja para escolas
- `neutral`: Cinza neutro
- `indigena`: Marrom/terra para contexto indígena
- `success`: Verde escuro para sucesso
- `warning`: Amarelo para avisos
- `error`: Vermelho para erros

### Uso de Temas
```jsx
// Tema padrão
<Avatar theme="default" />

// Tema customizado
<Avatar 
  theme="professor"
  borderColor="border-blue-300"
  backgroundColor="bg-blue-100"
  textColor="text-blue-800"
/>
```

## Exemplos de Uso

### Avatar Simples
```jsx
<Avatar 
  src="/fotos/joao.jpg"
  name="João Silva"
  size="medium"
/>
```

### Avatar com Badge
```jsx
<Avatar 
  src="/fotos/maria.jpg"
  name="Maria Santos"
  size="large"
  badge="ON"
  badgeColor="bg-green-500"
  badgePosition="bottom-right"
/>
```

### Avatar Clicável
```jsx
<Avatar 
  src="/fotos/pedro.jpg"
  name="Pedro Costa"
  size="medium"
  clickable
  onClick={() => console.log('Avatar clicado!')}
/>
```

### Avatar com Estado de Loading
```jsx
<Avatar 
  src="/fotos/ana.jpg"
  name="Ana Lima"
  size="large"
  loading={true}
/>
```

### Avatar com Iniciais
```jsx
<Avatar 
  name="Carlos Eduardo"
  size="medium"
  showInitials={true}
  maxInitials={2}
/>
```

## Componente FotoProfessor

O `FotoProfessor` é um wrapper especializado do `Avatar` para professores, mantendo compatibilidade com a API anterior:

```jsx
import FotoProfessor from './FotoProfessor';

// Uso tradicional (compatibilidade)
<FotoProfessor 
  fotoUrl="/fotos/professor.jpg"
  nomeProfessor="João Silva"
  tamanho="medium"
/>

// Uso avançado
<FotoProfessor 
  fotoUrl="/fotos/professor.jpg"
  nomeProfessor="Maria Santos"
  size="large"
  theme="professor"
  variant="elevated"
  badge="VIP"
  clickable
  onClick={() => openProfile()}
/>
```

## Customização Avançada

### Criando Temas Personalizados
```jsx
// Em AvatarThemes.js
export const avatarThemes = {
  meuTema: {
    borderColor: 'border-purple-200',
    backgroundColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    badgeColor: 'bg-purple-500',
    hoverBorderColor: 'hover:border-purple-300'
  }
};
```

### Usando Tamanhos Customizados
```jsx
<Avatar 
  customSize="80px"
  src="/foto.jpg"
  name="Nome"
/>
```

## Acessibilidade

O componente inclui suporte completo a acessibilidade:
- `alt` text automático baseado no nome
- Suporte a navegação por teclado quando `clickable`
- Estados visuais claros para loading e erro
- Contraste adequado em todos os temas

## Performance

- Carregamento lazy de imagens por padrão
- Otimizações de re-render com `useMemo`
- Suporte a `priority` para imagens críticas
- Estados de loading e erro bem gerenciados

## Migração do FotoProfessor Antigo

O novo `FotoProfessor` mantém compatibilidade total com a API anterior:

```jsx
// Antes
<FotoProfessor 
  fotoUrl="/foto.jpg"
  nomeProfessor="Nome"
  tamanho="medium"
/>

// Depois (mesmo código funciona)
<FotoProfessor 
  fotoUrl="/foto.jpg"
  nomeProfessor="Nome"
  tamanho="medium"
/>

// Mas agora também suporta funcionalidades avançadas
<FotoProfessor 
  fotoUrl="/foto.jpg"
  nomeProfessor="Nome"
  tamanho="medium"
  theme="professor"
  badge="ON"
  clickable
/>
```
