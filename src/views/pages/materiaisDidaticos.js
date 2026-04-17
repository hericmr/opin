import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
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

  const siteUrl = 'https://hericmr.github.io/opin';
  const imageUrl = `${siteUrl}/hero_grayscale.webp`;
  const pageTitle = 'Materiais Didáticos - OPIN';
  const pageDescription = 'Materiais didáticos produzidos no âmbito da ação Saberes Indígenas na Escola, em parceria com a UNIFESP no estado de São Paulo.';

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/conteudo`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`${siteUrl}/conteudo`} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

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
      <div className="relative z-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookGallery />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MateriaisDidáticos;



