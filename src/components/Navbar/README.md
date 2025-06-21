# Navbar Modular - OPIN

A navbar foi refatorada para ser mais modular, expansível e incluir um sistema de busca integrado.

## Estrutura de Componentes

### Componentes Principais

#### `index.js` - Componente Principal
- Gerencia o estado global da navbar
- Coordena a comunicação entre componentes
- Integra com o contexto de busca

#### `NavLogo.js` - Logo e Título
- Exibe o título do projeto
- Responsivo para diferentes tamanhos de tela
- Navegação para a página inicial

#### `SearchBar.js` - Sistema de Busca
- Busca em tempo real nos dados das escolas
- Sugestões automáticas
- Resultados com destaque de texto
- Integração com coordenadas para navegação no mapa

#### `NavButtons.js` - Botões de Navegação
- Botão principal de navegação (Mapa/Conteúdo)
- Responsivo e adaptável

#### `NavLogos.js` - Logos Institucionais
- Logos da UNIFESP e LINDI
- Links externos
- Responsivo

#### `AdminPanel.js` - Painel Administrativo
- Controle de acesso administrativo
- Menu dropdown com opções
- Integração com AddLocationButton

#### `MobileToggle.js` - Toggle Mobile
- Botão hambúrguer para mobile
- Animações suaves
- Responsivo

#### `MobileMenu.js` - Menu Mobile
- Menu completo para dispositivos móveis
- Todas as funcionalidades da versão desktop
- Otimizado para toque

#### `DesktopNav.js` - Navegação Desktop
- Layout completo para desktop
- Organização dos componentes
- Responsivo

## Sistema de Busca

### Funcionalidades
- **Busca em tempo real**: Pesquisa instantânea nos dados
- **Sugestões automáticas**: Baseadas nos dados existentes
- **Destaque de texto**: Termos encontrados são destacados
- **Navegação inteligente**: Clique em resultado navega para o mapa
- **Filtros múltiplos**: Busca por nome, município, terra indígena, povos, etc.

### Campos de Busca
- Nome da escola
- Município
- Terra indígena
- Povos indígenas
- Línguas faladas
- Diretoria de ensino

### Resultados
- Ordenação por relevância
- Informações detalhadas
- Coordenadas para navegação
- Categorização visual

## Hooks e Contextos

### `useSearch.js`
Hook personalizado para gerenciar a busca:
- `performSearch(term)`: Executa a busca
- `getSearchSuggestions(term)`: Gera sugestões
- `clearSearch()`: Limpa resultados
- `searchResults`: Resultados da busca
- `isSearching`: Estado de carregamento

### `SearchContext.js`
Contexto global para estado da busca:
- `searchTerm`: Termo atual da busca
- `coordinates`: Coordenadas para navegação
- `highlightSchool`: Escola para destacar
- `setSearch()`: Define estado da busca
- `clearSearch()`: Limpa estado

## Páginas de Resultados

### `SearchResults.js`
Página dedicada para resultados de busca:
- Layout responsivo em grid
- Animações de entrada
- Navegação de volta ao mapa
- Destaque de termos encontrados
- Informações detalhadas dos resultados

## Responsividade

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Mobile Landscape**: Detecção especial para orientação horizontal

### Adaptações
- Menu hambúrguer em mobile
- Busca integrada no menu mobile
- Logos redimensionadas
- Botões otimizados para toque

## Integração com Dados

### Supabase
- Busca nos dados das escolas
- Filtros por múltiplos campos
- Ordenação por relevância
- Cache de resultados

### Navegação
- Integração com React Router
- Estado de navegação preservado
- Coordenadas para centralização no mapa
- Histórico de busca

## Melhorias Implementadas

### Modularidade
- Componentes independentes
- Props bem definidas
- Reutilização de código
- Fácil manutenção

### Expansibilidade
- Estrutura preparada para novos componentes
- Hooks reutilizáveis
- Contexto global
- Sistema de busca extensível

### Performance
- Lazy loading de componentes
- Debounce na busca
- Memoização de resultados
- Otimização de re-renders

### UX/UI
- Animações suaves
- Feedback visual
- Estados de carregamento
- Design responsivo
- Acessibilidade

## Como Usar

### Adicionar Novo Componente
1. Criar arquivo na pasta `Navbar/`
2. Exportar componente
3. Importar no `index.js`
4. Adicionar props necessárias

### Estender Busca
1. Modificar `useSearch.js`
2. Adicionar novos campos de busca
3. Atualizar lógica de relevância
4. Testar integração

### Personalizar Estilo
1. Modificar classes Tailwind
2. Ajustar breakpoints
3. Atualizar animações
4. Testar responsividade

## Próximas Melhorias

- [ ] Busca avançada com filtros
- [ ] Histórico de buscas
- [ ] Busca por voz
- [ ] Autocompletar inteligente
- [ ] Exportação de resultados
- [ ] Busca em documentos
- [ ] Integração com analytics 