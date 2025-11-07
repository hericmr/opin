import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import csvDataService from '../services/csvDataService';
import { supabase } from '../supabaseClient';
import PageHeader from './PageHeader';
import OptimizedImage from './OptimizedImage';
import {
  DistribuicaoEscolasCombinadoChart,
  DistribuicaoAlunosModalidadeChart,
  EquipamentosChart,
  EscolasPorDiretoriaChart,
  TiposEnsinoChart
} from './Charts';

const Dashboard = () => {
  const navigate = useNavigate();
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
  const [headerImages, setHeaderImages] = useState([]);

  // Breadcrumbs de Navegação
  const breadcrumbs = [
    { label: 'Início', path: '/', active: false },
    { label: 'Alguns dados', path: '/dashboard', active: true }
  ];

  // Carregar dados dos gráficos
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

  // Carregar imagens de header de forma independente e assíncrona
  useEffect(() => {
    const loadHeaderImages = async () => {
      try {
        const { data: escolasData, error: escolasError } = await supabase
          .from('escolas_completa')
          .select('id, Escola, imagem_header')
          .not('imagem_header', 'is', null)
          .neq('imagem_header', '')
          .limit(100); // Limitar para performance

        if (!escolasError && escolasData && escolasData.length > 0) {
          // Remover duplicatas baseado na URL da imagem
          const uniqueImages = [];
          const seenUrls = new Set();
          
          escolasData.forEach(escola => {
            if (escola.imagem_header && !seenUrls.has(escola.imagem_header)) {
              seenUrls.add(escola.imagem_header);
              uniqueImages.push(escola);
            }
          });

          // Selecionar aleatoriamente algumas imagens únicas (máximo 5 para incluir a primeira após o header)
          const shuffled = [...uniqueImages].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, Math.min(5, shuffled.length));
          setHeaderImages(selected);
        }
      } catch (err) {
        console.error('Erro ao carregar imagens de header:', err);
        // Não falha o carregamento se não conseguir buscar imagens
      }
    };

    loadHeaderImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen pt-16 sm:pt-20 dashboard-scroll">
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
                    onClick={() => navigate(crumb.path)}
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
        title="Alguns dados"
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

      {/* Imagem de Header - Logo após o cabeçalho verde */}
      {headerImages.length > 0 && (
        <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
          <OptimizedImage
            src={headerImages[0].imagem_header}
            alt={headerImages[0].Escola || 'Imagem da escola'}
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(1.1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {/* Legenda no canto inferior */}
          {headerImages[0].Escola && (
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-medium">
              {headerImages[0].Escola}
            </div>
          )}
        </section>
      )}

      {/* Seções com cores que mudam conforme o scroll */}
      <div className="w-full">
        {/* PRIMEIRO GRÁFICO - Distribuição de Alunos por Modalidade - Seção Branca */}
        <section className="bg-white py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DistribuicaoAlunosModalidadeChart data={data.distribuicaoAlunosModalidade} />
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {headerImages[1] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[1].imagem_header}
              alt={headerImages[1].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[1].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-medium">
                {headerImages[1].Escola}
              </div>
            )}
          </section>
        )}

        {/* Gráfico de Barras - Tipos de Ensino - Seção Indigo */}
        <section className="bg-indigo-50 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TiposEnsinoChart data={data.tiposEnsino} />
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {headerImages[2] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[2].imagem_header}
              alt={headerImages[2].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[2].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-medium">
                {headerImages[2].Escola}
              </div>
            )}
          </section>
        )}

        {/* Gráfico Combinado - Distribuição de Escolas - Seção Amarela */}
        <section className="bg-yellow-100 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DistribuicaoEscolasCombinadoChart 
              distribuicaoData={data.distribuicaoAlunos}
              alunosPorEscolaData={data.alunosPorEscola}
            />
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {headerImages[3] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[3].imagem_header}
              alt={headerImages[3].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[3].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-medium">
                {headerImages[3].Escola}
              </div>
            )}
          </section>
        )}

        {/* Gráfico de Equipamentos - Seção Verde */}
        <section className="bg-green-100 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EquipamentosChart data={data.equipamentos} />
          </div>
        </section>

        {/* Imagem de Header - Full Width */}
        {headerImages[4] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[4].imagem_header}
              alt={headerImages[4].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[4].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-medium">
                {headerImages[4].Escola}
              </div>
            )}
          </section>
        )}

        {/* Gráfico de Escolas por Diretoria - Seção Cinza */}
        <section className="bg-gray-100 py-12 sm:py-16 transition-colors duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EscolasPorDiretoriaChart data={data.escolasPorDiretoria} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;