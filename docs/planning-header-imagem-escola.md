# Planning: Header com Imagem da Escola no Painel de Informações

## 📋 **Análise da Situação Atual**

O sistema já possui:
- ✅ Sistema de upload de imagens das escolas (`ImageUploadSection.js`)
- ✅ Armazenamento no Supabase Storage (`imagens-das-escolas` bucket)
- ✅ Painel de edição com aba de imagens (`ImagensEscolaTab.js`)
- ✅ Componente `PainelHeader` que pode ser modificado
- ✅ Estrutura de dados das escolas na tabela `escolas_completa`

## 🎯 **Objetivos**

1. **Adicionar campo para imagem do header** na tabela de escolas
2. **Criar interface de seleção** no painel de edição
3. **Modificar o header do painel** para exibir a imagem escolhida
4. **Implementar responsividade** para diferentes tamanhos de tela

## 📝 **Plano de Implementação**

### **Fase 1: Estrutura de Dados**
- [ ] **Adicionar campo `imagem_header`** na tabela `escolas_completa`
- [ ] **Atualizar hooks e serviços** para incluir o novo campo
- [ ] **Modificar formulários de edição** para salvar a URL da imagem

### **Fase 2: Interface de Seleção (Modificar Aba Existente)**
- [ ] **Modificar `ImageUploadSection.js`** para adicionar botão "Usar como Header"
- [ ] **Implementar seleção visual** das imagens existentes com indicador
- [ ] **Adicionar preview** da imagem escolhida como header
- [ ] **Incluir opção "Remover imagem do header"**

### **Fase 3: Componente de Header**
- [ ] **Criar `EscolaHeaderImage`** para exibir a imagem
- [ ] **Modificar `PainelHeader`** para incluir imagem **APENAS quando `imagem_header` existir**
- [ ] **Header padrão** permanece inalterado quando não há imagem definida

### **Fase 4: Estilos e Responsividade**
- [ ] **Design responsivo** para mobile/desktop
- [ ] **Posicionamento adequado** da imagem no header
- [ ] **Efeitos visuais** (overlay, gradiente, etc.)
- [ ] **Otimização de performance** (lazy loading)

### **Fase 5: Integração e Testes**
- [ ] **Integrar com sistema existente** de imagens
- [ ] **Testar em diferentes dispositivos**
- [ ] **Validar acessibilidade**
- [ ] **Testar performance**

## 🛠️ **Detalhes Técnicos**

### **Estrutura do Banco de Dados**
```sql
ALTER TABLE escolas_completa 
ADD COLUMN imagem_header TEXT;
```

### **Componente EscolaHeaderImage**
```jsx
const EscolaHeaderImage = ({ escolaId, imagemUrl, titulo }) => {
  // Lógica para exibir imagem com fallback
  // Estilos responsivos
  // Lazy loading
};
```

### **Modificação do PainelHeader**
```jsx
const PainelHeader = ({ titulo, imagemHeader, ... }) => {
  return (
    <header className="...">
      {imagemHeader ? (
        <EscolaHeaderImage imagemUrl={imagemHeader} titulo={titulo} />
      ) : (
        // Header padrão - sem modificações
        <h2>{titulo}</h2>
      )}
      {/* Botões existentes */}
    </header>
  );
};
```

## 🎨 **Design Proposto**

1. **Com imagem**: Header personalizado com imagem de fundo e overlay de texto
2. **Sem imagem**: Header padrão atual (sem modificações)
3. **Responsivo**: Design adaptado para mobile/desktop
4. **Acessibilidade**: Alt text e contraste adequado

## ⚡ **Benefícios**

- **Visual mais atrativo** para cada escola
- **Identidade visual única** por escola
- **Fácil gerenciamento** através do painel admin
- **Compatibilidade** com sistema existente
- **Performance otimizada**

## 🔄 **Fluxo de Uso**

1. **Admin acessa** aba "Imagens" de uma escola
2. **Seleciona imagem** para usar como header
3. **Salva alterações** no banco de dados
4. **Usuário visualiza** header personalizado no painel
5. **Pode alterar** a qualquer momento

## 📁 **Arquivos que Serão Modificados**

### **Novos Arquivos**
- `src/components/PainelInformacoes/components/EscolaHeaderImage.js`

### **Arquivos Modificados**
- `src/components/PainelHeader.js`
- `src/components/EditEscolaPanel/ImageUploadSection.js` (adicionar botão "Usar como Header")
- `src/hooks/useEscolasData.js`
- `src/components/AdminPanel/hooks/useEscolas.js`

### **Banco de Dados**
- Tabela `escolas_completa` - adicionar campo `imagem_header`

---

**Data de Criação**: $(date)
**Status**: Planejamento inicial
**Próximos Passos**: Implementar Fase 1 - Estrutura de Dados
