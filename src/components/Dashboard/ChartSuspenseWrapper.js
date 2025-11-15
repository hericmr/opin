import React, { Suspense } from 'react';

/**
 * Wrapper para componentes de gráficos com Suspense
 * Exibe um fallback enquanto os gráficos são carregados
 */
const ChartSuspenseWrapper = ({ children }) => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando gráfico...</p>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
};

export default ChartSuspenseWrapper;

