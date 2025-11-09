# Guia de Deploy - Sistema de Versionamento de Metadados

## Passo a Passo Completo

### 1. Verificar Status Atual

```bash
# Verificar em qual branch você está
git branch

# Deve mostrar: * feature/versionamento-metadados

# Verificar arquivos modificados
git status
```

### 2. Adicionar Arquivos ao Git

```bash
# Adicionar todos os arquivos novos e modificados
git add .

# OU adicionar arquivos específicos:
git add Planning.md
git add migrations/
git add src/services/versionamentoService.js
git add src/components/AdminPanel/components/MetadadosForm.js
git add src/components/AdminPanel/hooks/useEscolas.js
git add src/components/AdminPanel/index.js
```

### 3. Criar Commit

```bash
# Criar commit com mensagem descritiva
git commit -m "feat: implementa sistema de versionamento de metadados

- Adiciona tabelas fontes_dados e versoes_dados
- Cria serviço de versionamento (versionamentoService.js)
- Adiciona formulário de metadados no painel admin
- Integra versionamento automático em criações/edições de escolas
- Adiciona migrações SQL e documentação"
```

### 4. Fazer Push da Branch para GitHub

```bash
# Fazer push da branch feature/versionamento-metadados
git push origin feature/versionamento-metadados

# Se for a primeira vez que você faz push desta branch:
git push -u origin feature/versionamento-metadados
```

### 5. Testar Localmente (Opcional mas Recomendado)

```bash
# Instalar dependências (se necessário)
npm install

# Executar em modo de desenvolvimento
npm start

# Testar:
# 1. Acessar http://localhost:3000/opin/admin
# 2. Criar ou editar uma escola
# 3. Verificar se o formulário de metadados aparece
# 4. Preencher metadados (opcional)
# 5. Salvar e verificar no console se não há erros
```

### 6. Fazer Build

```bash
# Executar build de produção
npm run build

# Isso vai:
# - Compilar o React
# - Otimizar os arquivos
# - Processar o dashboard HTML
# - Criar a pasta build/ com os arquivos prontos
```

### 7. Verificar Build

```bash
# Verificar se a pasta build foi criada
ls -la build/

# Deve conter:
# - index.html
# - static/
# - dashboard/
# - etc.
```

### 8. Deploy para GitHub Pages

**Opção A: Deploy da Branch (Recomendado para teste)**

Se você quer fazer deploy apenas da branch feature para testar:

```bash
# Fazer deploy da branch atual
npm run deploy

# Isso vai:
# - Executar npm run build automaticamente (predeploy)
# - Fazer deploy para GitHub Pages usando gh-pages
# - Criar/atualizar a branch gh-pages no GitHub
```

**Opção B: Criar Pull Request (Recomendado para produção)**

1. Após fazer push da branch, vá para o GitHub
2. Crie um Pull Request de `feature/versionamento-metadados` para `main`
3. Revise as mudanças
4. Após aprovar e fazer merge em `main`, faça deploy:

```bash
# Mudar para branch main
git checkout main

# Atualizar main com as mudanças
git pull origin main

# Fazer deploy
npm run deploy
```

### 9. Verificar Deploy

Após o deploy, verifique:

1. Acesse: https://hericmr.github.io/opin
2. Vá para `/admin`
3. Teste criar/editar uma escola
4. Verifique se o formulário de metadados aparece
5. Verifique no console do navegador se não há erros

### 10. Verificar Versionamento no Banco

No Supabase SQL Editor, execute:

```sql
-- Verificar se versões estão sendo criadas
SELECT 
  vd.id,
  vd.nome_tabela,
  vd.chave_linha,
  vd.autor,
  vd.observacoes,
  vd.criado_em,
  fd.nome as fonte_nome
FROM versoes_dados vd
LEFT JOIN fontes_dados fd ON vd.fonte_id = fd.id
ORDER BY vd.criado_em DESC
LIMIT 10;
```

## Comandos Rápidos (Tudo de Uma Vez)

Se você quer fazer tudo rapidamente:

```bash
# 1. Adicionar arquivos
git add .

# 2. Commit
git commit -m "feat: implementa sistema de versionamento de metadados"

# 3. Push da branch
git push origin feature/versionamento-metadados

# 4. Build e Deploy (se quiser testar)
npm run build
npm run deploy
```

## Troubleshooting

### Erro: "branch already exists"

```bash
# Se a branch já existe no GitHub, apenas faça push:
git push origin feature/versionamento-metadados
```

### Erro: "nothing to commit"

```bash
# Verifique se há mudanças não commitadas:
git status

# Se não houver mudanças, tudo já foi commitado
```

### Erro no Build

```bash
# Limpar cache e node_modules
rm -rf node_modules
rm -rf build
npm install
npm run build
```

### Erro no Deploy

```bash
# Verificar se gh-pages está instalado
npm list gh-pages

# Se não estiver:
npm install --save-dev gh-pages

# Tentar deploy novamente
npm run deploy
```

## Checklist Antes de Fazer Merge em Main

- [ ] Migrações SQL executadas no Supabase
- [ ] Código testado localmente
- [ ] Build executado com sucesso
- [ ] Sem erros no console do navegador
- [ ] Formulário de metadados aparece corretamente
- [ ] Versionamento funciona (verificar no banco)
- [ ] Pull Request criado no GitHub
- [ ] Código revisado

## Após Merge em Main

Quando o PR for aprovado e mergeado:

```bash
# 1. Voltar para main
git checkout main

# 2. Atualizar main
git pull origin main

# 3. Deploy para produção
npm run deploy

# 4. Verificar produção
# Acesse: https://hericmr.github.io/opin
```

## Estrutura de Commits Recomendada

Para manter histórico limpo:

```bash
# Commit 1: Migrações e documentação
git add migrations/ Planning.md migrations/README.md
git commit -m "docs: adiciona migrações SQL e planejamento do versionamento"

# Commit 2: Serviço backend
git add src/services/versionamentoService.js
git commit -m "feat: adiciona serviço de versionamento de metadados"

# Commit 3: Componente frontend
git add src/components/AdminPanel/components/MetadadosForm.js
git commit -m "feat: adiciona formulário de metadados no painel admin"

# Commit 4: Integração
git add src/components/AdminPanel/hooks/useEscolas.js src/components/AdminPanel/index.js
git commit -m "feat: integra versionamento no fluxo de criação/edição de escolas"
```

## Notas Importantes

1. **Não faça deploy direto da branch feature** para produção
2. **Sempre teste localmente** antes de fazer deploy
3. **Verifique o banco de dados** após deploy para confirmar que versões estão sendo criadas
4. **Mantenha as migrações SQL** no repositório para referência futura

