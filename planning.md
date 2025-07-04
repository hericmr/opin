# Planejamento: Inserção de Nova Escola no Painel de Edição

## Objetivo
Permitir que o painel de edição crie uma nova linha na tabela `escolas_completa` ao inserir uma nova escola, e não apenas edite escolas existentes.

## Checklist de Etapas

- [x] 1. Detectar modo de criação vs. edição no painel de edição
- [x] 2. Adaptar o botão/fluxo para "Nova Escola" no AdminPanel (ou onde for aberto o painel)
- [x] 3. Implementar lógica de `insert` no Supabase quando não houver `id` na escola
- [x] 4. Garantir que todos os campos obrigatórios sejam enviados no insert
- [ ] 5. Atualizar a lista local de escolas após inserção
- [ ] 6. Exibir feedback de sucesso/erro ao usuário
- [ ] 7. Testar fluxo completo de criação de nova escola

## Observações
- O fluxo de edição existente deve continuar funcionando normalmente para escolas já existentes.
- O fluxo de criação deve ser claro para o usuário (ex: título "Nova Escola").
- O painel deve ser reutilizável para ambos os casos (edição e criação). 