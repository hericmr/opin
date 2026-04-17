import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Map } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import Footer from '../../components/Footer';
import { useEscolaDetalhes } from '../../hooks/useEscolaDetalhes';
import { useEscolasData } from '../../hooks/useEscolasData';
import BasicInfo from '../../components/PainelInformacoes/components/EscolaInfo/BasicInfo';
import Modalidades from '../../components/PainelInformacoes/components/EscolaInfo/Modalidades';
import Infraestrutura from '../../components/PainelInformacoes/components/EscolaInfo/Infraestrutura';
import GestaoProfessores from '../../components/PainelInformacoes/components/EscolaInfo/GestaoProfessores';
import HistoriaEscola from '../../components/PainelInformacoes/components/EscolaInfo/HistoriaEscola';
import HistoriaTerraIndigena from '../../components/PainelInformacoes/components/EscolaInfo/HistoriaTerraIndigena';
import HistoriadoProfessor from '../../components/PainelInformacoes/components/EscolaInfo/HistoriadoProfessor';
import ProjetosParcerias from '../../components/PainelInformacoes/components/EscolaInfo/ProjetosParcerias';
import GaleriaHorizontal from '../../components/PainelInformacoes/components/GaleriaHorizontal';
import GaleriaPanel from '../../components/PainelInformacoes/components/GaleriaPanel';

const siteUrl = 'https://hericmr.github.io/opin';

const Section = ({ title, children }) => (
  <section className="py-10 border-b border-gray-100 last:border-b-0">
    {title && (
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
        {title}
      </h2>
    )}
    {children}
  </section>
);

const EscolaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dataPoints } = useEscolasData();
  const { data: escola, loading, error } = useEscolaDetalhes(id);
  const [galeriaOpen, setGaleriaOpen] = useState(false);

  const nome = escola?.nome || '';
  const municipio = escola?.municipio || '';
  const terraIndigena = escola?.terra_indigena || '';

  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Mapa', path: '/mapa', active: false },
    { label: nome || 'Escola', path: `/escola/${id}`, active: true },
  ], [nome, id]);

  const ogDescription = `Escola indígena ${nome}${municipio ? ` em ${municipio}` : ''}${terraIndigena ? `, Terra Indígena ${terraIndigena}` : ''}.`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando dados da escola...</p>
        </div>
      </div>
    );
  }

  if (error || (!loading && !escola)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <p className="text-2xl font-bold text-gray-800 mb-2">Escola não encontrada</p>
          <p className="text-gray-500 mb-6">Não foi possível carregar os dados desta escola.</p>
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Map className="w-4 h-4" />
            Voltar ao mapa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-scroll relative bg-white">
      <Helmet>
        <title>{nome} – OPIN</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/escola/${id}`} />
        <meta property="og:title" content={`${nome} – OPIN`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={`${siteUrl}/hero_grayscale.webp`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${nome} – OPIN`} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={`${siteUrl}/hero_grayscale.webp`} />
      </Helmet>

      <PageHeader
        title={nome}
        showNavbar={true}
        dataPoints={dataPoints || []}
        overlayColor="rgba(20, 81, 45, 0.7)"
        blendMode="normal"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <div className="relative z-10">
        {/* Galeria de fotos */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-8">
            <GaleriaHorizontal
              escola_id={Number(id)}
              onOpenGaleria={() => setGaleriaOpen(true)}
            />
          </div>
        </div>

        {/* Conteúdo editorial */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-4">

          {/* Botão Ver no mapa */}
          <div className="py-6 border-b border-gray-100">
            <button
              onClick={() => navigate('/mapa', {
                state: {
                  searchTerm: nome,
                  coordinates: escola.latitude && escola.longitude
                    ? [escola.latitude, escola.longitude]
                    : null,
                  highlightSchool: nome,
                  openPainel: escola.id,
                }
              })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              <Map className="w-4 h-4" />
              Ver no mapa
            </button>
          </div>

          <Section title="Informações Básicas">
            <BasicInfo escola={escola} />
          </Section>

          <Section title="Modalidades e Ensino">
            <Modalidades escola={escola} />
          </Section>

          <Section title="Infraestrutura">
            <Infraestrutura escola={escola} />
          </Section>

          <Section title="Gestão e Professores">
            <GestaoProfessores escola={escola} />
          </Section>

          <Section title="História da Escola">
            <HistoriaEscola escola={escola} />
          </Section>

          <Section title="História da Terra Indígena">
            <HistoriaTerraIndigena escola={escola} />
          </Section>

          <Section title="Histórias dos Professores">
            <HistoriadoProfessor escola={escola} />
          </Section>

          <Section title="Projetos e Parcerias">
            <ProjetosParcerias escola={escola} />
          </Section>

        </div>
      </div>

      {/* Galeria fullscreen */}
      {galeriaOpen && (
        <GaleriaPanel
          escolaId={Number(id)}
          headerUrl={escola?.imagem_header}
          titulo={nome}
          isOpen={galeriaOpen}
          onClose={() => setGaleriaOpen(false)}
        />
      )}

      <Footer />
    </div>
  );
};

export default EscolaPage;
