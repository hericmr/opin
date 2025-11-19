/**
 * Hook para throttle de valores
 * 
 * Útil para limitar a frequência de atualizações (ex: eventos de scroll, resize).
 * Diferente de debounce, throttle garante execução periódica.
 * 
 * @param {any} value - Valor a ser throttled
 * @param {number} delay - Delay em milissegundos (padrão: 300ms)
 * @returns {any} Valor throttled
 * 
 * @example
 * const [scrollPosition, setScrollPosition] = useState(0);
 * const throttledScroll = useThrottle(scrollPosition, 100);
 * 
 * useEffect(() => {
 *   // Esta função será chamada no máximo a cada 100ms
 *   updateScrollIndicator(throttledScroll);
 * }, [throttledScroll]);
 */
import { useState, useEffect, useRef } from 'react';

export const useThrottle = (value, delay = 300) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRan = useRef(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= delay) {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }
    }, delay - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
};

export default useThrottle;
































