import React, { useState, useEffect, useRef, useMemo } from 'react';
import Footer from '../../components/Footer'; // useState/useEffect usados no VideoCard
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import PageDescription from '../../components/PageDescription';
import professoresData from '../../data/professores.json';

const rawBaseUrl = process.env.PUBLIC_URL || import.meta.env.BASE_URL || '/opin';
const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

function VideoCard({ professor }) {
  const iframeRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!iframeRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { rootMargin: '200px' }
    );
    observer.observe(iframeRef.current);
    return () => observer.disconnect();
  }, []);

  const nome = professor.professor || professor.professora || 'Professor(a)';
  const imgSrc = professor.imagem
    ? `${baseUrl}/lindiflix_fotos/${professor.imagem.replace('fotos/', '')}`
    : `${baseUrl}/lindiflix_fotos/default.jpeg`;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Info do professor */}
      <div className="flex items-center gap-3 p-4 bg-[#215A36]/5 border-b border-[#215A36]/10">
        <img
          src={imgSrc}
          alt={`Foto de ${nome}`}
          loading="lazy"
          className="w-28 h-28 rounded-full object-cover border-2 border-[#215A36]/30 flex-shrink-0"
          onError={(e) => { e.target.src = `${baseUrl}/lindiflix_fotos/default.jpeg`; }}
        />
        <div className="min-w-0">
          <p className="font-semibold text-[#215A36] text-sm truncate">{nome}</p>
          {professor.aldeia && (
            <p className="text-xs text-gray-500 truncate">{professor.aldeia}</p>
          )}
          {professor.povo && (
            <p className="text-xs text-gray-400 truncate">{professor.povo}</p>
          )}
        </div>
      </div>

      {/* Vídeo */}
      <div ref={iframeRef} className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {visible && professor.youtube ? (
          <iframe
            src={professor.youtube}
            title={`Vídeo de ${nome}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 bg-[#215A36]/10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#215A36]/30 border-t-[#215A36] rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

const Lindiflix = () => {
  const professores = useMemo(
    () => professoresData.filter((p) => p.nome && (p.youtube || p.professor || p.professora)),
    []
  );

  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Lindiflix', path: '/lindiflix', active: true },
  ], []);

  const siteUrl = 'https://hericmr.github.io/opin';

  return (
    <div className="min-h-screen dashboard-scroll relative bg-gray-50/30">
      <Helmet>
        <title>Lindiflix – Das crianças e jovens das Aldeias de São Paulo para o mundo!</title>
        <meta name="description" content="Plataforma que reúne os vídeos produzidos por estudantes da LINDI, onde crianças e jovens compartilham suas aldeias, culturas e modos de viver." />
        <meta property="og:title" content="Lindiflix – Das crianças e jovens das Aldeias de São Paulo para o mundo!" />
        <meta property="og:url" content={`${siteUrl}/lindiflix`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <PageHeader
        title="Lindiflix"
        logoImage={`${baseUrl}/lindiflix_logo.png`}
        showNavbar={true}
        dataPoints={[]}
        overlayColor="rgba(120, 60, 160, 0.75)"
        blendMode="normal"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <div className="relative z-10 pb-20">
        {/* Descrição */}
        <PageDescription centered>
          Esta página reúne alguns dos trabalhos produzidos pelos estudantes da Licenciatura Intercultural Indígena da UNIFESP - são vídeos em que as próprias crianças das aldeias mostram o seu cotidiano, conhecimentos, brincadeiras e comunidades. Um convite para conhecer a diversidade dos povos originários de São Paulo.
        </PageDescription>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid de vídeos */}
          {professores.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Nenhum vídeo encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {professores.map((prof, i) => (
                <VideoCard key={prof.nome + i} professor={prof} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Lindiflix;
