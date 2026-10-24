import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'opin:textScale';
const MIN = 0.9;
const MAX = 1.3;
const clamp = (v) => Math.min(MAX, Math.max(MIN, v));

const lerSalvo = () => {
  try {
    return clamp(parseFloat(localStorage.getItem(STORAGE_KEY)) || 1);
  } catch {
    return 1;
  }
};

/**
 * Escala global do texto (font-size do <html>), lembrada no localStorage.
 * Enquanto o componente está montado a escala vale para a página inteira;
 * ao desmontar, volta ao tamanho padrão.
 * @returns {[number, Function]} escala atual e função que avança para o próximo tamanho
 */
export const useTextScale = () => {
  const [textScale, setTextScale] = useState(lerSalvo);

  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * textScale}px`;
    try {
      localStorage.setItem(STORAGE_KEY, String(textScale));
    } catch { /* armazenamento indisponível: só não lembra a escolha */ }
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [textScale]);

  // 100% -> 115% -> 130% -> 100%
  const cycleTextScale = useCallback(() => {
    setTextScale((v) => (v >= MAX ? 1.0 : clamp(Math.round((v + 0.15) * 100) / 100)));
  }, []);

  return [textScale, cycleTextScale];
};
