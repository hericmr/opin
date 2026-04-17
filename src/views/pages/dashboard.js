import React, { useMemo } from 'react';
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
      {/* Cabeçalho com design indígena - Hero image começa do topo */}
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

        {imagesReady && headerImages[1] && (
          <DashboardImageSection image={headerImages[1]} priority="high" />
        )}

        <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <TiposEnsinoChart data={data.tiposEnsino} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {imagesReady && headerImages[2] && (
          <DashboardImageSection image={headerImages[2]} priority="normal" />
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

        {imagesReady && headerImages[3] && (
          <DashboardImageSection image={headerImages[3]} priority="normal" />
        )}

        <section className="bg-white py-16 sm:py-24 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <EquipamentosChart data={data.equipamentos} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {imagesReady && headerImages[4] && (
          <DashboardImageSection image={headerImages[4]} priority="normal" />
        )}

        <section className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <EscolasPorDiretoriaChart data={data.escolasPorDiretoria} />
            </ChartSuspenseWrapper>
          </div>
        </section>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;



