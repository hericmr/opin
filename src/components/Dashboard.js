import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import csvDataService from '../services/csvDataService';
import PageHeader from './PageHeader';
import {
  AlunosPorEscolaChart,
  DistribuicaoAlunosChart,
  DistribuicaoAlunosModalidadeChart,
  EquipamentosChart,
  EscolasPorDiretoriaChart,
  TiposEnsinoChart
} from './Charts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    alunosPorEscola: [],
    distribuicaoAlunos: [],
    distribuicaoAlunosModalidade: [],
    equipamentos: [],
    escolasPorDiretoria: [],
    tiposEnsino: []
  });

  // Breadcrumbs de Navegação
  const breadcrumbs = [
    { label: 'Início', path: '/', active: false },
    { label: 'Painel de Dados', path: '/dashboard', active: true }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          alunosPorEscola,
          distribuicaoAlunos,
          distribuicaoAlunosModalidade,
          equipamentos,
          escolasPorDiretoria,
          tiposEnsino
        ] = await Promise.all([
          csvDataService.getAlunosPorEscolaData().catch(err => {
            console.error('Erro ao carregar alunos por escola:', err);
            return [];
          }),
          csvDataService.getDistribuicaoAlunosData().catch(err => {
            console.error('Erro ao carregar distribuição de alunos:', err);
            return [];
          }),
          csvDataService.getDistribuicaoAlunosModalidadeData().catch(err => {
            console.error('Erro ao carregar distribuição de alunos por modalidade:', err);
            return [];
          }),
          csvDataService.getEquipamentosData().catch(err => {
            console.error('Erro ao carregar equipamentos:', err);
            return [];
          }),
          csvDataService.getEscolasPorDiretoriaData().catch(err => {
            console.error('Erro ao carregar escolas por diretoria:', err);
            return [];
          }),
          csvDataService.getTiposEnsinoData().catch(err => {
            console.error('Erro ao carregar tipos de ensino:', err);
            return [];
          })
        ]);


        setData({
          alunosPorEscola,
          distribuicaoAlunos,
          distribuicaoAlunosModalidade,
          equipamentos,
          escolasPorDiretoria,
          tiposEnsino
        });
      } catch (err) {
        console.error('Erro geral ao carregar dados:', err);
        setError(`Erro ao carregar os dados dos gráficos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando dados dos gráficos...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 pt-16 sm:pt-20 dashboard-scroll">
      {/* Breadcrumbs de Navegação */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}
                {crumb.path ? (
                  <button
                    onClick={() => window.location.href = crumb.path}
                    className="text-gray-600 hover:text-green-700 transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={`font-medium ${crumb.active ? 'text-green-700' : 'text-gray-900'}`}>
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Cabeçalho com design indígena */}
      <PageHeader
        title="Painel de Dados"
        description={
          <>
            Este espaço reúne informações sobre as escolas indígenas do estado de São Paulo, apresentando indicadores como número de estudantes e docentes, infraestrutura disponível, distribuição geográfica por Diretorias de Ensino e modalidades de ensino oferecidas. Os dados foram fornecidos pela Secretaria da Educação do Estado de São Paulo (SEDUC) e referem-se ao ano de 2025. A base completa pode ser acessada em:{' '}
            <a 
              href="https://dados.educacao.sp.gov.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-green-100 underline font-medium"
            >
              dados.educacao.sp.gov.br
            </a>
          </>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Grid de Gráficos */}
        <div className="space-y-8">
          {/* PRIMEIRO GRÁFICO - Distribuição de Alunos por Modalidade */}
          <div>
            <DistribuicaoAlunosModalidadeChart data={data.distribuicaoAlunosModalidade} />
          </div>

          {/* Gráfico de Barras - Tipos de Ensino */}
          <div>
            <TiposEnsinoChart data={data.tiposEnsino} />
          </div>

          {/* Gráfico de Barras - Alunos por Escola */}
          <div>
            <AlunosPorEscolaChart data={data.alunosPorEscola} />
          </div>

          {/* Gráfico de Pizza - Distribuição de Alunos */}
          <div>
            <DistribuicaoAlunosChart data={data.distribuicaoAlunos} />
          </div>

          {/* Gráfico de Barras Horizontais - Equipamentos */}
          <div>
            <EquipamentosChart data={data.equipamentos} />
          </div>

          {/* Gráfico de Barras Horizontais - Escolas por Diretoria */}
          <div>
            <EscolasPorDiretoriaChart data={data.escolasPorDiretoria} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;