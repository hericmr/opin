import React, { useMemo } from 'react';
import { useEscolasData } from '../hooks/useEscolasData';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboardImages } from '../hooks/useDashboardImages';
import PageHeader from './PageHeader';
import DashboardBreadcrumbs from './Dashboard/DashboardBreadcrumbs';
import DashboardDescription from './Dashboard/DashboardDescription';
import DashboardImageSection from './Dashboard/DashboardImageSection';
import ChartSuspenseWrapper from './Dashboard/ChartSuspenseWrapper';
import {
  DistribuicaoEscolasCombinadoChart,
  DistribuicaoAlunosModalidadeChart,
  EquipamentosChart,
  EscolasPorDiretoriaChart,
  TiposEnsinoChart
} from './Charts';

const Dashboard = () => {
  const { dataPoints } = useEscolasData();
  const { data, loading, error } = useDashboardData();
  const { headerImages, descriptionImage, imagesReady } = useDashboardImages();

  // Breadcrumbs de Navegação - memoizado para evitar recriação
  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Alguns dados', path: '/dashboard', active: true }
  ], []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-xl text-gray-700" style={{
            fontSize: '1.25rem',
            lineHeight: '1.75',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}>
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
      <div className="relative z-10 hero-content-spacer" style={{ marginTop: '300px' }}>
        {/* Descrição da página - Abaixo do hero, estilo Native Land Digital */}
        <DashboardDescription />

        {/* Imagem aleatória de escola após a descrição */}
        {imagesReady && descriptionImage && (
          <div className="mt-6">
            <DashboardImageSection image={descriptionImage} priority="normal" />
          </div>
        )}

      {/* Seções com cores que mudam conforme o scroll */}
      <div className="w-full">
        {/* PRIMEIRO GRÁFICO - Distribuição de Alunos por Modalidade - Seção Branca */}
        <section className="bg-white py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <DistribuicaoAlunosModalidadeChart data={data.distribuicaoAlunosModalidade} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {imagesReady && headerImages[1] && (
          <DashboardImageSection image={headerImages[1]} priority="high" />
        )}

        {/* Gráfico de Barras - Tipos de Ensino - Seção Indigo */}
        <section className="bg-indigo-50 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <TiposEnsinoChart data={data.tiposEnsino} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {imagesReady && headerImages[2] && (
          <DashboardImageSection image={headerImages[2]} priority="normal" />
        )}

        {/* Gráfico Combinado - Distribuição de Escolas - Seção Amarela */}
        <section className="bg-yellow-100 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <DistribuicaoEscolasCombinadoChart 
                distribuicaoData={data.distribuicaoAlunos}
                alunosPorEscolaData={data.alunosPorEscola}
              />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {imagesReady && headerImages[3] && (
          <DashboardImageSection image={headerImages[3]} priority="normal" />
        )}

        {/* Gráfico de Equipamentos - Seção Verde */}
        <section className="bg-green-100 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <EquipamentosChart data={data.equipamentos} />
            </ChartSuspenseWrapper>
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {imagesReady && headerImages[4] && (
          <DashboardImageSection image={headerImages[4]} priority="normal" />
        )}

        {/* Gráfico de Escolas por Diretoria - Seção Cinza */}
        <section className="bg-gray-100 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ChartSuspenseWrapper>
              <EscolasPorDiretoriaChart data={data.escolasPorDiretoria} />
            </ChartSuspenseWrapper>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;