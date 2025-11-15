# Plano de Atualização de Dependências - Major Updates

## 📋 Visão Geral

Este documento detalha o plano passo a passo para atualizar as dependências maiores (major updates) do projeto, garantindo que cada etapa possa ser revertida se necessário.

## ⚠️ Status Atual

### Vulnerabilidades Encontradas (25 moderate)
- **js-yaml**: Prototype pollution (afeta dependências de desenvolvimento)
- **webpack-dev-server**: Vulnerabilidades de segurança (já coberto por override)

### Dependências para Atualizar (Major)

| Pacote | Versão Atual | Versão Alvo | Prioridade | Breaking Changes |
|--------|--------------|-------------|------------|------------------|
| `react` | 18.3.1 | 19.2.0 | 🔴 Alta | Sim - React 19 |
| `react-dom` | 18.3.1 | 19.2.0 | 🔴 Alta | Sim - React 19 |
| `tailwindcss` | 3.4.18 | 4.1.17 | 🟡 Média | Sim - Tailwind CSS 4 |
| `react-markdown` | 9.1.0 | 10.1.0 | 🟡 Média | Possível |
| `web-vitals` | 4.2.4 | 5.1.0 | 🟢 Baixa | Possível |
| `babel-loader` | 8.4.1 | 10.0.0 | 🟢 Baixa | Possível |
| `lucide-react` | 0.475.0 | 0.553.0 | 🟢 Baixa | Possível |

---

## 🎯 Estratégia de Atualização

### Princípios
1. **Baby Steps**: Uma atualização por vez
2. **Testes**: Build e testes após cada etapa
3. **Reversibilidade**: Commit após cada passo bem-sucedido
4. **Documentação**: Registrar problemas e soluções

### Ordem de Atualização Recomendada
1. ✅ Dependências de baixo risco primeiro
2. ⚠️ Dependências de médio risco
3. 🔴 Dependências críticas por último

---

## 📝 Plano Detalhado

### Fase 1: Preparação ✅
- [x] Atualizar dependências menores (patch/minor)
- [x] Corrigir warnings do ESLint
- [x] Criar este documento de planejamento
- [ ] Criar branch específica para atualizações: `feature/major-dependencies-update`
- [ ] Fazer backup do `package.json` e `package-lock.json`

### Fase 2: Dependências de Baixo Risco 🟢

#### 2.1 Atualizar `lucide-react` (0.475.0 → 0.553.0)
**Risco**: Baixo  
**Breaking Changes**: Possível (verificar changelog)

**Passos**:
1. Verificar changelog: https://github.com/lucide-icons/lucide/releases
2. Atualizar: `npm install lucide-react@latest`
3. Executar build: `npm run build`
4. Testar visualmente componentes que usam ícones
5. Se OK: commit `chore: Update lucide-react to 0.553.0`
6. Se problemas: reverter e documentar

**Arquivos a verificar**:
- Todos os componentes que importam de `lucide-react`
- Verificar se há mudanças na API dos ícones

---

#### 2.2 Atualizar `web-vitals` (4.2.4 → 5.1.0)
**Risco**: Baixo  
**Breaking Changes**: Possível

**Passos**:
1. Verificar changelog: https://github.com/GoogleChrome/web-vitals/releases
2. Atualizar: `npm install web-vitals@latest`
3. Executar build: `npm run build`
4. Verificar se métricas ainda funcionam
5. Se OK: commit `chore: Update web-vitals to 5.1.0`
6. Se problemas: reverter e documentar

**Arquivos a verificar**:
- `src/index.js` (onde web-vitals é importado)
- Verificar se há mudanças na API de reportWebVitals

---

#### 2.3 Atualizar `babel-loader` (8.4.1 → 10.0.0)
**Risco**: Baixo-Médio  
**Breaking Changes**: Possível (major version)

**Passos**:
1. Verificar changelog: https://github.com/babel/babel-loader/releases
2. Verificar compatibilidade com `react-scripts@5.0.1`
3. Atualizar: `npm install babel-loader@latest`
4. Executar build: `npm run build`
5. Executar dev server: `npm start` (verificar se funciona)
6. Se OK: commit `chore: Update babel-loader to 10.0.0`
7. Se problemas: reverter e documentar

