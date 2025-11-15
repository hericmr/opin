
* Como **mitigar riscos sem atualizar agora**
* Como **garantir que o projeto atual evita ataques de Injeção SQL**
* Mantendo tudo em formato profissional e estruturado

Você pode copiar/colar direto no projeto.

---

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
* Confirmar que o servidor de deploy (Netlify, Vercel, GitHub Pages ou backend próprio) está servindo arquivos **estáticos**.

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

* Confirmar que o React **não contém strings SQL**.
* Garantir que toda persistência de dados ocorre via backend.

### ✔️ Validar todas as requisições enviadas ao backend

* Todo input do usuário deve ser validado e sanitizado do lado do servidor.
* O backend deve usar:

  * *Prepared statements*
  * *Parameterized queries*
  * ORMs que previnem SQL Injection (Prisma, Sequelize, TypeORM)

### ✔️ Verificar se o backend já usa essas práticas:

* `WHERE id = $1` (Postgres)
* `?` placeholders (MySQL)
* `prisma.user.findUnique({ where: { id } })`

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

## 5.1 Migração recomendada: **react-scripts → Vite**

### Justificativas:

* Resolve TODOS os problemas atuais:

  * Suporte a React 19
  * Suporte a Tailwind 4
  * Abandona Webpack 5, webpack-dev-server e dependências vulneráveis
  * Build 10x mais rápido
  * Totalmente compatível com CRA

### Ações:

1. Criar nova branch:

   ```
   feature/vite-migration
   ```
2. Rodar conversão automática:

   ```bash
   npm create vite@latest
   ```
3. Migrar:

   * `src/` inteiro
   * assets
   * rotas
   * envs
   * Tailwind config
4. Testar build:

   ```bash
   npm run build
   ```

---

# 6. 🧪 Checklist de Segurança Contínua

* [ ] Nenhuma execução do dev-server em ambiente público
* [ ] Build de produção sempre utilizado
* [ ] Nenhum SQL aparece no front-end
* [ ] Todas as APIs usam prepared statements no backend
* [ ] Sanitização de HTML/Markdown está ativa
* [ ] `npm audit` revisado semanalmente
* [ ] Dependências desnecessárias removidas
* [ ] Planejamento da migração para Vite em andamento

---

# 7. 📎 Notas Finais

* O projeto não está vulnerável em produção **neste momento**, mas a falta de atualizações cria risco acumulado.
* O maior risco é continuar preso ao `react-scripts`, impossibilitando atualizações de segurança futuras.
* Injeção SQL só ocorre do lado do servidor — garantir que o backend continue usando *prepared statements*.
* Migrar para Vite é a solução estrutural definitiva.

---

