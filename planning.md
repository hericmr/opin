# Plano de Otimização e Limpeza do Projeto

## 1. Remoção de Arquivos Obsoletos ✅
- [x] Remover diretório `src/assets/icons/` (vazio)
- [x] Remover `src/logo.svg` (não utilizado)
- [x] Remover `src/vite.config.js` (não utilizado)
- [x] Remover `src/App.test.js` (se não estiver sendo usado para testes)

## 2. Otimização de Dependências ✅
- [x] Remover `geojson` (redundante com Leaflet)
- [x] Avaliar e possivelmente remover `prop-types` se não estiver em uso ativo (mantido - em uso ativo)
- [ ] Atualizar todas as dependências para suas versões mais recentes e estáveis
- [ ] Remover dependências de desenvolvimento não utilizadas

## 3. Sistema de Logging (Adiado - faremos isso por ultimo)
- [ ] Implementar sistema de logging configurável (adiado para fase posterior)
  - [ ] Adicionar `winston` ou similar
  - [ ] Criar níveis de log (error, warn, info, debug)
  - [ ] Configurar logs diferentes para desenvolvimento e produção
- [ ] Remover console.logs de produção (adiado para fase posterior)
  - [ ] `src/components/AddLocationButton.js`
  - [ ] `src/components/Marcadores.js`
  - [ ] `src/components/MapaEscolasIndigenas.js`
  - [ ] `src/components/TerrasIndigenas.js`
  - [ ] `src/supabaseClient.js`
  - [ ] Outros componentes com logs de debug

## 4. Otimização de Assets
- [x] Otimizar arquivos GeoJSON
  - [x] Simplificar geometria de `terras_indigenas.geojson` (redução de 79%)
  - [x] Simplificar geometria de `SP.geojson` (redução de 91%)
  - [x] Implementar carregamento progressivo
  - [ ] Configurar compressão gzip/brotli
- [x] Otimizar imagens
  - [x] Converter para WebP
  - [ ] Implementar lazy loading
  - [x] Otimizar `logo.png`, `logo192.png`, `logo512.png`
  - Convertidas para WebP com reduções significativas:
    - logo.png: 59.53% de redução
    - logo192.png: 83.92% de redução
    - lindi.png: 49.78% de redução
  - Atualizadas referências nos arquivos para usar WebP
  - Adicionado script de otimização para futuras imagens

## 5. Refatoração de Código
- [ ] Refatorar `App.js` (439 linhas)
  - [ ] Separar em componentes menores
  - [ ] Extrair lógica de negócios
  - [ ] Implementar hooks personalizados
- [ ] Implementar lazy loading para componentes grandes
- [ ] Adicionar error boundaries
- [ ] Implementar React.memo() para componentes com renderização frequente
- [ ] Criar sistema de cache para dados do Supabase

## 6. Melhorias de Performance
- [ ] Configurar code splitting
- [ ] Implementar tree shaking mais agressivo
- [ ] Otimizar bundle size
- [ ] Implementar cache para dados GeoJSON
- [ ] Otimizar chamadas à API
  - [ ] Implementar rate limiting
  - [ ] Adicionar cache de requisições
  - [ ] Mover chamadas client-side para SSR quando possível

## 7. Segurança
- [ ] Remover logs que expõem informações sensíveis
- [ ] Implementar validação de dados mais rigorosa
- [ ] Revisar e atualizar políticas de segurança do Supabase
- [ ] Implementar rate limiting para API

## 8. Testes e Qualidade
- [ ] Implementar testes unitários para componentes críticos
- [ ] Adicionar testes de integração
- [ ] Configurar CI/CD
- [ ] Implementar análise estática de código

## 9. Documentação
- [ ] Atualizar README.md com novas instruções
- [ ] Documentar componentes principais
- [ ] Criar guia de contribuição
- [ ] Documentar sistema de logging

## 10. Monitoramento
- [ ] Implementar métricas de performance
- [ ] Adicionar monitoramento de erros
- [ ] Configurar alertas para problemas críticos

## Ordem de Implementação

1. **Fase 1 - Limpeza Inicial ✅**
   - [x] Remoção de arquivos obsoletos
   - [x] Remoção de dependências não utilizadas
   - [ ] Implementação do sistema de logging (adiado)

2. **Fase 2 - Otimização de Assets**
   - Otimização de GeoJSON
   - Otimização de imagens
   - Implementação de lazy loading

3. **Fase 3 - Refatoração**
   - Refatoração do App.js
   - Implementação de code splitting
   - Adição de error boundaries

4. **Fase 4 - Performance e Segurança**
   - Implementação de cache
   - Otimização de chamadas à API
   - Melhorias de segurança

5. **Fase 5 - Testes e Documentação**
   - Implementação de testes
   - Atualização da documentação
   - Configuração de monitoramento

## Métricas de Sucesso
- Redução do bundle size em pelo menos 20%
- Redução do tempo de carregamento inicial em 30%
- Cobertura de testes acima de 80%
- Zero console.logs em produção
- [x] Redução do tamanho dos arquivos GeoJSON em 50% (atingido: 79% e 91%)

## Notas Importantes
- Todas as mudanças devem ser feitas em branches separadas
- Cada mudança deve ser testada antes de ser mesclada
- Manter compatibilidade com versões anteriores
- Documentar todas as breaking changes
- Realizar backups antes de mudanças significativas

## Próximos Passos
1. Prosseguir com a Fase 2 - Otimização de Assets
2. Implementar sistema de logging em uma fase posterior
3. Manter os console.logs por enquanto, mas documentá-los para remoção futura 