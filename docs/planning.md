# Padronização dos Cards do PainelInformações

## Objetivo
Garantir unidade visual e estrutural entre todos os cards do PainelInformações, especialmente o componente `Modalidades.js`, seguindo o padrão dos demais cards (ex: `Infraestrutura`, `GestaoProfessores`, `BasicInfo`).

---

## Diagnóstico Atual
- **Modalidades.js** utiliza `InfoSection` e `InfoItem`, mas não segue o padrão visual de grid/MiniCard adotado em outros cards como `Infraestrutura` e `GestaoProfessores`.
- Os demais cards utilizam layouts em grid, MiniCards e estilização consistente.
- O componente `InfoSection` oferece suporte a layouts flexíveis (grid, table, stats, default).
- O componente `BooleanValue` já está padronizado para valores booleanos.

---

## Padrão a ser seguido
- Usar `InfoSection` como wrapper principal, com título e ícone.
- Utilizar grid para exibir informações principais, com MiniCards para cada item.
- Adotar visual consistente: bordas arredondadas, fundo branco/translúcido, ícones à esquerda, tipografia padronizada.
- Para listas ou agrupamentos, usar grid responsivo (`grid-cols-1 sm:grid-cols-2` etc).
- Para booleanos, usar `BooleanValue`.

---

## Plano de Refatoração do Modalidades.js
1. **Reestruturar** o componente para usar grid e MiniCards, como em `Infraestrutura.js`.
2. **Separar** as seções "Modalidades" e "Materiais Pedagógicos" em grids distintos, cada um com seus MiniCards.
3. **Padronizar** o uso de ícones, tipografia e espaçamento.
4. **Remover** uso direto de `InfoItem` se não for necessário para o padrão visual.
5. **Testar** responsividade e integração no PainelInformações.
6. **Documentar** as decisões e etapas neste arquivo.

---

## Checklist de Unidade Visual
- [x] Título e ícone no InfoSection
- [x] Grid de MiniCards para informações principais
- [x] Uso de BooleanValue para campos booleanos
- [x] Consistência de cores, bordas e espaçamento
- [x] Responsividade

---

## Progresso
- [x] Diagnóstico e planejamento
- [ ] Refatoração do Modalidades.js
- [ ] Testes manuais
- [ ] Revisão final e atualização deste planning

---

## Observações
- O padrão adotado pode ser replicado em outros cards para garantir unidade visual em todo o dashboard.
- Caso surjam novos requisitos visuais, atualizar este planejamento. 