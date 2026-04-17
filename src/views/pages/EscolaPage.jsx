import React, { useMemo, useState, useLayoutEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Map as MapIcon, Users, BookOpen, Wifi, Share2, MapPin,
  Calendar, Building2, Languages, GraduationCap, Laptop,
  TreePine, UserCheck, School, CheckCircle,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import Footer from '../../components/Footer';
import { useEscolaDetalhes } from '../../hooks/useEscolaDetalhes';
import { useEscolasData } from '../../hooks/useEscolasData';
import HistoriaEscola from '../../components/PainelInformacoes/components/EscolaInfo/HistoriaEscola';
import HistoriaTerraIndigena from '../../components/PainelInformacoes/components/EscolaInfo/HistoriaTerraIndigena';
import HistoriadoProfessor from '../../components/PainelInformacoes/components/EscolaInfo/HistoriadoProfessor';
import GaleriaHorizontal from '../../components/PainelInformacoes/components/GaleriaHorizontal';
import GaleriaPanel from '../../components/PainelInformacoes/components/GaleriaPanel';
import { idFromEscolaSlug, escolaUrlSlug } from '../../utils/slug';

const siteUrl = 'https://hericmr.github.io/opin';

// Seção com âncora — oculta se show=false ou conteúdo vazio
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

// Card individual de dado — searchTag torna o valor um link para busca
const DataCard = ({ icon: Icon, label, value, wide = false, searchTag = false }) => {
  if (value === null || value === undefined || value === '' || value === false) return null;
  const displayValue = value === true ? 'Sim' : value;
  return (
    <div className={`bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-start gap-4 ${wide ? 'col-span-2' : ''}`}>
      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-green-700" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
        {searchTag ? (
          <Link
            to={`/search?q=${encodeURIComponent(displayValue)}`}
            className="text-base font-semibold text-green-700 hover:text-green-900 hover:underline leading-snug whitespace-pre-line"
          >
            {displayValue}
          </Link>
        ) : (
          <p className="text-base font-semibold text-gray-900 leading-snug whitespace-pre-line">{displayValue}</p>
        )}
      </div>
    </div>
  );
};

// Grupo de cards
const CardGroup = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {children}
  </div>
);

