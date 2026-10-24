import { useEffect, useState } from 'react';
import { UI_CONFIG } from '../constants/adminConstants';

/**
 * Altura da navbar fixa do site, para o painel começar logo abaixo dela.
 * A navbar muda de altura por breakpoint, então é medida em vez de fixada.
 */
export const useNavbarHeight = () => {
  const [height, setHeight] = useState(UI_CONFIG.NAVBAR_FALLBACK_HEIGHT);

  useEffect(() => {
    const header = document.querySelector('header');
    if (!header) return undefined;

    const update = () => setHeight(header.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return height;
};
