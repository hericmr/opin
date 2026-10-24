import React, { useMemo } from 'react';
import StaticPageMetaTags from '../../components/StaticPageMetaTags';
import { useEscolasData } from '../../hooks/useEscolasData';
import Footer from '../../components/Footer';
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

  const pageTitle = 'Materiais Didáticos - OPIN';
  const pageDescription = 'Jogos e materiais didáticos para impressão, são produzidos no âmbito da ação Saberes Indígenas na Escola.';

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      <StaticPageMetaTags 
        title={pageTitle}
        description={pageDescription}
        urlPath="/conteudo"
      />

      {/* Cabeçalho com design indígena - Hero image começa do topo */}
      <PageHeader
        title="Materiais Didáticos"
        showNavbar={true}
        dataPoints={dataPoints || []}
        overlayColor="rgba(255, 128, 90, 1)"
        blendMode="color"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      {/* Conteúdo principal com espaçamento para o hero */}
      <div className="relative z-10 pt-10 sm:pt-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookGallery />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MateriaisDidáticos;



