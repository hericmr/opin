/**
 * Componente detector de meta tags automático
 * Detecta qual escola está sendo visualizada via URL e aplica meta tags específicas
 */

import React from 'react';
import MetaTagsManager from './MetaTagsManager';
import { useEscolaAtual } from '../../hooks/useEscolaAtual';

const MetaTagsDetector = ({ dataPoints }) => {
  const { escolaAtual, debugInfo } = useEscolaAtual(dataPoints);

  // Log para debug (apenas em desenvolvimento)
  React.useEffect(() => {
    const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;
    if (isDevelopment && escolaAtual) {
      logger.debug('🎯 MetaTagsDetector: Escola detectada:', debugInfo);
    }
  }, [escolaAtual, debugInfo]);

  // Renderizar meta tags apenas se uma escola foi detectada
  if (!escolaAtual) {
    return null;
  }

  return <MetaTagsManager escola={escolaAtual} />;
};

export default MetaTagsDetector;