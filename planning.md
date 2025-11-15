# **planning.md — Mitigação de Riscos e Segurança do Projeto**

## 📋 Histórico de Atualizações Realizadas

### ✅ Dependências Atualizadas com Sucesso (2024-12-XX)

| Pacote | Versão Anterior | Versão Atual | Status |
|--------|----------------|--------------|--------|
| `lucide-react` | 0.475.0 | **0.553.0** | ✅ Atualizado |
| `web-vitals` | 4.2.4 | **5.1.0** | ✅ Atualizado |
| `babel-loader` | 8.4.1 | **10.0.0** | ✅ Atualizado |
| `react-markdown` | 9.1.0 | **10.1.0** | ✅ Atualizado |

### ❌ Dependências Mantidas (Incompatibilidade Técnica)

| Pacote | Versão Atual | Versão Alvo | Motivo |
|--------|--------------|-------------|--------|
| `tailwindcss` | 3.4.18 | 4.1.17 | Incompatível com `react-scripts` 5.0.1 |
| `react` | 18.3.1 | 19.2.0 | Incompatível com `react-scripts` 5.0.1 |
| `react-dom` | 18.3.1 | 19.2.0 | Incompatível com `react-scripts` 5.0.1 |

**Nota**: Todas as atualizações foram testadas e validadas. As dependências revertidas foram documentadas com motivos técnicos específicos.

---

## 📌 Objetivo

Estabelecer ações imediatas e de curto prazo para:

1. **Mitigar riscos de segurança** decorrentes da impossibilidade atual de atualizar React, Tailwind e `react-scripts`.
2. **Assegurar que o projeto não apresenta vulnerabilidades de Injeção SQL**, direta ou indireta.
3. Reduzir o nível de exposição a dependências desatualizadas (Webpack, Babel, js-yaml, etc.).
4. Definir um caminho de migração seguro para um ambiente mais moderno.

---

# 1. 🔐 Garantia de Segurança Atual (Sem Atualizar Dependências)

## 1.1 Medidas Imediatas

### ✔️ Evitar uso do Dev Server em Produção

* Nunca expor `npm start` na internet.
* Garantir que apenas o build de produção (`npm run build`) seja servido.
* Confirmar que o servidor de deploy (GitHub Pages) está servindo arquivos **estáticos**.

### ✔️ Isolar o Ambiente de Desenvolvimento

* Dev server só acessível via `localhost`.
* Firewalls impedindo acesso externo às portas 3000 / 5173.
* Nunca rodar dev server em redes inseguras.

### ✔️ Verificação de Vulnerabilidades

* Executar semanalmente:

  ```bash
  npm audit
  ```
* Registrar novas vulnerabilidades críticas para posterior correção.

---

# 2. 🧱 Mitigação de Risco Estrutural

Mesmo sem atualizar ainda, reduzir riscos causados pelo lock-in do `react-scripts`.

## 2.1 Hardening do Build

### ✔️ Garantir build limpo e consistente

* Remover `node_modules` e reinstalar mensalmente:

  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
* Evitar dependências desnecessárias.
* Rodar:

  ```bash
  npm audit fix --force
  ```

  *(apenas em branch isolada, depois avaliar impacto)*

---

# 3. 🛡️ Prevenção Contra Injeção SQL

Mesmo sendo um projeto React (front-end), é importante garantir que:

1. **Nenhuma query SQL seja construída no front-end.**
2. Nenhum dado do usuário seja concatenado em requisições que o backend possa processar de forma insegura.

## 3.1 Práticas Obrigatórias

### ✔️ Nunca construir SQL no front-end

* ✅ Confirmado: O React **não contém strings SQL**.
* ✅ Confirmado: Toda persistência de dados ocorre via Supabase Client.

### ✔️ Validar todas as requisições enviadas ao backend

* Todo input do usuário deve ser validado e sanitizado do lado do servidor.
* O backend Supabase usa:
  * *Prepared statements* automáticos
  * *Parameterized queries* via cliente JavaScript
  * Row Level Security (RLS) para controle de acesso

### ✔️ Verificação Realizada

* ✅ **Supabase Client**: Todas as queries usam métodos seguros do cliente
* ✅ **Queries Parametrizadas**: `supabase.from('tabela').select('*').eq('campo', valor)`
* ✅ **Sem SQL Raw**: Nenhuma string SQL encontrada no código frontend

### ✔️ Escapar dados enviados para APIs

No front-end:

* ✅ **DOMPurify já implementado**: O projeto usa `DOMPurify` em `src/components/PainelDescricao.js` para sanitizar HTML antes de renderizar.
* ✅ **React Markdown configurado**: `react-markdown` v10.1.0 está atualizado e configurado para evitar HTML perigoso.
* ✅ **Supabase Client**: Todas as operações de banco de dados usam o cliente Supabase que previne SQL injection através de queries parametrizadas.

### ✔️ Conferir que nenhuma API aceita SQL raw

