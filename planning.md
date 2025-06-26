# Planejamento de Atualizações do Site

## I. Identificação da Escola

- [ ] Confirmar a grafia correta dos nomes das escolas e padronizar para o nome completo (ex: "Escola Estadual Indígena...").
- [ ] Manter o campo "Município" separado na estrutura de dados e na exibição do endereço da escola pra evitar repetições.
- [x ] Mover o mapa/quadro de localização para que seja exibido junto ao campo de endereço.
- [x ] Alterar o título da aba/seção "Povos/Língua" para "Povos".
- [ x] No campo "Parceria com Município", especificar o tipo de parceria ou preencher com "Não".(alterei o formulario*)
- [x ] Mover a seção "Redes Sociais e Mídia" para dentro da seção de "Identificação".

## II. Modalidades de Ensino

- [ x] Alterar o título da aba/seção de "Ensino" para "Modalidades".
- [ ] Destacar a informação de "Turno" (colocar em negrito) e definir a melhor forma de exibição (ex: coluna própria).
- [x] Alterar o título do campo "Disciplinas bilíngues" para "Línguas faladas".
- [ ] Implementar nova seção ou tabela para listar as disciplinas específicas de cada escola.
- [ x] Apresentar apenas o número total de alunos, removendo a divisão por séries/ciclos.

## III. Infraestrutura e Recursos

- [x] Alterar o título para "Materiais Pedagógicos" e usar o texto descritivo: "Diferenciados e não diferenciados, produzidos dentro e fora da comunidade".
- [x] Converter o campo "Merenda Diferenciada" para uma área de texto para descrição detalhada.
- [ ] No campo "Acesso à Internet", especificar o tipo de acesso (ex: cabo, pen drive, Wi-Fi).

## IV. Corpo Docente e Gestão

- [ x] Alterar o título da seção "Gestão e professores" para "Gestores".
- [ x] Reorganizar a ordem de exibição para: Professores Indígenas, Outros Funcionários.
- [ ] Exibir o número de "Professores Falantes da Língua Indígena".
- [ ]x No campo "Formação dos Professores", incluir o nome completo e a formação de cada um.
- [x ] Padronizar a citação de professores: primeiro o nome indígena, depois o nome em português.
- [x] Converter o campo "Formação Continuada" para uma área de texto para descrever as visitas de supervisores.

## V. Conteúdo da Página da Escola

- [x] Alterar o título da seção para "História dos Professores" (plural).
- [ ] Definir e aplicar formatação para os nomes dos professores (ex: negrito abaixo do título).
- [ x] Adicionar legendas descritivas em todas as fotos.
- [ x] Adicionar titulo descritivo em todos os vídeos.
- [ ] Remover os arquivos PDF e integrar o conteúdo diretamente na página. (Removi mas ainda não incorporei os conteúdos do PDF na página)
- [ ] Extrair fotos dos PDFs e incorporá-las na galeria principal da página da escola.
- [ ] Criar seção "Alguns Materiais Didáticos Diferenciados".esse item não entendi bem?
- [ ] Criar seção "Jogo dos Animais". Esse tbm não entendi bem

## VI. Itens a Serem Removidos ou Reavaliados

- [ x] Avaliar a necessidade e/ou remover o campo "Tipo de escola". (*removi)
- [x ] Remover o item/seção "Práticas pedagógicas".(removi)
- [ x] Remover o item/seção "Avaliação".(removi)
- [x ] Remover o item "Cozinha" da ficha técnica.(removi)

## VII. Menu de Edições e Barra Lateral (Responsividade e UX)

### 1. Menu de Edições (EditEscolaPanel)
- [x] Tornar o painel de edição responsivo (mobile, tablet, desktop) considerande que  há tambem um menu vertical com os nomes das escolas que deve se ajustavel em desktop e no celular talvez nem precise aparecer.
- [x] Garantir que as abas fiquem acessíveis e utilizáveis em telas pequenas (scroll horizontal, ícones visíveis, labels colapsáveis).
- [x] Melhorar a navegação entre abas (feedback visual claro da aba ativa).
- [x] Garantir contraste e acessibilidade dos botões e campos.
- [x] Ajustar espaçamentos e tamanhos de fonte para mobile.
- [x] Garantir que o modal/painel não ultrapasse a viewport em nenhuma resolução.
- [x] Tornar o upload de imagens e vídeos acessível e fácil de usar em mobile.
- [ ] Garantir que mensagens de erro/sucesso sejam legíveis em todas as telas.
- [ ] Testar navegação por teclado e acessibilidade ARIA.
- [ ] Garantir que o botão de fechar e salvar estejam sempre visíveis e acessíveis.

### 2. Barra Lateral de Escolas (AdminPanel)
- [x] Tornar a barra lateral colapsável ou adaptável em telas pequenas.
- [x] Garantir que a lista de escolas seja rolável e utilizável em mobile.
- [x] Melhorar o campo de busca para uso em mobile (tamanho, foco, contraste).
- [x] Garantir que o painel de edição não sobreponha a barra lateral em telas médias/pequenas.
- [x] Ajustar largura mínima/máxima da barra lateral para diferentes breakpoints.
- [ ] Testar navegação por teclado e acessibilidade ARIA.
- [ ] Garantir contraste e legibilidade dos itens da lista.
- [ ] Adicionar feedback visual para escola selecionada.
- [ ] Garantir que o layout não quebre ao abrir/fechar o painel de edição em diferentes resoluções.