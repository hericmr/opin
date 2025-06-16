# Melhoria na Interação Touch dos Marcadores

## Contexto e Problema Atual

### Situação Atual
- Em desktop: hover mostra tooltip com nome do local, click abre informações completas
- Em mobile: não há preview do nome do local antes de abrir informações
- Tooltips são implementados via `bindTooltip` mas só funcionam com hover
- Experiência mobile é menos informativa que desktop

### Impacto
- Usuários mobile precisam abrir informações completas para ver o nome do local
- Maior número de interações necessárias em mobile
- Experiência inconsistente entre plataformas
- Menor acessibilidade em dispositivos touch

## Estratégia de Implementação

### 1. Controle de Estado
```javascript
const lastTouchedMarker = useRef(null);
const touchTimeout = useRef(null);
```

### 2. Lógica de Interação
- Desktop (L.Browser.mobile === false):
  - Manter comportamento atual
  - Hover: mostra tooltip
  - Click: executa onClick(ponto)

- Mobile (L.Browser.mobile === true):
  - Primeiro toque:
    - Armazena referência do marcador
    - Exibe tooltip via marker.openTooltip()
    - Inicia timeout de 2s para fechar tooltip
  - Segundo toque (mesmo marcador):
    - Limpa timeout
    - Fecha tooltip
    - Executa onClick(ponto)
  - Toque em marcador diferente:
    - Limpa timeout anterior
    - Fecha tooltip anterior
    - Inicia nova sequência

### 3. Implementação Técnica
1. Adicionar refs para controle de estado
2. Implementar função de gerenciamento de toque
3. Modificar bindTooltip para suportar ambos os modos
4. Adicionar limpeza de timeouts no unmount
5. Garantir compatibilidade com clusters

## Testes Previstos

### Testes Desktop
1. Verificar comportamento hover
   - Tooltip aparece ao passar mouse
   - Tooltip desaparece ao remover mouse
   - Click abre informações completas

2. Verificar interação com clusters
   - Hover em cluster mostra cobertura
   - Click expande cluster
   - Comportamento de marcadores individuais mantido

### Testes Mobile
1. Verificar sequência de toques
   - Primeiro toque mostra tooltip
   - Tooltip fecha após 2s
   - Segundo toque abre informações
   - Toque em marcador diferente reinicia sequência

2. Verificar interação com clusters
   - Toque em cluster expande normalmente
   - Comportamento de marcadores individuais após expansão
   - Tooltips não interferem na expansão

3. Testar casos de borda
   - Toque rápido em marcadores diferentes
   - Toque durante animação de cluster
   - Toque durante timeout de tooltip

## Critérios de Aceite

### Funcionais
- [ ] Tooltip aparece no primeiro toque em mobile
- [ ] Tooltip fecha automaticamente após 2s
- [ ] Segundo toque abre informações completas
- [ ] Comportamento desktop mantido
- [ ] Clusters funcionam normalmente

### Técnicos
- [ ] Código limpo e documentado
- [ ] Sem memory leaks (timeouts limpos)
- [ ] Performance otimizada
- [ ] Sem conflitos com outras interações

### UX
- [ ] Feedback visual claro
- [ ] Transições suaves
- [ ] Comportamento intuitivo
- [ ] Consistência entre plataformas

### Acessibilidade
- [ ] Área de toque adequada
- [ ] Feedback tátil (se disponível)
- [ ] Compatível com leitores de tela
- [ ] Navegação por teclado mantida

## Próximos Passos
1. Implementar mudanças no componente Marcadores
2. Testar em diferentes dispositivos
3. Validar comportamento com clusters
4. Documentar novas interações
5. Coletar feedback de usuários 