**✅ Verificação Realizada**: O projeto usa Supabase como backend, que:
- ✅ **Não permite SQL raw no frontend**: Todas as queries são feitas através do cliente Supabase
- ✅ **Usa queries parametrizadas**: Supabase automaticamente usa prepared statements
- ✅ **Row Level Security (RLS)**: Políticas de segurança implementadas no banco
- ✅ **Nenhum SQL no código frontend**: Verificado - nenhuma string SQL encontrada no código React

**Exemplos de uso seguro encontrados**:
- `supabase.from('escolas').select('*')` - Query segura
- `supabase.from('documentos_escola').select('*').eq('escola_id', escolaId)` - Query parametrizada
- Todas as operações usam métodos do cliente Supabase, não SQL direto

---

# 4. 🧭 Plano de Migração (Curto Prazo)

Mesmo mantendo tudo como está, é importante preparar terreno para sair do `react-scripts`.

## 4.1 Preparação (2 semanas)

### ✔️ Criar branch:

```
feature/migration-prep
```

### ✔️ Inventariar Dependências

Gerar relatório:

```bash
npm ls > dependency-tree.txt
```

### ✔️ Reduzir dependências obsoletas

* Remover pacotes não utilizados:

  ```bash
  npm prune
  ```

---

# 5. 🚀 Plano de Migração (Médio Prazo)

## 5.1 Migração Recomendada: react-scripts → Vite

### Por que Vite?

* **Suporte nativo a React 19**: Permite atualizar para React 19 sem problemas
* **Suporte nativo a Tailwind 4**: Compatível com Tailwind CSS 4
* **Elimina completamente Webpack 5 + webpack-dev-server**: Remove dependências vulneráveis
* **Build extremamente mais rápido**: 10-20x mais rápido que webpack
* **100% compatível com projetos CRA**: Migração relativamente simples

### Ações para a Migração

1. **Criar branch**:

   ```bash
   git checkout -b feature/vite-migration
   ```

2. **Instalar Vite e dependências**:

   ```bash
   npm install -D vite @vitejs/plugin-react
   npm install -D @tailwindcss/vite
   ```

3. **Criar `vite.config.js`**:

   ```javascript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import tailwindcss from '@tailwindcss/vite';

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     base: '/opin/',
     build: {
       outDir: 'build',
     },
   });
   ```

4. **Atualizar `package.json` scripts**:

   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

5. **Migrar arquivos**:
   * Mover `public/index.html` para raiz do projeto
   * Atualizar imports no `index.html` (remover `%PUBLIC_URL%`)
   * Migrar variáveis de ambiente (`.env` → `.env.local`)
   * Atualizar imports de assets

6. **Testar build**:

   ```bash
   npm run build
   npm run preview
   ```

7. **Atualizar dependências**:
   * Após migração bem-sucedida, atualizar React 19 e Tailwind 4
   * Remover `react-scripts` e dependências relacionadas

### Checklist de Migração

- [ ] Branch `feature/vite-migration` criada
- [ ] Vite instalado e configurado
- [ ] `vite.config.js` criado
- [ ] Scripts do `package.json` atualizados
- [ ] `index.html` movido e atualizado
- [ ] Variáveis de ambiente migradas
- [ ] Build de produção funcionando
- [ ] Dev server funcionando
- [ ] Todas as rotas funcionando
- [ ] Assets carregando corretamente
- [ ] Testes passando (se houver)
- [ ] Deploy funcionando

---

# 6. 🧪 Checklist de Segurança Contínua

- [x] Nenhuma execução do dev-server em ambiente público
- [x] Build de produção sempre utilizado
- [x] Nenhum SQL aparece no front-end
- [x] Todas as APIs usam prepared statements no backend (via Supabase)
- [x] Sanitização de HTML/Markdown está ativa (DOMPurify)
- [ ] `npm audit` revisado semanalmente
- [ ] Dependências desnecessárias removidas
- [ ] Planejamento da migração para Vite em andamento

---

# 7. 📎 Notas Finais

* O projeto não está vulnerável em produção **neste momento**, mas a falta de atualizações cria risco acumulado.
* O maior risco é continuar preso ao `react-scripts`, impossibilitando atualizações de segurança futuras.
* Injeção SQL só ocorre do lado do servidor — garantido que o Supabase usa *prepared statements* automaticamente.
* Migrar para Vite é a solução estrutural definitiva para permitir atualizações futuras.

---

## 📊 Status Atual do Projeto

### Segurança
- ✅ **SQL Injection**: Protegido via Supabase Client
- ✅ **XSS**: Protegido via DOMPurify e React Markdown
- ✅ **Dev Server**: Isolado em localhost
- ⚠️ **Dependências**: 25 vulnerabilidades moderadas (principalmente dev dependencies)

### Dependências
- ✅ **4 dependências atualizadas** com sucesso
- ⚠️ **3 dependências bloqueadas** por incompatibilidade técnica
- 📋 **Plano de migração** para Vite documentado

### Próximos Passos
1. Revisar `npm audit` semanalmente
2. Planejar migração para Vite (médio prazo)
3. Após migração, atualizar React 19 e Tailwind 4

---

**Última atualização**: 2024-12-XX  
**Status**: Projeto seguro, migração para Vite planejada