**Nota**: Pode requerer atualização de outras dependências do Babel

---

### Fase 3: Dependências de Médio Risco 🟡

#### 3.1 Atualizar `react-markdown` (9.1.0 → 10.1.0)
**Risco**: Médio  
**Breaking Changes**: Provável (major version)

**Passos**:
1. Verificar changelog: https://github.com/remarkjs/react-markdown/releases
2. Verificar breaking changes na documentação
3. Atualizar: `npm install react-markdown@latest`
4. Executar build: `npm run build`
5. Testar componentes que usam markdown:
   - Verificar renderização de markdown
   - Verificar plugins (se houver)
6. Se necessário, atualizar código conforme nova API
7. Se OK: commit `chore: Update react-markdown to 10.1.0`
8. Se problemas: reverter e documentar

**Arquivos a verificar**:
- Buscar por `react-markdown` no código
- Verificar plugins e configurações

---

#### 3.2 Atualizar `tailwindcss` (3.4.18 → 4.1.17)
**Risco**: Médio-Alto  
**Breaking Changes**: Sim - Tailwind CSS 4 é uma reescrita

**⚠️ ATENÇÃO**: Tailwind CSS 4 tem mudanças significativas!

**Passos**:
1. **ANTES**: Fazer backup completo do projeto
2. Ler guia de migração: https://tailwindcss.com/docs/upgrade-guide
3. Verificar compatibilidade com plugins:
   - `@tailwindcss/forms`
   - `@tailwindcss/typography`
4. Atualizar `tailwindcss`: `npm install tailwindcss@latest`
5. Atualizar plugins (se compatíveis)
6. Atualizar arquivo de configuração (`tailwind.config.js`)
7. Atualizar imports CSS (Tailwind 4 usa nova sintaxe)
8. Executar build: `npm run build`
9. Testar visualmente TODOS os componentes
10. Verificar se classes CSS ainda funcionam
11. Se OK: commit `chore: Update tailwindcss to 4.1.17`
12. Se problemas: reverter IMEDIATAMENTE

**Arquivos críticos**:
- `tailwind.config.js`
- `src/index.css` ou arquivo CSS principal
- Todos os componentes (verificar classes)

**Riscos conhecidos**:
- Mudanças na sintaxe de configuração
- Mudanças em plugins
- Possível necessidade de reescrever alguns estilos

---

### Fase 4: Dependências Críticas 🔴

#### 4.1 Atualizar `react` e `react-dom` (18.3.1 → 19.2.0)
**Risco**: Alto  
**Breaking Changes**: Sim - React 19 tem mudanças significativas

**⚠️ ATENÇÃO**: React 19 é uma atualização major com breaking changes!

**Passos**:
1. **ANTES**: Fazer backup completo e criar branch específica
2. Ler guia de migração: https://react.dev/blog/2024/04/25/react-19
3. Verificar compatibilidade de todas as dependências:
   - `react-router-dom` (já atualizado para 7.9.6 - compatível)
   - `react-scripts` (pode precisar atualizar)
   - Outras bibliotecas React
4. Atualizar React: `npm install react@latest react-dom@latest`
5. Verificar se `react-scripts` precisa atualizar (pode ser necessário)
6. Executar build: `npm run build`
7. **Testes extensivos**:
   - Testar todos os componentes principais
   - Verificar hooks (useState, useEffect, etc.)
   - Verificar Context API
   - Verificar renderização condicional
   - Verificar formulários
   - Verificar navegação
8. Verificar warnings no console
9. Se necessário, atualizar código conforme nova API do React 19
10. Se OK: commit `chore: Update react and react-dom to 19.2.0`
11. Se problemas: reverter IMEDIATAMENTE

**Mudanças conhecidas do React 19**:
- Novos hooks: `useFormStatus`, `useFormState`, `useOptimistic`
- Mudanças em refs (forwardRef)
- Mudanças em Context API
- Mudanças em renderização de strings
- Novas APIs para formulários
- Suporte melhorado para Web Components

**Arquivos críticos**:
- Todos os componentes React
- Todos os hooks customizados
- Configurações de build (webpack, babel)

