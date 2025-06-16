## Refatoração de Componentes - História da Aldeia

### Objetivo
Separar a seção "História da Aldeia" do componente RedesSociais para melhorar a organização semântica e visual do conteúdo.

### Mudanças Implementadas

1. **Novo Componente: HistoriaAldeia**
   - Criado em: `src/components/PainelInformacoes/components/EscolaInfo/HistoriaAldeia.js`
   - Características:
     - Componente memoizado para otimização de performance
     - Exibição condicional baseada na presença de `escola.historia_aldeia`
     - Estilização visual diferenciada:
       - Fundo suave em tom âmbar (bg-amber-50/50)
       - Borda sutil (border-amber-200)
       - Texto maior e espaçamento otimizado para leitura
       - Ícone BookOpen para representação visual
     - Utiliza InfoSection como base, mas com customizações visuais
     - Classes Tailwind para tipografia e espaçamento

2. **Refatoração do RedesSociais**
   - Removida a seção "História da Aldeia"
   - Componente agora focado exclusivamente em informações de redes sociais
   - Mantida a estrutura existente para links e status de uso

### Benefícios
- Melhor organização semântica do conteúdo
- Destaque visual apropriado para a história da aldeia
- Componentes mais coesos e com responsabilidades únicas
- Melhor experiência de leitura para conteúdo narrativo

### Próximos Passos
- Importar e integrar o componente HistoriaAldeia na página principal da escola
- Considerar adicionar animações suaves na exibição do componente
- Avaliar necessidade de formatação adicional para o texto da história 