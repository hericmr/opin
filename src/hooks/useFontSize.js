import { useState, useEffect } from 'react';

export const useFontSize = () => {
  const [fontSize, setFontSize] = useState(1);

  // Aplicar o tamanho da fonte ao documento
  useEffect(() => {
    const rootElement = document.documentElement;
    console.log('useFontSize: Applying font size multiplier:', fontSize);
    
    rootElement.style.setProperty('--font-size-multiplier', fontSize);
    
    // Adicionar classe CSS para facilitar o controle
    rootElement.classList.toggle('font-size-adjusted', fontSize !== 1);
    
    // Aplicar diretamente ao body para debug
    document.body.style.fontSize = `${fontSize}em`;
    
    return () => {
      rootElement.style.removeProperty('--font-size-multiplier');
      rootElement.classList.remove('font-size-adjusted');
      document.body.style.fontSize = '';
    };
  }, [fontSize]);

  const changeFontSize = (newSize) => {
    console.log('useFontSize: Setting font size to:', newSize);
    setFontSize(newSize);
  };

  return {
    fontSize,
    changeFontSize,
  };
};
