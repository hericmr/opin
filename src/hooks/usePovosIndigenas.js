import { useState, useEffect, useMemo } from 'react';
import { useEscolasData } from './useEscolasData';

export const usePovosIndigenas = () => {
  const { dataPoints, loading, error } = useEscolasData();
  const [povosUnicos, setPovosUnicos] = useState([]);
  const [povosComEstatisticas, setPovosComEstatisticas] = useState({});

  useEffect(() => {
    if (!dataPoints) return;

    // Extrair povos únicos
    const povosSet = new Set();
    const estatisticas = {};

    dataPoints.forEach(escola => {
      if (escola.povos_indigenas) {
        // Separar múltiplos povos (ex: "Tupi Guarani e Pataxó")
        const povos = escola.povos_indigenas.split(/[, e]+/).map(p => p.trim());
        
        povos.forEach(povo => {
          povosSet.add(povo);
          
          // Contar estatísticas
          if (!estatisticas[povo]) {
            estatisticas[povo] = {
              escolas: [],
              municipios: new Set(),
              professores: 0
            };
          }
          
          estatisticas[povo].escolas.push(escola.titulo);
          estatisticas[povo].municipios.add(escola.municipio);
          estatisticas[povo].professores += parseInt(escola.professores_indigenas) || 0;
        });
      }
    });

    // Converter para array e adicionar estatísticas
    const povosArray = Array.from(povosSet).sort();
    const povosCompleto = povosArray.map(povo => ({
      id: povo.toLowerCase().replace(/\s+/g, '-'),
      label: povo,
      escolas: estatisticas[povo]?.escolas || [],
      municipios: Array.from(estatisticas[povo]?.municipios || []),
      professores: estatisticas[povo]?.professores || 0,
      cor: getCorPovo(povo),
      icone: getIconePovo(povo)
    }));

    setPovosUnicos(povosCompleto);
    setPovosComEstatisticas(estatisticas);
  }, [dataPoints]);

  return {
    povos: povosUnicos,
    estatisticas: povosComEstatisticas,
    loading,
    error
  };
};

// Funções auxiliares para cores e ícones
const getCorPovo = (povo) => {
  const cores = {
    'Guarani Mbya': 'green',
    'Tupi Guarani': 'blue',
    'Terena': 'amber',
    'Kaingang': 'red',
    'Ava Guarani': 'purple',
    'Guarani Nhandeva': 'indigo',
    'Pataxó': 'emerald',
    'Kroaia': 'orange',
    'Kaiowa': 'teal'
  };
  return cores[povo] || 'gray';
};

const getIconePovo = (povo) => {
  const icones = {
    'Guarani Mbya': 'lindi',
    'Tupi Guarani': 'lindi',
    'Ava Guarani': 'lindi',
    'Guarani Nhandeva': 'lindi',
    'Terena': 'passaro',
    'Kaingang': 'passaro',
    'Pataxó': 'passaro',
    'Kroaia': 'passaro',
    'Kaiowa': 'passaro'
  };
  return icones[povo] || 'passaro';
};
