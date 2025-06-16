# Migração da Estrutura de Documentos

## Contexto da Mudança
A estrutura de armazenamento de documentos foi modificada para suportar múltiplos documentos por escola, substituindo a coluna única `link_para_documentos` por uma tabela relacional `documentos_escola`.

## Alterações no Banco de Dados

### Estrutura Anterior
```sql
-- Tabela escolas_completa
CREATE TABLE escolas_completa (
  id UUID PRIMARY KEY,
  -- ... outros campos ...
  link_para_documentos TEXT,
  -- ... outros campos ...
);
```

### Nova Estrutura
```sql
-- Tabela documentos_escola
CREATE TABLE documentos_escola (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escola_id UUID REFERENCES escolas_completa(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  link_pdf TEXT NOT NULL,
  autoria TEXT,
  tipo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_escola
    FOREIGN KEY (escola_id)
    REFERENCES escolas_completa(id)
    ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_documentos_escola_escola_id ON documentos_escola(escola_id);
CREATE INDEX idx_documentos_escola_tipo ON documentos_escola(tipo);
```

### Políticas de Segurança (RLS)
```sql
-- Habilitar RLS
ALTER TABLE documentos_escola ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública
CREATE POLICY "Permitir leitura pública de documentos"
  ON documentos_escola
  FOR SELECT
  USING (true);

-- Política para inserção (apenas autenticados)
CREATE POLICY "Permitir inserção de documentos por usuários autenticados"
  ON documentos_escola
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Política para atualização (apenas autenticados)
CREATE POLICY "Permitir atualização de documentos por usuários autenticados"
  ON documentos_escola
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política para deleção (apenas autenticados)
CREATE POLICY "Permitir deleção de documentos por usuários autenticados"
  ON documentos_escola
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

## Alterações no Frontend

### 1. Consulta ao Banco de Dados
```javascript
// Exemplo de consulta incluindo documentos
const { data, error } = await supabase
  .from('escolas_completa')
  .select(`
    *,
    documentos_escola (
      id,
      titulo,
      link_pdf,
      autoria,
      tipo,
      created_at
    )
  `)
  .eq('id', escolaId)
  .single();
```

### 2. Componentes a Modificar

#### PainelInformacoes/index.js
- Remover referência direta a `link_para_documentos`
- Implementar nova estrutura de renderização de documentos
- Adicionar suporte para múltiplos documentos

#### Novo Componente: DocumentosList
```jsx
const DocumentosList = memo(({ documentos }) => {
  if (!documentos?.length) return null;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold text-green-800 mb-4">
        Produções e materiais da escola:
      </h3>
      <div className="grid gap-6">
        {documentos.map((doc) => (
          <DocumentoCard key={doc.id} documento={doc} />
        ))}
      </div>
    </div>
  );
});
```

#### Novo Componente: DocumentoCard
```jsx
const DocumentoCard = memo(({ documento }) => {
  const {
    titulo,
    link_pdf,
    autoria,
    tipo
  } = documento;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-green-300 p-6">
      <h4 className="text-lg font-semibold text-green-900 mb-2">{titulo}</h4>
      {autoria && (
        <p className="text-sm text-gray-600 mb-2">
          Autoria: {autoria}
        </p>
      )}
      {tipo && (
        <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full mb-4">
          {tipo}
        </span>
      )}
      <div className="flex justify-end">
        <a
          href={link_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Ver documento
        </a>
      </div>
    </div>
  );
});
```

## Plano de Implementação

### 1. Preparação
- [ ] Criar backup dos dados existentes
- [ ] Migrar documentos existentes para nova estrutura
- [ ] Validar políticas de segurança
- [ ] Testar consultas no ambiente de desenvolvimento

### 2. Desenvolvimento Frontend
- [ ] Criar novos componentes (DocumentosList, DocumentoCard)
- [ ] Atualizar PainelInformacoes
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states

### 3. Testes
- [ ] Testar consultas com diferentes cenários
- [ ] Validar permissões de acesso
- [ ] Verificar responsividade
- [ ] Testar fallbacks e estados de erro

### 4. Deploy
- [ ] Atualizar banco de dados em produção
- [ ] Migrar dados existentes
- [ ] Deploy do frontend
- [ ] Monitorar logs e erros

## Considerações Técnicas

### Performance
- Índices otimizados para consultas frequentes
- Lazy loading de documentos
- Paginação se necessário
- Cache de consultas frequentes

### Segurança
- RLS ativado para controle granular
- Validação de URLs de documentos
- Sanitização de inputs
- Proteção contra XSS

### UX
- Feedback visual durante carregamento
- Mensagens de erro amigáveis
- Fallbacks para documentos indisponíveis
- Animações suaves

## Próximos Passos

1. Implementar migração dos dados
2. Desenvolver novos componentes
3. Atualizar consultas existentes
4. Testar em ambiente de desenvolvimento
5. Planejar deploy em produção

## Monitoramento

### Métricas a Acompanhar
- Tempo de carregamento dos documentos
- Taxa de erros nas consultas
- Uso de cache
- Performance geral

### Logs
- Erros de consulta
- Falhas de autenticação
- Acessos a documentos
- Tentativas de modificação não autorizadas 