// Função utilitária para determinar o título baseado na quantidade de povos indígenas
// Conta o número de vírgulas para determinar se há um ou múltiplos povos
// Retorna singular quando há apenas um povo, plural quando há múltiplos povos
export const getPovoIndigenaLabel = (povosIndigenas) => {
  if (!povosIndigenas || typeof povosIndigenas !== 'string') {
    return 'Povo Indígena';
  }
  
  // Conta o número de vírgulas para determinar a quantidade de povos
  const commaCount = (povosIndigenas.match(/,/g) || []).length;
  
  // Se não há vírgulas, há apenas um povo (singular)
  // Se há vírgulas, há múltiplos povos (plural)
  return commaCount === 0 ? 'Povo Indígena' : 'Povos Indígenas';
};

