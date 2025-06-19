# PainelInformacoes Editing Flow Redesign — Implementation Plan

## Execution Phases & Checklist

### [x] **Phase 1: Analysis** (Complete)
- [x] List all Supabase tables used by PainelInformacoes
- [x] List all editable fields for each table
- [x] Identify which fields require file uploads to buckets

### [x] **Phase 2: Component Design** (Complete)
- [x] Define editing component structure (modal, drawer, or page)
- [x] Specify form state and input types
- [x] Plan media upload UI and integration
- [x] Map Supabase client methods to actions

### [x] **Phase 3: Implementation** (In Progress)
- [x] Implement form and state management
- [x] Implement Supabase insert/upsert for all tables
- [x] Implement file upload to buckets and metadata insertion
- [ ] Add validation, error handling, and loading states
- [ ] Ensure real-time update of PainelInformacoes

### [ ] **Phase 4: Testing & Integration**
- [ ] Add and test mock data for all field types
- [ ] Test file uploads (valid/invalid cases)
- [ ] Ensure immediate data reflection in PainelInformacoes
- [ ] Handle all error and edge cases

### [ ] **Phase 5: Final Documentation**
- [ ] Update README.md with usage instructions
- [ ] Document Supabase schema and file path conventions

---

## **NOVA SEÇÃO: Upload de Imagens ao Bucket no Edit Panel**

### **Objetivo**
Implementar funcionalidade completa de upload de imagens ao bucket `imagens-das-escolas` no EditEscolaPanel, incluindo:
- Interface de upload com preview
- Validação de arquivos
- Upload ao bucket do Supabase
- Inserção de metadados na tabela `imagens_escola`
- Feedback visual de progresso e erros

### **Estrutura dos Buckets e Tabelas**

#### **Buckets do Supabase Storage:**
- `imagens-das-escolas` - Para imagens das escolas
- `imagens-professores` - Para imagens dos professores
- `documentos-das-escolas` - Para documentos das escolas

#### **Tabelas de Metadados:**
- `imagens_escola` - Metadados das imagens das escolas e professores
- `documentos_escola` - Metadados dos documentos das escolas

### **Processo de Upload de Imagens**

#### **1. Configuração dos Buckets**
```sql
-- Bucket: imagens-das-escolas
-- Política de acesso público para leitura
-- Política de upload para usuários autenticados

-- Bucket: imagens-professores
-- Política de acesso público para leitura
-- Política de upload para usuários autenticados

-- Estrutura de pastas:
-- imagens-das-escolas/
--   ├── {escola_id}/
--   │   ├── {escola_id}_{timestamp}_{random}.jpg
--   │   ├── {escola_id}_{timestamp}_{random}.png
--   │   └── ...

-- imagens-professores/
--   ├── {escola_id}/
--   │   ├── {escola_id}_{timestamp}_{random}.jpg
--   │   ├── {escola_id}_{timestamp}_{random}.png
--   │   └── ...
```

