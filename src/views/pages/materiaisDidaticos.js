import React, { useMemo } from 'react';
import { useEscolasData } from '../../hooks/useEscolasData';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';

const MateriaisDidáticos = () => {
  const { dataPoints } = useEscolasData();

  // Breadcrumbs de Navegação - memoizado para evitar recriação
  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Materiais Didáticos', path: '/conteudo', active: true }
  ], []);

  return (
    <div className="min-h-screen dashboard-scroll relative">
      {/* Cabeçalho com design indígena - Hero image começa do topo */}
      <PageHeader
        title="Materiais Didáticos"
        showNavbar={true}
        dataPoints={dataPoints || []}
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>
      
      {/* Conteúdo principal com espaçamento para o hero - será ajustado dinamicamente */}
      <div className="relative z-10 hero-content-spacer" style={{ marginTop: '300px' }}>
        {/* Descrição da página - Abaixo do hero, estilo Native Land Digital */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="prose prose-lg sm:prose-xl max-w-none" style={{
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#374151',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
            <p className="mb-6 text-center" style={{
              fontSize: '1.5rem',
              lineHeight: '1.75',
              color: '#374151',
              letterSpacing: '-0.01em',
              fontWeight: 'bold'
            }}>
              Página em Desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MateriaisDidáticos;



