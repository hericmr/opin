import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { getEscolasListagem } from '../services/escolasService';
import { useRefresh } from './RefreshContext';

const EscolasContext = createContext();

// Listagem de escolas compartilhada: buscada uma vez (e de novo a cada refresh),
// em vez de uma vez por componente que precisa dela
export const EscolasProvider = ({ children }) => {
  const [dataPoints, setDataPoints] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { refreshKey } = useRefresh();
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    getEscolasListagem()
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setDataPoints(data);
        setError(null);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        setError(err.message || 'Erro ao carregar dados');
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  }, [refreshKey]);

  return (
    <EscolasContext.Provider value={{ dataPoints, loading, error }}>
      {children}
    </EscolasContext.Provider>
  );
};

export const useEscolasData = () => {
  const context = useContext(EscolasContext);
  if (!context) {
    throw new Error('useEscolasData deve ser usado dentro de um EscolasProvider');
  }
  return context;
};