#### **2. Estrutura da Tabela `imagens_escola`**
```sql
CREATE TABLE imagens_escola (
  id SERIAL PRIMARY KEY,
  escola_id INTEGER REFERENCES escolas_completa(id),
  url TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **3. Fluxo de Upload**
1. **Seleção de Arquivos**
   - Interface de drag & drop ou file input
   - Validação de tipos (JPG, PNG, WEBP, GIF)
   - Validação de tamanho (máx 5MB por arquivo)
   - Preview das imagens selecionadas

2. **Upload ao Bucket**
   - Geração de nome único para cada arquivo
   - Upload para `imagens-das-escolas/{escola_id}/{filename}` ou `imagens-professores/{escola_id}/{filename}`
   - Tratamento de erros de upload

3. **Inserção de Metadados**
   - Obtenção da URL pública após upload
   - Inserção na tabela `imagens_escola`
   - Relacionamento com `escola_id`

4. **Feedback Visual**
   - Progress bar durante upload
   - Mensagens de sucesso/erro
   - Atualização da lista de imagens

### **Implementação Técnica**

#### **1. Serviço de Upload de Imagens das Escolas**
```javascript
// src/services/escolaImageService.js
export const uploadEscolaImage = async (file, escolaId, descricao = '') => {
  // 1. Validar arquivo
  // 2. Gerar nome único
  // 3. Upload ao bucket imagens-das-escolas
  // 4. Inserir metadados
  // 5. Retornar dados da imagem
};
```

#### **2. Serviço de Upload de Imagens dos Professores**
```javascript
// src/services/professorImageService.js
export const uploadProfessorImage = async (file, escolaId, descricao = '') => {
  // 1. Validar arquivo
  // 2. Gerar nome único
  // 3. Upload ao bucket imagens-professores
  // 4. Inserir metadados
  // 5. Retornar dados da imagem
};
```

#### **3. Componente de Upload das Escolas**
```javascript
// src/components/EditEscolaPanel/ImageUploadSection.js
const ImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  // Interface de upload para imagens das escolas
  // Preview de imagens
  // Lista de imagens existentes
  // Funcionalidade de remoção
};
```

#### **4. Componente de Upload dos Professores**
```javascript
// src/components/EditEscolaPanel/ProfessorImageUploadSection.js
const ProfessorImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  // Interface de upload para imagens dos professores
  // Preview de imagens
  // Lista de imagens existentes
  // Funcionalidade de remoção
};
```

#### **5. Integração no EditEscolaPanel**
- Nova aba "Imagens da Escola" no painel de edição
- Nova aba "Imagens do Professor" no painel de edição
- Seção de upload integrada
- Lista de imagens existentes com opções de edição/remoção

### **Validações e Restrições**

#### **Tipos de Arquivo Permitidos:**
- JPG/JPEG
- PNG
- WEBP
- GIF

#### **Limites:**
- **Imagens das Escolas**: Máximo 10 imagens por escola
- **Imagens dos Professores**: Máximo 5 imagens por escola
- Tamanho máximo: 5MB por arquivo
- Resolução mínima: 200x200px

#### **Validações:**
- Verificação de tipo MIME
- Verificação de extensão
- Verificação de tamanho
- Verificação de dimensões (opcional)

### **Tratamento de Erros**

#### **Cenários de Erro:**
1. **Arquivo inválido**
   - Tipo não suportado
   - Tamanho muito grande
   - Arquivo corrompido

2. **Erro de Upload**
   - Falha de conexão
   - Erro do Supabase
   - Quota excedida

3. **Erro de Metadados**
   - Falha na inserção na tabela
   - Erro de relacionamento

#### **Feedback ao Usuário:**
- Mensagens de erro específicas
- Sugestões de correção
- Opção de tentar novamente

### **Interface do Usuário**

#### **Seção de Upload das Escolas:**
- Área de drag & drop
- Botão "Selecionar Arquivos"
- Lista de arquivos selecionados com preview
- Progress bar durante upload
- Botões de remoção individual
- Tema azul para diferenciação

#### **Seção de Upload dos Professores:**
- Área de drag & drop
- Botão "Selecionar Arquivos"
- Lista de arquivos selecionados com preview
- Progress bar durante upload
- Botões de remoção individual
- Tema verde para diferenciação

#### **Lista de Imagens:**
- Grid responsivo de imagens
- Thumbnail com overlay de ações
- Modal de preview em tamanho real
- Opções de editar descrição e remover

#### **Estados Visuais:**
- Loading durante upload
- Sucesso com checkmark
- Erro com ícone de alerta
- Hover effects para interações

### **Integração com PainelInformacoes**

#### **Atualização em Tempo Real:**
- Após upload bem-sucedido, atualizar contexto global
- Refrescar componente `ImagensdasEscolas`
- Refrescar componente `ImagemHistoriadoProfessor`
- Notificar outros componentes sobre mudanças

#### **Cache e Performance:**
- Cache de imagens por escola
- Lazy loading de imagens
- Otimização de thumbnails

### **Testes e Qualidade**

#### **Testes Unitários:**
- Validação de arquivos
- Upload de imagens
- Inserção de metadados
- Tratamento de erros

#### **Testes de Integração:**
- Fluxo completo de upload
- Integração com EditEscolaPanel
- Atualização do PainelInformacoes

#### **Testes de Usabilidade:**
- Interface responsiva
- Acessibilidade
- Performance com múltiplas imagens

---

## **NOVA SEÇÃO: Upload de Imagens dos Professores ao Bucket**

### **Objetivo**
Implementar funcionalidade específica para upload de imagens dos professores ao bucket `imagens-professores`, diferenciada das imagens das escolas.

### **Diferenças das Imagens das Escolas**

#### **Bucket Específico:**
- **Escolas**: `imagens-das-escolas`
- **Professores**: `imagens-professores`

#### **Limites Diferentes:**
- **Escolas**: Máximo 10 imagens por escola
- **Professores**: Máximo 5 imagens por escola

#### **Interface Visual:**
- **Escolas**: Tema azul
- **Professores**: Tema verde com ícone de usuário

#### **Componentes Específicos:**
- `ProfessorImageUploadSection.js` - Interface específica para professores
- `professorImageService.js` - Serviço específico para professores

### **Estrutura de Dados**

#### **Bucket: `imagens-professores`**
```
imagens-professores/
├── {escola_id}/
│   ├── {escola_id}_{timestamp}_{random}.jpg
│   ├── {escola_id}_{timestamp}_{random}.png
│   └── ...
```

#### **Tabela: `imagens_escola` (compartilhada)**
- Usa a mesma tabela `imagens_escola`
- Diferenciação por URL (caminho do bucket)
- Filtros específicos para cada tipo

### **Fluxo de Upload dos Professores**

#### **1. Seleção de Arquivos**
- Interface específica com tema verde
- Validação de tipos (JPG, PNG, WEBP, GIF)
- Validação de tamanho (máx 5MB por arquivo)
- Preview das imagens selecionadas
- Limite de 5 imagens por escola

#### **2. Upload ao Bucket**
- Geração de nome único: `{escola_id}_{timestamp}_{random}.{ext}`
- Upload para `imagens-professores/{escola_id}/{filename}`
- Tratamento de erros de rede e storage

#### **3. Inserção de Metadados**
- Obtenção da URL pública após upload
- Inserção na tabela `imagens_escola`
- Relacionamento com `escola_id`

#### **4. Feedback Visual**
- Progress bar durante upload
- Mensagens de sucesso/erro
- Atualização da lista de imagens
- Tema verde para diferenciação

### **Implementação Técnica**

#### **Serviço de Upload dos Professores**
```javascript
// src/services/professorImageService.js
const PROFESSOR_IMAGE_CONFIG = {
  BUCKET_NAME: 'imagens-professores',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_SCHOOL: 5,
  MIN_DIMENSIONS: { width: 200, height: 200 }
};

