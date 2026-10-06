import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useEscolasData } from '../../hooks/useEscolasData';
import Footer from '../../components/Footer';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useDashboardImages } from '../../hooks/useDashboardImages';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import DashboardDescription from '../../components/Dashboard/DashboardDescription';
import DashboardImageSection from '../../components/Dashboard/DashboardImageSection';
import ChartSuspenseWrapper from '../../components/Dashboard/ChartSuspenseWrapper';
import {
  DistribuicaoEscolasCombinadoChart,
  DistribuicaoAlunosModalidadeChart,
  EquipamentosChart,
  EscolasPorDiretoriaChart,
  TiposEnsinoChart
} from '../../components/Charts';

const Dashboard = () => {
  const { dataPoints } = useEscolasData();
  const { data, loading, error } = useDashboardData();
  const { headerImages, imagesReady } = useDashboardImages();

  // Breadcrumbs de Navegação - memoizado para evitar recriação
  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Alguns dados', path: '/algunsdados', active: true }
  ], []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-xl text-gray-700 font-sans">
            Carregando dados dos gráficos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-scroll relative">
      <Helmet>
        <title>Alguns Dados – OPIN</title>
        <meta name="description" content="Indicadores sobre escolas indígenas de São Paulo: alunos, docentes, infraestrutura, distribuição geográfica e modalidades de ensino." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hericmr.github.io/opin/algunsdados" />
        <meta property="og:title" content="Alguns Dados – OPIN" />
        <meta property="og:description" content="Indicadores sobre escolas indígenas de São Paulo: alunos, docentes, infraestrutura, distribuição geográfica e modalidades de ensino." />
        <meta property="og:image" content="https://hericmr.github.io/opin/hero_grayscale.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Alguns Dados – OPIN" />
        <meta name="twitter:description" content="Indicadores sobre escolas indígenas de São Paulo: alunos, docentes, infraestrutura, distribuição geográfica e modalidades de ensino." />
        <meta name="twitter:image" content="https://hericmr.github.io/opin/hero_grayscale.webp" />
      </Helmet>
      <PageHeader
        title="Alguns dados"
        showNavbar={true}
        dataPoints={dataPoints || []}
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>
      
      {/* Conteúdo principal com espaçamento para o hero - será ajustado dinamicamente */}
      <div className="relative z-10">
        {/* Descrição da página - Abaixo do hero, estilo Native Land Digital */}
        <DashboardDescription />

      <div className="w-full">
        <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <DistribuicaoAlunosModalidadeChart data={data.distribuicaoAlunosModalidade} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {imagesReady && headerImages[0] && (
          <DashboardImageSection image={headerImages[0]} priority="high" />
        )}

        <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <TiposEnsinoChart data={data.tiposEnsino} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {imagesReady && headerImages[1] && (
          <DashboardImageSection image={headerImages[1]} priority="normal" />
        )}

        <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <DistribuicaoEscolasCombinadoChart
                distribuicaoData={data.distribuicaoAlunos}
                alunosPorEscolaData={data.alunosPorEscola}
              />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {imagesReady && headerImages[2] && (
          <DashboardImageSection image={headerImages[2]} priority="normal" />
        )}

        <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <EquipamentosChart data={data.equipamentos} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {imagesReady && headerImages[3] && (
          <DashboardImageSection image={headerImages[3]} priority="normal" />
        )}

        <section className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <EscolasPorDiretoriaChart data={data.escolasPorDiretoria} />
            </ChartSuspenseWrapper>
            <div className="mt-12 text-lg sm:text-xl leading-loose text-neutral-700">
              <p>
                As 42 escolas estaduais indígenas estão distribuídas entre 12 Diretorias de Ensino, mas de forma bastante heterogênea. A concentração é maior no litoral e no Vale do Ribeira: as Diretorias de São Vicente (9 escolas), Miracatu (8) e Registro (8) reúnem juntas 25 escolas, o que equivale a cerca de 60% da rede. Em um segundo patamar aparecem Bauru e Itararé, com 4 escolas cada, seguidas por Caraguatatuba e Sul 3, com 2 cada. As demais, São Bernardo do Campo, Norte 1, Penápolis, Tupã e Santos, têm apenas uma escola indígena. Essa distribuição reflete a presença dos povos indígenas no território paulista e indica onde a gestão da educação escolar indígena é mais demandada.
              </p>
            </div>
          </div>
        </section>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;



