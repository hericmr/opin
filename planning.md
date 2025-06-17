# Plano de Otimização e Limpeza do Projeto

## 1. Remoção de Arquivos Obsoletos ✅
- [x] Remover diretório `src/assets/icons/` (vazio)
- [x] Remover `src/logo.svg` (não utilizado)
- [x] Remover `src/vite.config.js` (não utilizado)
- [x] Remover `src/App.test.js` (se não estiver sendo usado para testes)

## 2. Otimização de Dependências ✅
- [x] Remover `geojson` (redundante com Leaflet)
- [x] Avaliar e possivelmente remover `prop-types` se não estiver em uso ativo (mantido - em uso ativo)
- [x] Desinstalar bibliotecas e ferramentas de conversão (sharp, geojson) (conversões já realizadas)
- [x] Atualizar todas as dependências para suas versões mais recentes e estáveis (via npm update --save) (obs.: atualizações de major (ex. react 19, react-router-dom 6, tailwind 4) foram adiadas para evitar breaking changes)
- [x] Remover dependências de desenvolvimento não utilizadas (obs.: removidos pacotes de teste (Jest, @testing-library/*) e arquivos de teste (ex. src/App.test.js) por estarem obsoletos e não serem mais úteis para o projeto)
  - Revisão de dependências de desenvolvimento (saída de npm ls --dev):
    - Pacotes de teste (candidatos a remoção se não estiverem sendo usados):
      - @testing-library/jest-dom, @testing-library/react, @testing-library/user-event, jest, jest-environment-jsdom
    - Pacotes de build (candidatos a remoção se não forem mais necessários):
      - babel-loader, babel-preset-react-app, autoprefixer, postcss, tailwindcss, react-app-rewired, react-scripts, gh-pages (se não for mais usado para deploy)
    - Outros (revisar se não estão sendo usados):
      - dompurify, leaflet-gpx, papaparse, public-google-sheets-parser, react-quill, react-rnd, slugify, url, web-vitals (se não for mais monitorado), etc.

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
  - [x] Implementar lazy loading
    - Criado componente LazyImage com Intersection Observer
    - Implementado placeholder durante carregamento
    - Adicionado efeito de fade-in suave
  - [x] Otimizar `logo.png`, `logo192.png`, `logo512.png`
  - Convertidas para WebP com reduções significativas:
    - logo.png: 59.53% de redução
    - logo192.png: 83.92% de redução
    - lindi.png: 49.78% de redução
  - Atualizadas referências nos arquivos para usar WebP
  - Adicionado script de otimização para futuras imagens

## 5. Refatoração de Código
- [x] Refatorar `App.js` (439 linhas)
  - [x] Separar em componentes menores
  - [x] Extrair lógica de negócios (obs.: extraídas funções de manipulação de dados, cálculos e regras de negócio (por exemplo, filtragem, agregação, transformação de dados) para hooks personalizados ou utilitários, a fim de separar a lógica de negócios da interface.)
  - [x] Implementar hooks personalizados
- [ ] Refatorar `PainelInformacoes/index.js`
  - [ ] Extrair componentes de renderização de documentos e vídeos
    - [ ] Criar `DocumentViewer` para gerenciar iframes e fallbacks de documentos
    - [ ] Criar `VideoPlayer` para renderização de vídeos do YouTube
    - [ ] Implementar tratamento de erros robusto para iframes
  - [ ] Criar wrapper component para lógica de container e animações
    - [ ] Centralizar classes de visibilidade e dimensões
    - [ ] Manter compatibilidade com hooks existentes (usePainelVisibility, usePainelDimensions)
  - [ ] Reutilizar componentes existentes
    - [ ] Manter PainelHeader como componente separado
    - [ ] Preservar hooks de visibilidade e dimensões
    - [ ] Atualizar imports e referências em arquivos relacionados
  - [ ] Critérios de aceitação:
    - [ ] Implementação modular do index.js mantendo arquitetura atual do painel
    - [ ] Conexões corretas entre arquivos após refatoração
    - [ ] Tratamento confiável de erros de iframe
    - [ ] Responsividade completa com fontes grandes em mobile
    - [ ] Preservação da estrutura atual de pastas
    - [ ] Manutenção da performance atual ou melhor
- [x] Implementar lazy loading para componentes grandes (code splitting com React.lazy/Suspense nas rotas principais)
- [x] Adicionar error boundaries (componente ErrorBoundary criado para capturar erros de renderização e exibir mensagem amigável ao usuário)
- [ ] Implementar React.memo() para componentes com renderização frequente
- [ ] Criar sistema de cache para dados do Supabase

## 6. Melhorias de Performance
- [ ] Configurar code splitting
- [ ] Implementar tree shaking mais agressivo
- [ ] Otimizar bundle size
- [x] Implementar cache para dados GeoJSON (obs.: criado hook useGeoJSONCache para armazenar em cache os dados GeoJSON, evitando requisições repetidas)
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

## 11. Limpeza de Dependências e Ferramentas de Conversão ✅
- [x] Desinstalar bibliotecas e ferramentas utilizadas apenas para conversão de arquivos, pois as conversões já foram realizadas:
  - Remover `sharp` (otimização de imagens)
  - Remover `geojson` (conversão e simplificação de GeoJSON)
  - Remover outros programas/scripts auxiliares usados para conversão
- [x] Documentar no README.md que as conversões foram feitas e que essas dependências não são mais necessárias para rodar o site em produção

## Ordem de Implementação

1. **Fase 1 - Limpeza Inicial ✅**
   - [x] Remoção de arquivos obsoletos
   - [x] Remoção de dependências não utilizadas (incluindo ferramentas de conversão e pacotes de teste)
   - [ ] Implementação do sistema de logging (adiado)

2. **Fase 2 - Otimização de Assets ✅**
   - [x] Otimização de GeoJSON (simplificação e conversão realizadas)
   - [x] Otimização de imagens (conversão para WebP e lazy loading implementados)
   - [x] Implementação de lazy loading (componente LazyImage criado)

3. **Fase 3 - Refatoração ✅**
   - [x] Refatoração do App.js (obs.: separado em componentes menores, extraída lógica de negócios e implementados hooks personalizados)
   - [x] Implementação de code splitting (code splitting com React.lazy/Suspense nas rotas principais)
   - [x] Adição de error boundaries (componente ErrorBoundary criado para capturar erros de renderização e exibir mensagem amigável ao usuário)

4. **Fase 4 - Performance e Segurança (Em andamento)**
   - [x] Implementação de cache (obs.: criado hook useGeoJSONCache para armazenar em cache os dados GeoJSON, evitando requisições repetidas)
   - [ ] Otimização de chamadas à API (ex. rate limiting, cache de requisições, SSR quando possível)
   - [ ] Melhorias de segurança (ex. validação rigorosa de dados, revisão de políticas de segurança do Supabase, remoção de logs sensíveis)

5. **Fase 5 - Testes e Documentação**
   - [ ] Implementação de testes (obs.: pacotes de teste removidos por obsoletos)
   - [ ] Atualização da documentação (ex. atualizar README.md, documentar componentes principais, criar guia de contribuição, documentar sistema de logging)
   - [ ] Configuração de monitoramento (ex. métricas de performance, monitoramento de erros, alertas para problemas críticos)

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

# Project Adaptation Plan

## Overview
This document outlines the plan to adapt the existing project for new file upload requirements and form structure changes. The main changes involve updating the Supabase bucket configuration and modifying the form structure to meet new requirements.

## 1. File Upload Destination Changes

### 1.1 Supabase Configuration Updates
- [ ] Update `src/supabaseClient.js` to ensure proper access to the new 'pdfs' bucket
- [ ] Verify and update bucket policies in Supabase dashboard for the 'pdfs' bucket
- [ ] Add bucket configuration constants in a new `src/config/storage.js` file

### 1.2 Upload Service Updates
- [ ] Modify `src/services/uploadService.js`:
  - Update default bucket from 'media' to 'pdfs'
  - Add PDF-specific validation and handling
  - Update file path structure for PDFs
  - Add new utility functions for PDF handling
  - Update error handling for PDF-specific cases

### 1.3 Component Updates
- [ ] Update `src/components/AddLocationPanel/components/MapSection.js`:
  - Modify file upload handlers for PDF files
  - Update file type validation
  - Adjust UI for PDF upload interface
- [ ] Update `src/components/EditLocationPanel/index.js`:
  - Modify file upload handlers for PDF compatibility
  - Update preview handling for PDFs
  - Adjust validation logic

## 2. Form Structure Updates

### 2.1 Schema and Type Definitions
- [ ] Create new type definitions in `src/types/form.ts`:
  - Define PDF upload related interfaces
  - Update location form interface
  - Add validation schemas using Zod

### 2.2 Form Component Updates
- [ ] Update `src/components/AddLocationPanel/index.js`:
  - Modify form structure for new fields
  - Update validation logic
  - Add PDF-specific form fields
  - Update PropTypes definitions
- [ ] Update `src/components/EditLocationPanel/index.js`:
  - Mirror changes from AddLocationPanel
  - Update edit form validation
  - Add PDF handling in edit mode

### 2.3 Validation and Error Handling
- [ ] Create new validation utilities in `src/utils/validation.js`:
  - Add PDF file validation
  - Update form field validation
  - Add custom error messages
- [ ] Update error handling across components:
  - Add PDF-specific error states
  - Improve error messaging
  - Add validation feedback

## 3. Testing Updates

### 3.1 Unit Tests
- [ ] Update `src/services/__tests__/uploadService.test.js`:
  - Add tests for PDF upload functionality
  - Update existing tests for new bucket
  - Add validation test cases
- [ ] Update component tests:
  - Add PDF upload test cases
  - Update form validation tests
  - Add new field test coverage

### 3.2 Integration Tests
- [ ] Add end-to-end tests for PDF upload flow
- [ ] Test form submission with PDF files
- [ ] Verify bucket access and permissions

## 4. Documentation Updates

### 4.1 Code Documentation
- [ ] Update JSDoc comments for modified functions
- [ ] Add documentation for new PDF handling utilities
- [ ] Document form structure changes

### 4.2 User Documentation
- [ ] Update README.md with new upload requirements
- [ ] Document PDF file restrictions and requirements
- [ ] Add troubleshooting guide for common issues

## Follow-up Tasks
- [ ] Verify Supabase bucket permissions after deployment
- [ ] Test PDF upload with various file sizes and types
- [ ] Monitor error rates and user feedback
- [ ] Consider adding analytics for upload success/failure rates

## Potential Issues to Review
1. PDF file size limits and performance impact
2. Browser compatibility for PDF preview
3. Mobile device support for PDF upload
4. Storage quota management
5. Security considerations for PDF file handling 

## [IMAGENS ESCOLA] Integração de imagens vinculadas à escola

### 1. Criação da tabela no Supabase
- **Tabela criada:** `imagens_escola`
- **Campos:**
  - `id` (serial, chave primária)
  - `escola_id` (inteiro, referência para escolas_completa)
  - `url` (texto, obrigatório)
  - `descricao` (texto, opcional)
  - `tipo` (texto, opcional)
  - `created_at` (timestamp, padrão now())
- **Motivação:** Permitir o armazenamento e gerenciamento de múltiplas imagens por escola, com metadados opcionais.
- **Atenção:** Garantir que as permissões de leitura estejam corretas para o frontend acessar as imagens.

### 2. Novo componente de exibição de imagens
- **Local:** `src/components/PainelInformacoes/components/EscolaImagens.js`
- **Descrição:**
  - Componente React responsável por buscar e renderizar as imagens associadas à escola exibida no painel de informações.
  - Exibe as imagens em grid responsivo, com legenda (se houver).
  - Permite visualização ampliada (modal/lightbox) se necessário.
- **Integração:**
  - O componente será importado e utilizado dentro de `PainelInformacoes` (ou em `EscolaInfo`), recebendo o `escola_id` como prop.
  - As imagens são buscadas da tabela `imagens_escola` via Supabase.

### 3. Ajustes no PainelInformacoes
- **Alteração:**
  - Incluir o novo componente de imagens na renderização do painel de informações da escola.
  - Garantir que o componente só apareça se houver imagens cadastradas para a escola.

### 4. Testes e validação
- **Testar:**
  - Upload e cadastro de imagens no Supabase.
  - Renderização correta das imagens no painel.
  - Responsividade e acessibilidade do componente.

### 5. Follow-up
- **Revisar:**
  - Políticas de acesso à tabela de imagens.
  - UX para múltiplas imagens e fallback para escolas sem imagens.
  - Documentar a estrutura da tabela no README.md. 