import React, { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Map as MapIcon, Users, BookOpen, Wifi, Share2, ChevronDown } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import Footer from '../../components/Footer';
import { useEscolaDetalhes } from '../../hooks/useEscolaDetalhes';
import { useEscolasData } from '../../hooks/useEscolasData';
import { idFromEscolaSlug, escolaUrlSlug } from '../../utils/slug';
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

// Seção com âncora — oculta se show=false ou se o conteúdo renderizado for vazio
const Section = ({ id, title, children, show = true }) => {
  const contentRef = useRef(null);
  const [hasContent, setHasContent] = useState(true);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setHasContent(contentRef.current.childElementCount > 0);
    }
  });

  if (!show || !hasContent) return null;

  return (
    <section id={id} className="py-12 border-b border-gray-100 last:border-b-0 scroll-mt-16">
      {title && (
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
          {title}
        </h2>
      )}
      <div ref={contentRef}>{children}</div>
    </section>
  );
};

// Card de stat do sumário
const StatCard = ({ icon: Icon, label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-green-700" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-lg font-bold text-gray-900 leading-tight truncate">{value}</p>
      </div>
    </div>
  );
};

// Nav de âncoras com highlight ativo
const AnchorNav = ({ sections }) => {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-0">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                active === id
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const EscolaPage = () => {
  const { slug } = useParams();
  const id = idFromEscolaSlug(slug);
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
    { label: nome || 'Escola', path: `/escola/${slug}`, active: true },
  ], [nome, slug]);

  // Seções visíveis para o nav de âncoras
  const navSections = useMemo(() => {
    if (!escola) return [];
    const s = [];
    s.push({ id: 'informacoes', label: 'Informações' });
    if (escola.modalidade_ensino || escola.numero_alunos || escola.linguas_faladas)
      s.push({ id: 'ensino', label: 'Ensino' });
    if (escola.espaco_escolar || escola.acesso_internet != null || escola.equipamentos)
      s.push({ id: 'infraestrutura', label: 'Infraestrutura' });
    if (escola.professores_indigenas || escola.professores_nao_indigenas)
      s.push({ id: 'professores', label: 'Professores' });
    if (escola.historia_da_escola)
      s.push({ id: 'historia', label: 'História' });
    if (escola.historia_terra_indigena)
      s.push({ id: 'terra', label: 'Terra Indígena' });
    s.push({ id: 'historias-professores', label: 'Histórias' });
    if (escola.outras_informacoes)
      s.push({ id: 'projetos', label: 'Projetos' });
    return s;
  }, [escola]);

  const ogDescription = `Escola indígena ${nome}${municipio ? ` em ${municipio}` : ''}${terraIndigena ? `, Terra Indígena ${terraIndigena}` : ''}.`;

  const handleShare = () => {
    const url = `${siteUrl}/escola/${slug}`;
    if (navigator.share) {
      navigator.share({ title: nome, url });
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

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
          <Link to="/mapa" className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors">
            <MapIcon className="w-4 h-4" />
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
        <meta property="og:url" content={`${siteUrl}/escola/${slug}`} />
        <meta property="og:title" content={`${nome} – OPIN`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={escola?.imagem_header || `${siteUrl}/hero_grayscale.webp`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${nome} – OPIN`} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={escola?.imagem_header || `${siteUrl}/hero_grayscale.webp`} />
      </Helmet>

      <PageHeader
        title={nome}
        showNavbar={true}
        dataPoints={dataPoints || []}
        overlayColor="rgba(20, 81, 45, 0.55)"
        blendMode="normal"
        backgroundImage={escola?.imagem_header || null}
        minHeight="65vh"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <div className="relative z-10">

        {/* Sumário visual */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={Users} label="Alunos" value={escola.numero_alunos} />
              <StatCard icon={BookOpen} label="Terra Indígena" value={terraIndigena} />
              <StatCard icon={Users} label="Povo" value={escola.povos_indigenas} />
              <StatCard icon={Wifi} label="Município" value={municipio} />
            </div>

            {/* Ações */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate('/mapa', {
                  state: {
                    searchTerm: nome,
                    coordinates: escola.latitude && escola.longitude ? [escola.latitude, escola.longitude] : null,
                    highlightSchool: nome,
                    openPainel: escola.id,
                  }
                })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
              >
                <MapIcon className="w-4 h-4" />
                Ver no mapa
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>

        {/* Galeria */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-8">
            <GaleriaHorizontal escola_id={Number(id)} onOpenGaleria={() => setGaleriaOpen(true)} />
          </div>
        </div>

        {/* Nav de âncoras */}
        {navSections.length > 0 && <AnchorNav sections={navSections} />}

        {/* Conteúdo editorial */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

          <Section id="informacoes" title="Informações Básicas">
            <BasicInfo escola={escola} />
          </Section>

          <Section
            id="ensino"
            title="Modalidades e Ensino"
            show={!!(escola.modalidade_ensino || escola.numero_alunos || escola.linguas_faladas || escola.turnos_funcionamento)}
          >
            <Modalidades escola={escola} />
          </Section>

          <Section
            id="infraestrutura"
            title="Infraestrutura"
            show={!!(escola.espaco_escolar || escola.acesso_internet != null || escola.equipamentos)}
          >
            <Infraestrutura escola={escola} />
          </Section>

          <Section
            id="professores"
            title="Gestão e Professores"
            show={!!(escola.professores_indigenas || escola.professores_nao_indigenas || escola.gestao || escola.formacao_professores)}
          >
            <GestaoProfessores escola={escola} />
          </Section>

          <Section
            id="historia"
            title="História da Escola"
            show={!!escola.historia_da_escola}
          >
            <div className="prose prose-lg prose-headings:text-green-900 prose-p:text-gray-800 prose-p:leading-loose max-w-3xl">
              <HistoriaEscola escola={escola} />
            </div>
          </Section>

          <Section
            id="terra"
            title="História da Terra Indígena"
            show={!!escola.historia_terra_indigena}
          >
            <div className="prose prose-lg prose-headings:text-green-900 prose-p:text-gray-800 prose-p:leading-loose max-w-3xl">
              <HistoriaTerraIndigena escola={escola} />
            </div>
          </Section>

          <Section id="historias-professores" title="Histórias dos Professores">
            <HistoriadoProfessor escola={escola} />
          </Section>

          <Section
            id="projetos"
            title="Projetos e Parcerias"
            show={!!escola.outras_informacoes}
          >
            <ProjetosParcerias escola={escola} />
          </Section>

        </div>
      </div>

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
