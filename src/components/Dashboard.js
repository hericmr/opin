import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import csvDataService from '../services/csvDataService';
import { supabase } from '../supabaseClient';
import { useEscolasData } from '../hooks/useEscolasData';
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
  const { dataPoints } = useEscolasData();
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
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const [descriptionImage, setDescriptionImage] = useState(null);
  const [imagesReady, setImagesReady] = useState(false);

  // Estilo padronizado para imagens - melhores práticas de contraste e saturação
  const imageStyle = {
    filter: 'saturate(1.25) contrast(1.1) brightness(1.05)',
    transition: 'filter 0.3s ease-in-out'
  };

  // Breadcrumbs de Navegação
  const breadcrumbs = [
    { label: 'Início', path: '/', active: false },
    { label: 'Alguns dados', path: '/dashboard', active: true }
  ];

  // Função para pré-carregar imagens com alta prioridade
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(new Error(`Failed to preload: ${url}`));
      // Forçar carregamento imediato com alta prioridade (se suportado)
      if ('fetchPriority' in img) {
        img.fetchPriority = 'high';
      }
      img.src = url;
    });
  };

  // Carregar imagens de header COM PRIORIDADE - antes dos dados dos gráficos
  useEffect(() => {
    const loadHeaderImages = async () => {
      // Timeout de segurança: garantir que a página não trave
      const timeoutId = setTimeout(() => {
        console.warn('Timeout no carregamento de imagens. Continuando sem imagens.');
        setImagesPreloaded(true);
        setImagesReady(true);
      }, 10000); // 10 segundos de timeout máximo

      try {
        // Aguardar um pouco para garantir que o Supabase esteja inicializado
        // Especialmente importante quando acessado diretamente pela URL
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verificar se o Supabase está disponível
        if (!supabase) {
          console.warn('Supabase client não está disponível. Pulando carregamento de imagens.');
          clearTimeout(timeoutId);
          setImagesPreloaded(true);
          setImagesReady(true);
          return;
        }

        // Verificar se as credenciais do Supabase estão configuradas
        const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
        const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl.includes('seu-projeto') || 
            supabaseKey.includes('sua_chave_anonima')) {
          console.warn('Credenciais do Supabase não configuradas. Pulando carregamento de imagens.');
          clearTimeout(timeoutId);
          setImagesPreloaded(true);
          setImagesReady(true);
          return;
        }

        // Fazer query com timeout individual
        const queryPromise = supabase
          .from('escolas_completa')
          .select('id, Escola, imagem_header')
          .not('imagem_header', 'is', null)
          .neq('imagem_header', '')
          .limit(100);

        const queryTimeout = new Promise((resolve) => 
          setTimeout(() => resolve({ data: null, error: new Error('Query timeout') }), 5000)
        );

        // Usar Promise.race para aplicar timeout na query
        const result = await Promise.race([
          queryPromise.then(result => result),
          queryTimeout
        ]).catch(err => {
          console.warn('Erro na query do Supabase:', err.message || err);
          return { data: null, error: err };
        });

        const { data: escolasData, error: escolasError } = result;

        clearTimeout(timeoutId);

        if (escolasError) {
          console.warn('Erro ao carregar imagens de header do Supabase:', escolasError.message || escolasError);
          setImagesPreloaded(true);
          setImagesReady(true);
          return;
        }

        if (escolasData && escolasData.length > 0) {
          // Remover duplicatas baseado na URL da imagem
          const uniqueImages = [];
          const seenUrls = new Set();
          
          escolasData.forEach(escola => {
            if (escola.imagem_header && !seenUrls.has(escola.imagem_header)) {
              seenUrls.add(escola.imagem_header);
              uniqueImages.push(escola);
            }
          });

          // Selecionar aleatoriamente algumas imagens únicas (máximo 6 para garantir variedade)
          const shuffled = [...uniqueImages].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, Math.min(6, shuffled.length));
          
          // Garantir que não há duplicatas na seleção final
          const finalSelected = [];
          const finalSeenUrls = new Set();
          selected.forEach(img => {
            if (!finalSeenUrls.has(img.imagem_header)) {
              finalSeenUrls.add(img.imagem_header);
              finalSelected.push(img);
            }
          });
          
          // Setar imagens no estado IMEDIATAMENTE (antes do pré-carregamento)
          // Isso permite que a página renderize mesmo se o pré-carregamento demorar
          const headerImagesForDisplay = finalSelected.slice(0, 5);
          const headerImageUrls = new Set(headerImagesForDisplay.map(img => img.imagem_header));
          
          setHeaderImages(headerImagesForDisplay);
          
          // Selecionar uma imagem aleatória para exibir após a descrição
          const availableForDescription = finalSelected.filter(img => 
            !headerImageUrls.has(img.imagem_header)
          );
          
          if (availableForDescription.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableForDescription.length);
            setDescriptionImage(availableForDescription[randomIndex]);
          } else if (finalSelected.length > 5) {
            const extraImages = finalSelected.slice(5);
            const randomIndex = Math.floor(Math.random() * extraImages.length);
            setDescriptionImage(extraImages[randomIndex]);
          } else if (finalSelected.length > 1) {
            const candidates = finalSelected.slice(1);
            const randomIndex = Math.floor(Math.random() * candidates.length);
            setDescriptionImage(candidates[randomIndex]);
          }

          // Marcar como pronto para renderizar IMEDIATAMENTE
          setImagesPreloaded(true);
          setImagesReady(true);
          
          // PRÉ-CARREGAR imagens em background (não bloqueante)
          const imageUrls = finalSelected.map(img => img.imagem_header).filter(Boolean);
          
          // Pré-carregar imagens de forma não-bloqueante
          if (typeof document !== 'undefined' && imageUrls.length > 0) {
            // Método 1: Preload links no head (mais rápido)
            imageUrls.forEach((url) => {
              try {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = url;
                if ('fetchPriority' in link) {
                  link.fetchPriority = 'high';
                }
                document.head.appendChild(link);
              } catch (e) {
                // Ignorar erros de preload
              }
            });
            
            // Método 2: Pré-carregar via Image objects em paralelo (não bloqueante)
            // Usar Promise.allSettled para não travar se alguma falhar
            Promise.allSettled(
              imageUrls.map(url => {
                return new Promise((resolve) => {
                  const img = new Image();
                  const timeout = setTimeout(() => resolve(url), 3000); // Timeout de 3s por imagem
                  
                  img.onload = () => {
                    clearTimeout(timeout);
                    resolve(url);
                  };
                  img.onerror = () => {
                    clearTimeout(timeout);
                    resolve(url); // Continua mesmo se falhar
                  };
                  
                  if ('fetchPriority' in img) {
                    img.fetchPriority = 'high';
                  }
                  img.src = url;
                });
              })
            ).catch(() => {
              // Ignorar erros - já marcamos como ready
            });
          }
        } else {
          console.warn('Nenhuma imagem de header encontrada no Supabase.');
          setImagesPreloaded(true);
          setImagesReady(true);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn('Erro ao carregar imagens de header (não crítico):', err.message || err);
        setImagesPreloaded(true);
        setImagesReady(true); // Continua mesmo se falhar
      }
    };

    // Carregar imagens de forma não-bloqueante
    loadHeaderImages();
  }, []);

  // Carregar dados dos gráficos (pode ser em paralelo, mas imagens têm prioridade)
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
        {/* Breadcrumbs no hero - Estilo Native Land Digital */}
        <nav className="flex items-center justify-center space-x-2 text-base sm:text-lg text-white/90" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '0.01em'
        }}>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 mx-2" />
              )}
              {crumb.path ? (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="hover:text-white transition-colors font-normal"
                  style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="font-medium text-white">
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
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
            <p className="mb-6" style={{
              fontSize: '1.125rem',
              lineHeight: '1.75',
              color: '#374151',
              letterSpacing: '0.01em'
            }}>
              Este espaço reúne informações sobre as escolas indígenas do estado de São Paulo, apresentando indicadores como número de estudantes e docentes, infraestrutura disponível, distribuição geográfica por Diretorias de Ensino e modalidades de ensino oferecidas. Os dados foram fornecidos pela Secretaria da Educação do Estado de São Paulo (SEDUC) e referem-se ao ano de 2025. A base completa pode ser acessada em:{' '}
              <a 
                href="https://dados.educacao.sp.gov.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-700 hover:text-green-800 underline font-medium transition-colors"
                style={{
                  color: '#15803d',
                  textDecorationThickness: '1.5px',
                  textUnderlineOffset: '2px'
                }}
              >
                dados.educacao.sp.gov.br
              </a>
            </p>
          </div>
        </div>

        {/* Imagem aleatória de escola após a descrição */}
        {imagesReady && descriptionImage && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden mt-6">
            <OptimizedImage
              src={descriptionImage.imagem_header}
              alt={descriptionImage.Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={imageStyle}
              priority="normal"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {descriptionImage.Escola && (
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-md text-base font-medium shadow-lg" style={{
                fontSize: '0.9375rem',
                lineHeight: '1.5',
                letterSpacing: '0.01em'
              }}>
                {descriptionImage.Escola}
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
        {imagesReady && headerImages[1] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[1].imagem_header}
              alt={headerImages[1].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={imageStyle}
              priority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[1].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-md text-base font-medium shadow-lg" style={{
                fontSize: '0.9375rem',
                lineHeight: '1.5',
                letterSpacing: '0.01em'
              }}>
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
        {imagesReady && headerImages[2] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[2].imagem_header}
              alt={headerImages[2].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={imageStyle}
              priority="normal"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[2].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-md text-base font-medium shadow-lg" style={{
                fontSize: '0.9375rem',
                lineHeight: '1.5',
                letterSpacing: '0.01em'
              }}>
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
        {imagesReady && headerImages[3] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[3].imagem_header}
              alt={headerImages[3].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={imageStyle}
              priority="normal"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[3].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-md text-base font-medium shadow-lg" style={{
                fontSize: '0.9375rem',
                lineHeight: '1.5',
                letterSpacing: '0.01em'
              }}>
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
        {imagesReady && headerImages[4] && (
          <section className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] relative overflow-hidden">
            <OptimizedImage
              src={headerImages[4].imagem_header}
              alt={headerImages[4].Escola || 'Imagem da escola'}
              className="w-full h-full object-cover"
              style={imageStyle}
              priority="normal"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Legenda no canto inferior */}
            {headerImages[4].Escola && (
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-md text-base font-medium shadow-lg" style={{
                fontSize: '0.9375rem',
                lineHeight: '1.5',
                letterSpacing: '0.01em'
              }}>
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
    </div>
  );
};

export default Dashboard;