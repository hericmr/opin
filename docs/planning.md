# Planning.md - Resolver Problema de Update do Formulário de História dos Professores

## Problema Atual
- ✅ Formulário carrega dados corretamente do Supabase
- ❌ **NÃO SALVA** após edição - volta para tela inicial sem atualizar
- ❌ Logs somem após submit (painel desmonta)
- ❌ Campo `nome_professor` continua como "Desconhecido"

## Checklist de Diagnóstico e Correção

### 🔍 1. VERIFICAR SE O SUBMIT ESTÁ SENDO CHAMADO
- [x] Adicionar log no início do `handleSubmit`:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('🔍 SUBMIT CHAMADO - ID:', editingHistoria?.id);
  // ... resto do código
};
```
- [x] Clicar no botão "Atualizar" e verificar se o log aparece
- [x] Se **NÃO aparecer**: problema no botão/form
- [] Se **aparecer**: problema no update/Supabase

### 🔍 2. VERIFICAR SE O BOTÃO ESTÁ DENTRO DO FORM CORRETO
- [x] Inspecionar HTML no navegador
- [x] Confirmar que o botão `<button type="submit">` está dentro do `<form onSubmit={handleSubmit}>`
- [x] Se **NÃO estiver**: mover botão para dentro do form
- [x] Se **estiver**: problema no handler

### 🔍 3. VERIFICAR SE O FORM NÃO ESTÁ ANINHADO
- [x] Confirmar que o form de história **NÃO** está dentro do form do painel
- [x] Verificar se a aba "História dos Professores" renderiza fora do `<form>` global
- [x] Se **estiver aninhado**: separar os forms

### 🔍 3.5 INVESTIGAR FORM QUE ESTÁ CAUSANDO RECARREGAMENTO
- [x] Verificar se há outro form sendo submetido quando clica em "Atualizar"
- [x] Inspecionar HTML para encontrar forms ocultos ou duplicados
- [x] Verificar se há form global do AdminPanel interferindo
- [x] **PROBLEMA ENCONTRADO**: HistoriaProfessorManager estava dentro do form global do AdminPanel
- [x] **CORREÇÃO APLICADA**: Movido HistoriaProfessorManager para fora do form global

### 🔍 4. VERIFICAR SE O UPDATE ATINGE O SUPABASE
- [ ] Adicionar log antes do update:
```javascript
console.log('📤 ENVIANDO PARA SUPABASE:', { id: editingHistoria.id, data: formData });
```
- [ ] Adicionar log após o update:
```javascript
const { data, error } = await updateHistoriaProfessor(editingHistoria.id, formData);
console.log('📥 RESPOSTA SUPABASE:', { data, error });
```
- [ ] Se **NÃO aparecer "ENVIANDO"**: problema no handler
- [ ] Se **aparecer "ENVIANDO" mas não "RESPOSTA"**: problema de await
- [ ] Se **aparecer "RESPOSTA" com erro**: problema no Supabase

### 🔍 5. VERIFICAR PERMISSÕES NO SUPABASE
- [ ] Executar no SQL Editor do Supabase:
```sql
UPDATE historias_professor 
SET nome_professor = 'Teste SQL' 
WHERE id = 2;
```
- [ ] Se **der erro de permissão**: executar:
```sql
GRANT ALL ON TABLE historias_professor TO authenticated;
GRANT ALL ON TABLE historias_professor TO anon;
```
- [ ] Se **funcionar**: problema no frontend

### 🔍 6. VERIFICAR SE O PAINEL FECHA PREMATURAMENTE
- [ ] Adicionar log após o update:
```javascript
console.log('✅ UPDATE CONCLUÍDO - FECHANDO PAINEL?');
```
- [ ] Se **não aparecer**: painel fechou antes do update
- [ ] Se **aparecer**: problema na atualização do estado

### 🔍 7. VERIFICAR SE O ESTADO É ATUALIZADO APÓS O UPDATE
- [ ] Adicionar log após carregar histórias:
```javascript
console.log('🔄 HISTÓRIAS RECARREGADAS:', historias);
```
- [ ] Se **não aparecer**: `carregarHistorias()` não está sendo chamado
- [ ] Se **aparecer mas dados antigos**: problema no refetch

## Comandos de Teste Rápido

### Teste 1: Verificar se o update funciona via console
```javascript
// Cole no console do navegador
const testUpdate = async () => {
  const { data, error } = await supabase
    .from('historias_professor')
    .update({ nome_professor: 'Teste Console' })
    .eq('id', 2)
    .select();
  
  console.log('Resultado:', { data, error });
};
testUpdate();
```

### Teste 2: Verificar autenticação
```javascript
// Cole no console do navegador
const { data: { user } } = await supabase.auth.getUser();
console.log('Usuário autenticado:', !!user);
```

## Ações Imediatas

### ✅ JÁ FEITO
- [x] Separar form de história do form global do painel
- [x] Garantir que `event.preventDefault()` está sendo chamado
- [x] Verificar que não há forms aninhados

### 🔄 PRÓXIMOS PASSOS
1. **Adicionar logs** no `handleSubmit` do `HistoriaProfessorManager.js`
2. **Testar submit** e verificar qual log aparece
3. **Executar comandos SQL** para liberar permissões
4. **Testar update direto** via console
5. **Corrigir problema específico** identificado

## Resultado Esperado
- ✅ Log "SUBMIT CHAMADO" aparece ao clicar "Atualizar"
- ✅ Log "ENVIANDO PARA SUPABASE" aparece
- ✅ Log "RESPOSTA SUPABASE" aparece sem erro
- ✅ Campo `nome_professor` é atualizado no banco
- ✅ Painel não fecha inesperadamente

## Próximo Passo
**Execute o checklist na ordem e me informe qual etapa falha.** Assim identificamos exatamente onde está o problema e aplicamos a correção específica. 