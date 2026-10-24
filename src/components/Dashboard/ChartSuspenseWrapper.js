import React, { Suspense } from 'react';
import GlobalSpinner from '../GlobalSpinner';

/**
 * Wrapper para componentes de gráficos com Suspense
 * Exibe um fallback enquanto os gráficos são carregados
 */
const ChartSuspenseWrapper = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <GlobalSpinner message="Carregando gráfico..." />
      </div>
    }>
      {children}
    </Suspense>
  );
};

export default ChartSuspenseWrapper;

