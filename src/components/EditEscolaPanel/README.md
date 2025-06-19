# EditEscolaPanel - Componentes de Upload de Imagens

Este diretório contém os componentes para edição de escolas e upload de imagens no sistema de escolas indígenas.

## Componentes

### EditEscolaPanel
Componente principal que gerencia a edição de escolas com interface em abas.

**Props:**
- `escola` (Object): Dados da escola a ser editada
- `onClose` (Function): Callback para fechar o painel
- `onSave` (Function): Callback para salvar as alterações

**Abas disponíveis:**
- **Dados Básicos**: Informações principais da escola
- **Imagens da Escola**: Upload e gerenciamento de imagens da escola (máx. 10)
- **Imagens dos Professores**: Upload e gerenciamento de imagens dos professores (máx. 5)
- **Localização**: Coordenadas e endereço da escola
- **Gestão**: Informações sobre gestão e funcionários
- **Configurações**: Configurações avançadas da escola

### ImageUploadSection
Componente específico para upload de imagens das escolas.

**Props:**
- `escolaId` (Number|String): ID da escola
- `onImagesUpdate` (Function): Callback quando imagens são atualizadas

**Funcionalidades:**
- Drag & drop de imagens
- Preview de arquivos selecionados
- Validação de tipos (JPG, PNG, WEBP, GIF)
- Limite de 10 imagens por escola
- Tamanho máximo de 5MB por arquivo
- Edição de descrições
- Exclusão de imagens

### ProfessorImageUploadSection
Componente específico para upload de imagens dos professores.

**Props:**
- `escolaId` (Number|String): ID da escola
- `onImagesUpdate` (Function): Callback quando imagens são atualizadas

**Funcionalidades:**
- Drag & drop de imagens
- Preview de arquivos selecionados
- Validação de tipos (JPG, PNG, WEBP, GIF)
- Limite de 5 imagens por escola
- Tamanho máximo de 5MB por arquivo
- Edição de descrições
- Exclusão de imagens
- Tema verde para diferenciação

## Serviços

### escolaImageService.js
Serviço que gerencia todas as operações de imagens:

**Funções principais:**
- `uploadEscolaImage(file, escolaId, descricao)`: Upload de imagem da escola
- `uploadProfessorImage(file, escolaId, descricao)`: Upload de imagem do professor
- `getEscolaImages(escolaId, bucketName)`: Buscar imagens da escola
- `deleteImage(imageId, filePath, bucketName)`: Deletar imagem
- `updateImageDescription(imageId, descricao)`: Atualizar descrição
- `checkImageLimit(escolaId, bucketName)`: Verificar limite de imagens

## Buckets do Supabase

- **imagens-das-escolas**: Para imagens das escolas
- **imagens-professores**: Para imagens dos professores

## Estrutura de Pastas

```
imagens-das-escolas/
├── {escola_id}/
│   ├── {escola_id}_{timestamp}_{random}.jpg
│   ├── {escola_id}_{timestamp}_{random}.png
│   └── ...

imagens-professores/
├── {escola_id}/
│   ├── {escola_id}_{timestamp}_{random}.jpg
│   ├── {escola_id}_{timestamp}_{random}.png
│   └── ...
```

## Tabela de Metadados

A tabela `imagens_escola` armazena os metadados de todas as imagens:

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

## Uso

```jsx
import { EditEscolaPanel } from './EditEscolaPanel';

function App() {
  const [escola, setEscola] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSave = async (updatedEscola) => {
    // Salvar no Supabase
    await supabase
      .from('escolas_completa')
      .update(updatedEscola)
      .eq('id', updatedEscola.id);
    
    setShowEditModal(false);
  };

  return (
    <div>
      {showEditModal && escola && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <EditEscolaPanel
            escola={escola}
            onClose={() => setShowEditModal(false)}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
}
```

## Validações

### Tipos de Arquivo Permitidos
- JPG/JPEG
- PNG
- WEBP
- GIF

### Limites
- **Imagens das Escolas**: Máximo 10 imagens por escola
- **Imagens dos Professores**: Máximo 5 imagens por escola
- **Tamanho**: Máximo 5MB por arquivo
- **Dimensões**: Mínimo 200x200px (recomendado)

## Tratamento de Erros

O sistema inclui tratamento completo de erros:
- Validação de arquivos antes do upload
- Feedback visual durante o upload
- Mensagens de erro específicas
- Rollback em caso de falha na inserção de metadados

## Integração com PainelInformacoes

Após upload bem-sucedido, o sistema:
1. Atualiza a tabela `imagens_escola`
2. Dispara callback `onImagesUpdate`
3. Atualiza automaticamente os componentes `ImagensdasEscolas` e `ImagemHistoriadoProfessor`
4. Refresca o cache de imagens 