// Mini-mapa via iframe OpenStreetMap
const MiniMapa = ({ lat, lon, nome }) => {
  if (!lat || !lon) return null;
  const delta = 0.04;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 h-64 w-full">
      <iframe
        title={`Localização de ${nome}`}
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

// Nav de âncoras sticky
const AnchorNav = ({ sections }) => {
  const [active, setActive] = useState(sections[0]?.id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="flex items-center gap-1 overflow-x-auto py-0" style={{ scrollbarWidth: 'none' }}>
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                active === id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'
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

  const navSections = useMemo(() => {
    if (!escola) return [];
    const s = [];
    if (escola.historia_da_escola) s.push({ id: 'historia', label: 'História' });
    if (escola.historia_terra_indigena) s.push({ id: 'terra', label: 'Terra Indígena' });
    s.push({ id: 'historias-professores', label: 'Histórias' });
    s.push({ id: 'relacionadas', label: 'Outras escolas' });
    return s;
  }, [escola]);

  const escolasRelacionadas = useMemo(() => {
    if (!terraIndigena || !dataPoints) return [];
    return dataPoints
      .filter(p => p.terra_indigena === terraIndigena && p.id !== escola?.id)
      .slice(0, 6);
  }, [terraIndigena, dataPoints, escola]);

  const ogDescription = `Escola indígena ${nome}${municipio ? ` em ${municipio}` : ''}${terraIndigena ? `, Terra Indígena ${terraIndigena}` : ''}.`;

  const handleShare = () => {
    const url = `${siteUrl}/escola/${slug}`;
    if (navigator.share) navigator.share({ title: nome, url });
    else navigator.clipboard?.writeText(url);
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

        {/* Sumário + ações */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Campos curtos — identificação */}
              <DataCard icon={MapPin} label="Município" value={escola.municipio} searchTag />
              <DataCard icon={TreePine} label="Terra Indígena" value={escola.terra_indigena} searchTag />
              <DataCard icon={Users} label="Povos Indígenas" value={escola.povos_indigenas} searchTag />
              <DataCard icon={Languages} label="Línguas Faladas" value={escola.linguas_faladas} searchTag />
              <DataCard icon={Building2} label="Diretoria de Ensino" value={escola.diretoria_ensino} />
              <DataCard icon={Calendar} label="Ano de Criação" value={escola.ano_criacao} />
              {/* Endereço longo — ocupa 2 colunas, terceira coluna livre para modo de acesso */}
              <DataCard icon={MapPin} label="Endereço" value={escola.endereco} wide />
              <DataCard icon={MapPin} label="Modo de Acesso" value={escola.modo_acesso} />
              {/* Campos curtos — ensino */}
              <DataCard icon={Users} label="Número de Alunos" value={escola.numero_alunos} />
              <DataCard icon={School} label="Turnos de Funcionamento" value={escola.turnos_funcionamento} />
              <DataCard icon={CheckCircle} label="PPP com a Comunidade" value={escola.ppp_comunidade} />
              <DataCard icon={BookOpen} label="Material Pedagógico Indígena" value={escola.material_indigena} />
              <DataCard icon={BookOpen} label="Material Pedagógico Não Indígena" value={escola.material_nao_indigena} />
              {/* Modalidades — texto longo, ocupa 2 colunas */}
              <DataCard icon={BookOpen} label="Modalidades de Ensino" value={escola.modalidade_ensino} wide />
              {/* Campos curtos — infraestrutura */}
              <DataCard icon={Wifi} label="Acesso à Internet" value={escola.acesso_internet} />
              <DataCard icon={Laptop} label="Equipamentos Tecnológicos" value={escola.equipamentos} />
              <DataCard icon={School} label="Salas Vinculadas" value={escola.salas_vinculadas} />
              <DataCard icon={CheckCircle} label="Acesso à Água" value={escola.acesso_agua} />
              <DataCard icon={CheckCircle} label="Coleta de Lixo" value={escola.coleta_lixo} />
              {/* Espaço escolar — texto longo, ocupa 2 colunas */}
              <DataCard icon={Building2} label="Espaço Escolar" value={escola.espaco_escolar} wide />
              {/* Campos curtos — professores */}
              <DataCard icon={UserCheck} label="Professores Indígenas" value={escola.professores_indigenas} />
              <DataCard icon={UserCheck} label="Professores Não Indígenas" value={escola.professores_nao_indigenas} />
              <DataCard icon={Building2} label="Gestão" value={escola.gestao} />
              {/* Campos longos — formação e funcionários */}
              <DataCard icon={GraduationCap} label="Formação dos Professores" value={escola.formacao_professores} wide />
              <DataCard icon={GraduationCap} label="Formação Continuada" value={escola.formacao_continuada} wide />
              <DataCard icon={Users} label="Outros Funcionários" value={escola.outros_funcionarios} wide />
              {/* Projetos e parcerias */}
              <DataCard icon={CheckCircle} label="Parcerias com Universidades" value={escola.parcerias_universidades} />
              <DataCard icon={Users} label="Ações com ONGs" value={escola.acoes_ongs} />
              <DataCard icon={GraduationCap} label="Projetos em Andamento" value={escola.projetos_andamento} wide />
              <DataCard icon={BookOpen} label="Outras Informações" value={escola.outras_informacoes} wide />
              <DataCard icon={BookOpen} label="Desejos da Comunidade" value={escola.desejos_comunidade} wide />
            </div>
            {/* Mini-mapa */}
            {escola.latitude && escola.longitude && (
              <div className="mt-3">
                <MiniMapa lat={escola.latitude} lon={escola.longitude} nome={nome} />
              </div>
            )}
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

        {/* Nav âncoras */}
        {navSections.length > 0 && <AnchorNav sections={navSections} />}

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">

          {/* História da Escola */}
          <Section id="historia" title="História da Escola" show={!!escola.historia_da_escola}>
            <HistoriaEscola escola={escola} />
          </Section>

          {/* História da Terra Indígena */}
          <Section id="terra" title="História da Terra Indígena" show={!!escola.historia_terra_indigena}>
            <HistoriaTerraIndigena escola={escola} />
          </Section>

          {/* Histórias dos Professores */}
          <Section id="historias-professores" title="Histórias dos Professores">
            <HistoriadoProfessor escola={escola} />
          </Section>

          {/* Escolas relacionadas */}
          {escolasRelacionadas.length > 0 && (
            <section id="relacionadas" className="py-12 scroll-mt-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                Outras escolas na Terra Indígena {terraIndigena}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {escolasRelacionadas.map(p => (
                  <Link
                    key={p.id}
                    to={`/escola/${escolaUrlSlug(p.id, p.titulo || p.nome)}`}
                    className="bg-white rounded-xl border border-gray-100 hover:border-green-300 px-5 py-4 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <School className="w-4 h-4 text-green-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700 leading-snug">{p.titulo || p.nome}</p>
                      {p.municipio && <p className="text-xs text-gray-400 mt-0.5">{p.municipio}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Nota de fonte */}
          <div className="py-8 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Dados coletados em pesquisa de campo pela equipe OPIN / UNIFESP. Informações podem estar desatualizadas.
          </div>

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
