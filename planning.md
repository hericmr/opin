# **planning.md — Plano de Migração para React 19 e Tailwind CSS 4**

## 📋 Histórico de Migrações Realizadas

### ✅ Migração para Vite (Concluída - 2024-12)

| Etapa | Status | Commit |
|-------|--------|--------|
| Instalação e configuração do Vite | ✅ | `ffa80ba` |
| Migração de variáveis de ambiente | ✅ | `ce764c3` |
| Remoção de react-scripts | ✅ | `8510e77` |
| Documentação atualizada | ✅ | `c698085` |
| Merge para main | ✅ | `3f81f33` |

**Resultados**:
- Build 40% mais rápido (15s → 9s)
- Redução de 15% no tamanho do `node_modules` (500MB → 423MB)
- 681 pacotes removidos (1853 → 1172)
- 8 vulnerabilidades corrigidas (25 → 17)

---

## 📌 Objetivo Atual

Migrar o projeto OPIN para:
1. **React 19** - Última versão do React com novas features e melhorias de performance
2. **Tailwind CSS 4** - Nova versão do Tailwind com CSS nativo e melhor performance

### Por que migrar?

#### React 19
- ✅ **Suporte nativo no Vite** - Agora que migramos para Vite, React 19 é totalmente suportado
- ✅ **Melhorias de performance** - Compilador otimizado, menos re-renders
- ✅ **Novas features** - Actions, useFormStatus, useOptimistic, etc.
- ✅ **Melhor TypeScript support** - Tipos mais precisos
- ✅ **Compatibilidade futura** - Preparado para próximas versões

#### Tailwind CSS 4
- ✅ **CSS nativo** - Usa CSS puro em vez de PostCSS
- ✅ **Performance melhorada** - Build mais rápido
- ✅ **Novas features** - Variáveis CSS nativas, melhor suporte a dark mode
- ✅ **Menos dependências** - Não precisa de PostCSS separado
- ✅ **Melhor DX** - IntelliSense melhorado

---

# 🚀 Plano de Migração - React 19 e Tailwind 4

## Estratégia: Migração Incremental e Reversível

Seguindo o mesmo padrão da migração para Vite, faremos em **baby steps** que podem ser revertidos a qualquer momento.

---

## Fase 1: Preparação e Análise (1-2 dias)

### 1.1 Criar Branch de Migração

```bash
git checkout -b feature/react19-tailwind4-migration
git push -u origin feature/react19-tailwind4-migration
```

### 1.2 Análise de Compatibilidade

#### Dependências que precisam ser verificadas:

| Pacote | Versão Atual | Compatibilidade React 19 | Ação Necessária |
|--------|--------------|--------------------------|-----------------|
| `react` | 18.3.1 | ❌ | Atualizar para 19.x |
| `react-dom` | 18.3.1 | ❌ | Atualizar para 19.x |
| `@headlessui/react` | 2.2.4 | ⚠️ Verificar | Pode precisar atualização |
| `@heroicons/react` | 2.2.0 | ✅ Compatível | Manter |
| `framer-motion` | 12.18.1 | ⚠️ Verificar | Pode precisar atualização |
| `react-router-dom` | 7.6.2 | ✅ Compatível | Manter |
| `react-markdown` | 10.1.0 | ✅ Compatível | Manter |
| `recharts` | 3.2.1 | ⚠️ Verificar | Testar |
| `react-quill` | 2.0.0 | ⚠️ Verificar | Testar |
| `react-rnd` | 10.5.2 | ⚠️ Verificar | Testar |

#### Dependências Tailwind CSS:

| Pacote | Versão Atual | Compatibilidade Tailwind 4 | Ação Necessária |
|--------|--------------|----------------------------|-----------------|
| `tailwindcss` | 3.4.18 | ❌ | Atualizar para 4.x |
| `@tailwindcss/forms` | 0.5.10 | ⚠️ Verificar | Pode não ser necessário |
| `@tailwindcss/typography` | 0.5.16 | ⚠️ Verificar | Pode não ser necessário |
| `autoprefixer` | 10.4.21 | ❌ | Remover (não necessário no Tailwind 4) |
| `postcss` | 8.5.5 | ⚠️ Verificar | Pode não ser necessário |

### 1.3 Criar Backups

```bash
cp package.json package.json.react18-backup
cp package-lock.json package-lock.json.react18-backup
cp tailwind.config.js tailwind.config.js.v3-backup 2>/dev/null || echo "tailwind.config.js não existe"
```

---

## Fase 2: Migração para React 19 (Passo a Passo)

### 2.1 Step 1: Atualizar React e React-DOM (Reversível)

**Objetivo**: Atualizar React para versão 19 mantendo compatibilidade

```bash
npm install react@19 react-dom@19
```

**Verificações**:
- [ ] Build funciona (`npm run build`)
- [ ] Dev server funciona (`npm run dev`)
- [ ] Aplicação carrega sem erros no console
- [ ] Testes passam (`npm test`)

