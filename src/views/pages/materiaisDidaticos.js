import React, { useMemo } from 'react';
import { useEscolasData } from '../../hooks/useEscolasData';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import BookGallery from '../../components/MateriaisDidáticos/components/BookGallery';

const MateriaisDidáticos = () => {
  const { dataPoints } = useEscolasData();

  // Breadcrumbs de Navegação - memoizado para evitar recriação
  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Materiais Didáticos', path: '/conteudo', active: true }
  ], []);

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      {/* Cabeçalho com design indígena - Hero image começa do topo */}
      <PageHeader
        title="Materiais Didáticos"
        showNavbar={true}
        dataPoints={dataPoints || []}
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>
      
      {/* Conteúdo principal com espaçamento para o hero */}
      <div className="relative z-10 hero-content-spacer pb-20" style={{ marginTop: '300px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookGallery />
        </div>
      </div>
    </div>
  );
};

export default MateriaisDidáticos;