export const uploadProfessorImage = async (file, escolaId, descricao = '') => {
  // Implementação específica para professores
};
```

#### **Componente de Upload dos Professores**
```javascript
// src/components/EditEscolaPanel/ProfessorImageUploadSection.js
const ProfessorImageUploadSection = ({ escolaId, onImagesUpdate }) => {
  // Interface específica para professores
  // Tema verde
  // Ícone de usuário
  // Limite de 5 imagens
};
```

### **Integração no Sistema**

#### **EditEscolaPanel:**
- Nova aba "Imagens do Professor"
- Integração com `ProfessorImageUploadSection`
- Callback específico para atualizações

#### **AdminPanel:**
- Nova aba "Imagens do Professor"
- Interface contextual com explicações
- Integração com o sistema de edição existente

### **Validações Específicas**

#### **Limites dos Professores:**
- Máximo 5 imagens por escola
- Tamanho máximo: 5MB por arquivo
- Tipos: JPG, JPEG, PNG, WEBP, GIF

#### **Diferenciação Visual:**
- Tema verde para professores
- Ícone de usuário
- Mensagens específicas
- Confirmações específicas

### **Tratamento de Erros**

#### **Cenários Específicos:**
1. **Limite de imagens do professor atingido**
2. **Erro de upload para bucket específico**
3. **Falha na inserção de metadados**

#### **Feedback Específico:**
- Mensagens específicas para professores
- Sugestões de correção
- Opção de tentar novamente

### **Interface do Usuário**

#### **Tema Visual:**
- Cores verdes para diferenciação
- Ícone de usuário
- Mensagens específicas para professores

#### **Funcionalidades:**
- Drag & drop específico
- Preview de imagens
- Gerenciamento completo
- Modal de preview
- Edição de descrições

### **Integração com PainelInformacoes**

#### **Componente Existente:**
- `ImagemHistoriadoProfessor.js` já usa o bucket `imagens-professores`
- Atualização automática após upload
- Cache de imagens por escola

#### **Performance:**
- Lazy loading específico
- Cache otimizado
- Requisições eficientes

### **Testes Específicos**

#### **Testes de Limite:**
- Verificar limite de 5 imagens por escola
- Testar upload quando limite atingido
- Verificar mensagens de erro específicas

#### **Testes de Integração:**
- Fluxo completo de upload de professores
- Integração com `ImagemHistoriadoProfessor`
- Atualização do PainelInformacoes

### **Benefícios da Implementação**

#### **Para o Usuário:**
- Interface diferenciada e intuitiva
- Limites específicos para professores
- Feedback visual claro
- Gerenciamento organizado

#### **Para o Sistema:**
- Separação clara de responsabilidades
- Buckets organizados
- Performance otimizada
- Manutenibilidade

---

## Phase 1: Analysis (Complete)

- **Supabase tables used:**
  - [x] escolas_completa
  - [x] imagens_escola
  - [x] documentos_escola

- **Editable fields checklist:**
  - **escolas_completa** (todos os campos analisados)
  - **imagens_escola** (todos os campos analisados)
  - **documentos_escola** (todos os campos analisados)

- **Fields requiring file upload:**
  - [x] imagens_escola: image files (to bucket)
  - [x] documentos_escola: document files (to bucket)
  - [ ] audio/video: confirmar se haverá upload e bucket (opcional, depende da necessidade do projeto)

---

_Phase 1 concluída. Pronto para avançar para a Fase 2: Component Design._

## Phase 2: Component Design (Complete)

- **Component Structure:**
  - [x] Dedicated page (recommended for full editing experience, especially with many fields and media uploads)
  - [ ] Modal/drawer (could be used for quick edits, but not ideal for full data entry)
  - [x] Organization: Tabs or vertical sections for "Dados da Escola", "Imagens", "Documentos" (and opcional: "Áudio/Vídeo")

- **Form State & Inputs:**
  - [x] Controlled inputs for all text, number, select, and checkbox fields
  - [x] Arrays for images/documents to be uploaded (with preview and removal)
  - [x] Loading and error states for async operations

- **Media Upload UI:**
  - [x] File input for images/documents (multiple allowed)
  - [x] Preview for selected files before upload
  - [x] Remove/cancel option for files before upload

- **Supabase Client Methods Mapping:**
  - **Salvar/atualizar dados da escola (`escolas_completa`):**
    - Usar `supabase.from('escolas_completa').insert()` para novos registros.
    - Usar `supabase.from('escolas_completa').upsert()` para atualizar registros existentes (baseado em `id`).
  - **Upload de imagens (`imagens_escola` + bucket):**
    - Para cada imagem:
      - Usar `supabase.storage.from('imagens-das-escolas').upload('escola_id/filename.ext', file)`
      - Após upload, obter a URL pública e inserir metadados em `imagens_escola` com `supabase.from('imagens_escola').insert({ escola_id, url, descricao })`
  - **Upload de documentos (`documentos_escola` + bucket):**
    - Para cada documento:
      - Usar `supabase.storage.from('documentos-das-escolas').upload('escola_id/filename.ext', file)`
      - Após upload, obter a URL pública e inserir metadados em `documentos_escola` com `supabase.from('documentos_escola').insert({ escola_id, url, titulo, tipo })`
  - **(Opcional) Upload de áudio/vídeo:**
    - Seguir padrão similar, usando buckets e tabelas/metadados apropriados.
  - **Após qualquer operação de inserção/edição:**
    - Atualizar o estado global/contexto para refletir as mudanças em `PainelInformacoes` imediatamente.
  - **Tratamento de erros:**
    - Capturar e exibir mensagens de erro para falhas de upload ou inserção.
    - Exibir loading indicators durante operações assíncronas.

---

_Next step: Detalhar o mapeamento dos métodos do Supabase para cada ação do componente e avançar para a Fase 3: Implementation._

## Phase 3: Implementation (In Progress)

- **Primeiros passos:**
  - [x] Criar componente de edição dedicado (ex: `EscolaEditPanel.js`)
  - [x] Estruturar formulário inicial com campos principais de `escolas_completa`
  - [x] Adicionar inputs para upload de imagens e documentos (com preview)
  - [x] Integrar Supabase para inserção/atualização de dados da escola (`insert`/`upsert`)
  - [x] Integrar Supabase Storage para upload de arquivos e inserção de metadados
  - [ ] Adicionar validação de campos obrigatórios e tipos de arquivo
  - [ ] Implementar feedback visual de erro e loading
  - [ ] Garantir atualização em tempo real do PainelInformacoes após salvar

---

_Next step: Implementar validação, feedback visual e atualização em tempo real. Após isso, avançar para a Fase 4: Testing & Integration._

## 1. Analysis Phase
- **Identify all Supabase tables used by PainelInformacoes:**
  - `escolas_completa` (main school data)
  - `imagens_escola` (image metadata, linked by `escola_id`)
  - `documentos_escola` (document metadata, linked by `escola_id`)
- **List all editable fields:**
  - From `escolas_completa`:
    - `Escola`, `Município`, `Endereço`, `Terra Indigena (TI)`, `Escola Estadual ou Municipal`, `Parcerias com o município`, `Diretoria de Ensino`, `Ano de criação da escola`, `Povos indigenas`, `Linguas faladas`, `Modalidade de Ensino/turnos de funcionamento`, `Numero de alunos`, `espaco_escolar`, `cozinha_merenda`, `acesso_agua`, `coleta_lixo`, `acesso_internet`, `equipamentos`, `modo_acesso`, `gestao`, `outros_funcionarios`, `professores_indigenas`, `professores_nao_indigenas`, `professores_falam_lingua`, `formacao_professores`, `formacao_continuada`, `ppp_proprio`, `ppp_comunidade`, `disciplinas_bilingues`, `material_nao_indigena`, `material_indigena`, `praticas_pedagogicas`, `formas_avaliacao`, `projetos_andamento`, `parcerias_universidades`, `acoes_ongs`, `desejos_comunidade`, `usa_redes_sociais`, `links_redes_sociais`, `historia_da_escola`, `historia_do_prof`, `latitude`, `longitude`, `links`, `audio`, `video`, `link_para_documentos`, `link_para_videos`
  - From `imagens_escola`:
    - `url`, `descricao`, `escola_id`
  - From `documentos_escola`:
    - `url`, `titulo`, `tipo`, `escola_id`
- **Identify which fields involve uploading to buckets:**
  - Images: files uploaded to Supabase Storage, path: `imagens-das-escolas/{escola_id}/...`
  - Documents: files uploaded to Supabase Storage, path: `documentos-das-escolas/{escola_id}/...`
  - Audio/Video: (if supported) similar pattern, e.g., `audios-das-escolas/{escola_id}/...`

## 2. Component Design Phase
- **Structure:**
  - Dedicated page or modal/drawer (choose based on UX needs; recommend a full-page for complex forms, modal/drawer for quick edits)
  - Tabs or sections for: Dados da Escola, Imagens, Documentos, (opcional: Áudio/Vídeo)
- **State:**
  - Form state for all text fields (controlled inputs)
  - Arrays for images/documents to be uploaded (with preview and removal)
  - Loading and error states for async operations
- **Inputs:**
  - Text, textarea, select, checkbox for school data
  - File input for images/documents (multiple allowed)
  - Preview for selected files
- **Supabase Integration:**
  - Use `insert`/`upsert` for table data
  - Use `storage.upload` for file uploads
  - On successful upload, insert metadata (URL, description, etc.) into the respective table

## 3. Implementation Phase
- **Insertions & Validation:**
  - Validate all required fields before submission
  - On save:
    - Insert or update record in `escolas_completa`
    - For each image/document, upload file to bucket, then insert metadata row in `imagens_escola`/`documentos_escola`
    - Use `escola_id` as folder and foreign key
- **File Uploads:**
  - Use Supabase Storage API
  - Path convention: `imagens-das-escolas/{escola_id}/filename.ext`, `documentos-das-escolas/{escola_id}/filename.ext`
  - Store resulting public URL in the metadata table
- **Real-time Update:**
  - After save, trigger a refresh of `PainelInformacoes` (via context, prop, or event)
- **Error Handling:**
  - Show clear error messages for failed uploads or validation
  - Show loading indicators during async operations

## 4. Testing & Integration
- **Mock Data:**
  - Test with all field types, including edge cases (e.g., missing required fields, large files, unsupported formats)
- **Immediate Feedback:**
  - Ensure new/edited data appears instantly in `PainelInformacoes` after save
- **File Handling:**
  - Reject invalid file types/extensions
  - Handle Supabase/network errors gracefully
- **Integration:**
  - Test full flow: create, edit, delete (if supported) for all data types

## 5. Final Documentation
- **README.md:**
  - Add a section explaining how to use the new editing interface
  - List all required/optional fields and their types
  - Document file path conventions for uploads
  - Note any Supabase schema or policy requirements for editing

---

This phased plan ensures a maintainable, project-specific editing interface for all data and media managed by PainelInformacoes, tightly integrated with Supabase tables and storage.

## Estrutura da tabela `escolas_completa` (Supabase)

| Coluna                                      | Tipo     | Obrigatório | Observação |
|---------------------------------------------|----------|-------------|------------|
| id                                          | integer  | Sim         | Chave primária, auto-incremento |
| Escola                                      | text     | Não         | Nome da escola |
| Município                                   | text     | Não         | |
| Endereço                                    | text     | Não         | |
| Terra Indigena (TI)                         | text     | Não         | |
| Escola Estadual ou Municipal                | text     | Não         | |
| Parcerias com o município                   | text     | Não         | |
| Diretoria de Ensino                         | text     | Não         | |
| Povos indigenas                             | text     | Não         | |
| Linguas faladas                             | text     | Não         | |
| Ano de criação da escola                    | text     | Não         | |
| Modalidade de Ensino/turnos de funcionamento| text     | Não         | |
| Numero de alunos                            | text     | Não         | |
| Espaço escolar e estrutura                  | text     | Não         | |
| Cozinha/Merenda escolar/diferenciada        | text     | Não         | |
| Acesso à água                               | text     | Não         | |
| Tem coleta de lixo?                         | text     | Não         | |
| Acesso à internet                           | text     | Não         | |
| Equipamentos Tecnológicos                   | text     | Não         | |
| Modo de acesso à escola                     | text     | Não         | |
| Gestão/Nome                                 | text     | Não         | |
| Outros funcionários                         | text     | Não         | |
| Quantidade de professores indígenas         | text     | Não         | |
| Quantidade de professores não indígenas     | text     | Não         | |
| Professores falam a língua indígena?        | text     | Não         | |
| Formação dos professores                    | text     | Não         | |
| Formação continuada oferecida               | text     | Não         | |
| A escola possui PPP próprio?                | text     | Não         | |
| PPP elaborado com a comunidade?             | text     | Não         | |
| Disciplinas bilíngues?                      | text     | Não         | |
| Material pedagógico não indígena            | text     | Não         | |
| Material pedagógico indígena                | text     | Não         | |
| Práticas pedagógicas indígenas              | text     | Não         | |
| Formas de avaliação                         | text     | Não         | |
| Projetos em andamento                       | text     | Não         | |
| Parcerias com universidades?                | text     | Não         | |
| Ações com ONGs ou coletivos?                | text     | Não         | |
| Desejos da comunidade para a escola         | text     | Não         | |
| Escola utiliza redes sociais?               | text     | Não         | |
| Links das redes sociais                     | text     | Não         | |
| historia_da_escola                          | text     | Não         | |
| Latitude                                    | numeric  | Não         | |
| Longitude                                   | numeric  | Não         | |
| link_para_videos                            | text     | Não         | |
| historia_do_prof                            | text     | Não         | |

> Observação: Apenas o campo 'id' é obrigatório (not null). Todos os outros campos podem ser nulos. Para uso no frontend, trate todos os campos como string, exceto 'id', 'Latitude' e 'Longitude', que devem ser tratados como números.