**Rollback se necessário**:
```bash
npm install react@18.3.1 react-dom@18.3.1
```

**Commits**:
```bash
git add package.json package-lock.json
git commit -m "feat: Step 1 - Update React to 19.0.0 (reversible)"
```

### 2.2 Step 2: Atualizar Dependências Relacionadas

**Pacotes a atualizar**:
- `@types/react` e `@types/react-dom` (se existirem)
- Verificar e atualizar `@headlessui/react` se necessário
- Verificar e atualizar `framer-motion` se necessário

**Commits**:
```bash
git commit -m "feat: Step 2 - Update React-related dependencies"
```

### 2.3 Step 3: Atualizar Código para React 19

#### Mudanças Principais no React 19:

1. **Refs como Props** - Agora refs podem ser passadas como props normais
2. **Actions** - Novo sistema de formulários
3. **useFormStatus** - Hook para status de formulários
4. **useOptimistic** - Hook para updates otimistas
5. **Mudanças no StrictMode** - Comportamento diferente

**Arquivos a verificar**:
- `src/index.jsx` - Verificar se `createRoot` está correto
- Componentes com refs - Verificar se precisam de ajustes
- Formulários - Considerar usar Actions (opcional)

**Commits incrementais**:
```bash
git commit -m "feat: Step 3a - Update index.jsx for React 19"
git commit -m "feat: Step 3b - Update refs usage for React 19"
git commit -m "feat: Step 3c - Update form components (if needed)"
```

### 2.4 Step 4: Testar Funcionalidades Críticas

**Checklist de Testes**:
- [ ] Mapa interativo funciona
- [ ] Upload de imagens funciona
- [ ] Painel administrativo funciona
- [ ] Formulários funcionam
- [ ] Navegação funciona
- [ ] Busca funciona
- [ ] Painel de informações funciona

**Commits**:
```bash
git commit -m "test: Step 4 - Validate all critical features with React 19"
```

---

## Fase 3: Migração para Tailwind CSS 4 (Passo a Passo)

### 3.1 Step 1: Instalar Tailwind CSS 4 (Reversível)

**Objetivo**: Instalar Tailwind 4 mantendo configuração atual

```bash
npm install -D tailwindcss@next @tailwindcss/vite@next
```

**Nota**: Tailwind 4 ainda está em beta/alpha, usar `@next` ou versão específica quando disponível.

**Verificações**:
- [ ] Build funciona
- [ ] Estilos são aplicados corretamente
- [ ] Dev server funciona

**Rollback se necessário**:
```bash
npm install -D tailwindcss@3.4.18
```

**Commits**:
```bash
git commit -m "feat: Step 1 - Install Tailwind CSS 4 (reversible)"
```

### 3.2 Step 2: Atualizar Configuração do Vite

**Mudanças necessárias**:
- Remover `autoprefixer` e `postcss` (se não forem mais necessários)
- Atualizar `vite.config.js` para usar plugin do Tailwind 4
- Atualizar `tailwind.config.js` para formato Tailwind 4

**Arquivo**: `vite.config.js`
```javascript
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Novo plugin do Tailwind 4
  ],
})
```

**Arquivo**: `tailwind.config.js` (se existir)
- Tailwind 4 usa CSS nativo, configuração pode mudar
- Verificar documentação oficial

**Commits**:
```bash
git commit -m "feat: Step 2 - Update Vite config for Tailwind 4"
```

### 3.3 Step 3: Atualizar Arquivos CSS

**Mudanças**:
- Tailwind 4 usa `@import "tailwindcss"` em vez de `@tailwind`
- Verificar `src/index.css` e outros arquivos CSS

**Arquivo**: `src/index.css`
```css
/* Antigo (Tailwind 3) */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Novo (Tailwind 4) */
@import "tailwindcss";
```

**Commits**:
```bash
git commit -m "feat: Step 3 - Update CSS imports for Tailwind 4"
```

### 3.4 Step 4: Remover Dependências Obsoletas

**Pacotes a remover**:
- `autoprefixer` (não necessário no Tailwind 4)
- `postcss` (pode não ser necessário)
- `@tailwindcss/forms` e `@tailwindcss/typography` (verificar se ainda são necessários)

**Commits**:
```bash
git commit -m "feat: Step 4 - Remove obsolete Tailwind dependencies"
```

### 3.5 Step 5: Verificar Classes CSS

**Verificações**:
- [ ] Todas as classes Tailwind funcionam
- [ ] Custom classes funcionam
- [ ] Dark mode funciona (se aplicável)
- [ ] Responsividade funciona

**Commits**:
```bash
git commit -m "test: Step 5 - Validate Tailwind CSS classes"
```

---

## Fase 4: Testes e Validação Final

### 4.1 Testes Automatizados

```bash
npm test
npm run test:coverage
```

### 4.2 Testes Manuais

