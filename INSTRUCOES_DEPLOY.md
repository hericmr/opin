# Instruções para Deploy

## Comandos para Executar

Execute os seguintes comandos no terminal, na raiz do projeto:

### 1. Verificar status do Git
```bash
git status
```

### 2. Adicionar todos os arquivos modificados
```bash
git add .
```

### 3. Criar commit com as mudanças
```bash
git commit -m "Atualiza página Alguns dados: ajusta cores das seções, adiciona modalidades EJA separadas, melhora legibilidade dos gráficos e remove referência a CECI Krukutu"
```

### 4. Fazer push para GitHub
```bash
git push origin main
```

### 5. Build local (opcional - o GitHub Actions fará automaticamente)
```bash
npm run build
```

## Deploy Automático

O projeto está configurado com GitHub Actions (`.github/workflows/build-and-deploy.yml`). Quando você fizer push para a branch `main`, o workflow irá:

1. ✅ Executar linter
2. ✅ Executar testes
3. ✅ Fazer build do projeto
4. ✅ Fazer deploy automático para GitHub Pages

O deploy será feito automaticamente após o push ser concluído.

## Arquivos Modificados

Os seguintes arquivos foram modificados nesta sessão:

- `src/components/Dashboard.js` - Ajuste de cores das seções
- `src/components/Charts/DistribuicaoAlunosModalidadeChart.js` - Adição de modalidades EJA, ajuste de cores e legibilidade
- `src/components/Charts/TiposEnsinoChart.js` - Ajuste de paleta de cores
- `src/components/Charts/DistribuicaoEscolasCombinadoChart.js` - Ajuste de paleta de cores e remoção de referência
- `src/components/Charts/EquipamentosChart.js` - Ajuste de paleta de cores
- `src/components/Charts/EscolasPorDiretoriaChart.js` - Ajuste de paleta de cores
- `src/services/csvDataService.js` - Cálculo de distribuição de alunos por modalidade usando dados reais do CSV
- `public/dashboard/index.html` - Atualização de título e meta description

## Verificação

Após o push, você pode verificar o status do deploy em:
- GitHub Actions: https://github.com/hericmr/opin/actions
- GitHub Pages: https://hericmr.github.io/opin

