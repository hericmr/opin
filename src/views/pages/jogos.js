import React, { useMemo } from 'react';
import StaticPageMetaTags from '../../components/StaticPageMetaTags';
import { useEscolasData } from '../../hooks/useEscolasData';
import Footer from '../../components/Footer';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import GameGallery from '../../components/Jogos/GameGallery';

const Jogos = () => {
  const { dataPoints } = useEscolasData();

  // Breadcrumbs de Navegação - memoizado para evitar recriação
  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Jogos', path: '/jogos', active: true }
  ], []);

  const pageTitle = 'Jogos - OPIN';
  const pageDescription = 'Jogos e materiais didáticos para impressão, são produzidos no âmbito da ação Saberes Indígenas na Escola.';

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      <StaticPageMetaTags 
        title={pageTitle}
        description={pageDescription}
        urlPath="/jogos"
      />

      {/* Cabeçalho com design indígena - Hero image começa do topo */}
      <PageHeader
        title="Jogos"
        showNavbar={true}
        dataPoints={dataPoints || []}
        overlayColor="rgba(76, 29, 149, 0.85)"
        blendMode="multiply"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      {/* Conteúdo principal com espaçamento para o hero */}
      <div className="relative z-10 pt-10 sm:pt-14 pb-0 w-full overflow-hidden">
        <GameGallery />
      </div>
      <Footer />
    </div>
  );
};

export default Jogos;