**Checklist Completo**:
- [ ] Homepage carrega corretamente
- [ ] Mapa interativo funciona
- [ ] Busca funciona
- [ ] Painel de informações funciona
- [ ] Painel administrativo funciona
- [ ] Upload de imagens funciona
- [ ] Formulários funcionam
- [ ] Navegação funciona
- [ ] Responsividade mobile funciona
- [ ] Responsividade tablet funciona
- [ ] Responsividade desktop funciona

### 4.3 Performance

**Métricas a verificar**:
- Tempo de build (deve ser similar ou melhor)
- Tamanho do bundle (deve ser similar ou menor)
- Tempo de carregamento inicial
- Tempo de hot reload no dev

**Commits**:
```bash
git commit -m "test: Step 4 - Complete validation and performance testing"
```

---

## Fase 5: Documentação e Deploy

### 5.1 Atualizar Documentação

**Arquivos a atualizar**:
- `README.md` - Atualizar versões
- `Guia para Instalação.md` - Atualizar comandos se necessário
- `planning.md` - Marcar migração como concluída

### 5.2 Deploy

```bash
npm run build
npm run deploy
```

**Commits**:
```bash
git commit -m "docs: Update documentation for React 19 and Tailwind 4"
```

---

## ⚠️ Riscos e Mitigações

### Riscos Identificados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Incompatibilidade com bibliotecas | Média | Alto | Testar cada biblioteca individualmente |
| Mudanças breaking no Tailwind 4 | Alta | Médio | Verificar changelog e migrar gradualmente |
| Performance degradada | Baixa | Médio | Monitorar métricas durante migração |
| Bugs em produção | Média | Alto | Testar extensivamente antes do merge |

### Estratégias de Mitigação

1. **Commits Incrementais**: Cada passo é um commit separado, fácil de reverter
2. **Branch Isolada**: Migração em branch separada, não afeta main
3. **Testes Contínuos**: Testar após cada passo
4. **Rollback Plan**: Sempre manter backups e saber como reverter

---

## 📊 Métricas de Sucesso

### Antes da Migração (Baseline)

- React: 18.3.1
- Tailwind CSS: 3.4.18
- Build time: ~9s
- Bundle size: ~566KB (gzipped)
- Dependências: 1172 pacotes

### Após a Migração (Esperado)

- React: 19.x
- Tailwind CSS: 4.x
- Build time: ≤9s (manter ou melhorar)
- Bundle size: ≤566KB (manter ou melhorar)
- Dependências: ≤1172 pacotes (manter ou reduzir)

---

## 🔄 Plano de Rollback

### Se algo der errado:

1. **Reverter último commit**:
   ```bash
   git revert HEAD
   ```

2. **Reverter para versão anterior**:
   ```bash
   git checkout main
   git branch -D feature/react19-tailwind4-migration
   ```

3. **Restaurar backups**:
   ```bash
   cp package.json.react18-backup package.json
   cp package-lock.json.react18-backup package-lock.json
   npm install
   ```

---

## 📅 Cronograma Estimado

| Fase | Duração Estimada | Status |
|------|------------------|--------|
| Fase 1: Preparação | 1-2 dias | ⏳ Pendente |
| Fase 2: React 19 | 3-5 dias | ⏳ Pendente |
| Fase 3: Tailwind 4 | 2-4 dias | ⏳ Pendente |
| Fase 4: Testes | 2-3 dias | ⏳ Pendente |
| Fase 5: Documentação | 1 dia | ⏳ Pendente |
| **Total** | **9-15 dias** | ⏳ Pendente |

---

## 📚 Referências

### React 19
- [React 19 Release Notes](https://react.dev/blog/2024/04/25/react-19)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React 19 Breaking Changes](https://github.com/facebook/react/blob/main/CHANGELOG.md)

### Tailwind CSS 4
- [Tailwind CSS 4 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS 4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS 4 Blog](https://tailwindcss.com/blog)

### Vite + React 19
- [Vite React Plugin](https://github.com/vitejs/vite-plugin-react)
- [Vite + React 19 Compatibility](https://vitejs.dev/guide/)

---

## ✅ Checklist Final

Antes de fazer merge para `main`:

- [ ] Todos os testes passam
- [ ] Build funciona sem erros
- [ ] Dev server funciona sem erros
- [ ] Todas as funcionalidades críticas testadas
- [ ] Performance mantida ou melhorada
- [ ] Documentação atualizada
- [ ] Code review realizado
- [ ] Deploy de teste bem-sucedido

---

## 🎯 Próximos Passos

1. **Iniciar Fase 1**: Criar branch e fazer análise de compatibilidade
2. **Revisar dependências**: Verificar compatibilidade de cada biblioteca
3. **Começar migração**: Seguir plano passo a passo
4. **Testar continuamente**: Validar após cada etapa
5. **Documentar**: Atualizar documentação conforme necessário

---

**Última atualização**: 2024-12-XX  
**Status**: 📋 Planejamento completo - Pronto para iniciar migração
