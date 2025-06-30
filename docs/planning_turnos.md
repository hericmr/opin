# Planejamento: Separação dos Turnos de Funcionamento das Modalidades de Ensino

## Objetivo
Separar as informações de turnos (ex: Diurno, Noturno, EAD) das modalidades de ensino no banco de dados e no frontend, garantindo clareza e melhor apresentação dos dados no PainelInformações.

---

## Diagnóstico Atual
- A coluna `modalidade_ensino` no Supabase contém tanto as modalidades quanto os turnos, misturando informações e dificultando a apresentação.
- No frontend, o card "Modalidade de Ensino" exibe um texto poluído, dificultando a leitura.

---

## Padrão Desejado
- Modalidades e turnos devem ser exibidos separadamente no dashboard.
- O banco de dados deve ter uma coluna exclusiva para os turnos de funcionamento.
- O frontend deve exibir um MiniCard específico para os turnos.

---

## Plano de Ação
1. **Banco de Dados (Supabase):**
   - [ ] Criar nova coluna `turnos` (ou `turnos_funcionamento`) na tabela de escolas.
   - [ ] Migrar os dados de turnos da coluna `modalidade_ensino` para a nova coluna, limpando a coluna de modalidade.
   - [ ] Atualizar a API/backend para retornar o novo campo.

2. **Frontend:**
   - [ ] Atualizar o componente `Modalidades.js` para exibir o novo campo de turnos em um MiniCard separado.
   - [ ] Garantir que "Modalidade de Ensino" mostre apenas as modalidades.
   - [ ] Testar a apresentação e responsividade.

3. **Documentação e Testes:**
   - [ ] Documentar as decisões e etapas neste arquivo.
   - [ ] Realizar testes manuais após cada etapa.

---

## Checklist
- [ ] Nova coluna criada no Supabase
- [ ] Dados migrados corretamente
- [ ] API/backend atualizado
- [ ] Frontend ajustado
- [ ] Testes manuais realizados
- [ ] Planejamento revisado e atualizado

---

## Observações
- O nome da coluna pode ser ajustado conforme padrão do projeto.
- Se houver outros campos misturados, considerar separar também.
- Atualizar este planejamento conforme o andamento das etapas. 