**Dependências que podem precisar atualizar**:
- `react-scripts` (pode precisar atualizar para versão compatível)
- `react-router-dom` (já atualizado - verificar compatibilidade)
- Outras bibliotecas React

---

## 🔄 Processo de Reversão

Se algo der errado em qualquer etapa:

1. **Reverter commit**:
   ```bash
   git revert HEAD
   ```

2. **Ou voltar para commit anterior**:
   ```bash
   git reset --hard HEAD~1
   ```

3. **Restaurar node_modules**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Documentar o problema**:
   - Adicionar nota neste documento
   - Criar issue no GitHub (se aplicável)

---

## ✅ Checklist de Validação

Após cada atualização, verificar:

- [ ] Build compila sem erros: `npm run build`
- [ ] Dev server inicia: `npm start`
- [ ] Não há warnings críticos no console
- [ ] Componentes principais funcionam:
  - [ ] Painel de Informações
  - [ ] Admin Panel
  - [ ] Dashboard
  - [ ] Navegação
  - [ ] Formulários
  - [ ] Upload de imagens
- [ ] Estilos CSS estão corretos
- [ ] Performance não degradou significativamente
- [ ] Testes (se houver) passam

---

## 📊 Progresso

- [x] Fase 1: Preparação
- [x] Fase 2: Dependências de Baixo Risco
  - [x] lucide-react (0.475.0 → 0.553.0) ✅
  - [x] web-vitals (4.2.4 → 5.1.0) ✅
  - [x] babel-loader (8.4.1 → 10.0.0) ✅
- [🔄] Fase 3: Dependências de Médio Risco
  - [x] react-markdown (9.1.0 → 10.1.0) ✅
  - [❌] tailwindcss (3.4.18 → 4.1.17) ⚠️ REVERTIDO - Incompatível com react-scripts
- [❌] Fase 4: Dependências Críticas
  - [❌] react e react-dom (18.3.1 → 19.2.0) ⚠️ REVERTIDO - Incompatível com react-scripts 5.0.1

---

## 📝 Notas e Problemas Encontrados

### Problemas Conhecidos
- 25 vulnerabilidades moderadas relacionadas a `js-yaml` e `webpack-dev-server`
- Essas vulnerabilidades são principalmente em dependências de desenvolvimento
- `webpack-dev-server` já está coberto por override no `package.json`

### Decisões Pendentes
- Decidir se vamos atualizar `react-scripts` junto com React 19
- Avaliar necessidade de atualizar outras dependências do Babel

### Progresso Realizado
- ✅ **2024-12-XX**: Fase 2 concluída com sucesso
  - Todas as 3 dependências de baixo risco atualizadas sem problemas
  - Builds compilando corretamente
  - Nenhum breaking change encontrado
- ⚠️ **2024-12-XX**: Tentativa de atualizar Tailwind CSS 4
  - Tailwind CSS 4 requer `@tailwindcss/postcss` separado
  - Incompatível com `react-scripts` sem configuração adicional complexa
  - **Decisão**: Manter Tailwind CSS 3.4.18 por enquanto
  - **Nota**: Para atualizar no futuro, considerar migrar para Vite ou atualizar react-scripts primeiro
- ⚠️ **2024-12-XX**: Tentativa de atualizar React 19
  - React 19 mudou estrutura de exports (ESM-only em alguns casos)
  - `react-scripts` 5.0.1 não suporta React 19 (webpack tenta acessar arquivos que não existem mais)
  - **Decisão**: Manter React 18.3.1 por enquanto
  - **Nota**: Para atualizar no futuro, necessário:
    - Atualizar `react-scripts` para versão que suporte React 19 (ainda não disponível)
    - OU migrar para Vite/outro bundler moderno
    - OU usar `react-scripts` com override/customização extensa do webpack

---

## 🚀 Próximos Passos

1. ✅ Criar branch: `feature/major-dependencies-update` - CONCLUÍDO
2. ✅ Fase 2 (dependências de baixo risco) - CONCLUÍDO
3. 🔄 Fase 3: Dependências de médio risco (em andamento)
4. ⏳ Fase 4: Dependências críticas (pendente)

---

**Última atualização**: 2024-12-XX  
**Status**: Fase 2 concluída, iniciando Fase 3

