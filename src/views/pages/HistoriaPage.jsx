import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Share2, Scroll, Feather, BookOpen, ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import Footer from '../../components/Footer';
import { historiasSeres, secoesSeres } from '../../data/historiasSeres';
import {
  findHistoriaBySlug,
  historiaSlug,
  getProfessoresLindiflix,
  escurecerCor,
  clarearCor,
  corComAlpha,
} from '../../utils/historiasSeres';
import MiniaturasProfessores from '../../components/Historias/MiniaturasProfessores';
import '../../styles/historiasSeres.css';

const siteUrl = 'https://opin.unifesp.br';

// Créditos e dados curtos da história; com professores identificados, mostra suas fotos no lugar do ícone
const Credito = ({ icon: Icon, label, value, cor, professores = [], to = null }) => {
  if (!value) return null;
  const Container = to ? Link : 'div';
  return (
    <Container
      {...(to ? { to } : {})}
      className={`flex ${professores.length > 0 ? 'items-center' : 'items-start'} gap-3 ${to ? 'group no-underline rounded-xl -m-1.5 p-1.5 transition-colors hover:bg-white/50' : ''}`}
    >
      {professores.length > 0 ? (
        <MiniaturasProfessores professores={professores} />
      ) : (
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: corComAlpha(cor, 0.18) }}
        >
          <Icon className="w-5 h-5" style={{ color: escurecerCor(cor, 0.5) }} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] font-extrabold uppercase tracking-wider mb-0.5" style={{ color: escurecerCor(cor, 0.5) }}>
          {label}
        </p>
        <p
          className={`text-sm sm:text-base font-medium text-gray-900 leading-snug ${to ? 'underline decoration-2 underline-offset-4 group-hover:decoration-[3px]' : ''}`}
          style={to ? { textDecorationColor: corComAlpha(cor, 0.7) } : undefined}
        >
          {value}
          {to && <span aria-hidden="true" className="inline-block ml-1 transition-transform group-hover:translate-x-0.5">→</span>}
        </p>
      </div>
    </Container>
  );
};

// Barra fixa de leitura: avança conforme a pessoa lê o texto
const BarraLeitura = ({ progresso, historia }) => {
  const { tinta } = historia.cores;
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-1.5 pointer-events-none transition-opacity duration-300"
      style={{ opacity: progresso > 0.01 ? 1 : 0, backgroundColor: corComAlpha(tinta, 0.2) }}
      aria-hidden="true"
    >
      <div className="h-full" style={{ width: `${progresso * 100}%`, backgroundColor: escurecerCor(tinta, 0.75) }} />
    </div>
  );
};

// Interruptor Português / Guarani Mbya
const SeletorIdioma = ({ idioma, onChange, cor }) => (
  <div className="inline-flex p-1 rounded-full bg-white shadow-sm border" style={{ borderColor: corComAlpha(cor, 0.4) }}>
    {[
      { id: 'pt', label: 'Português' },
      { id: 'guarani', label: 'Guarani Mbya' },
    ].map((opcao) => {
      const ativo = idioma === opcao.id;
      return (
        <button
          key={opcao.id}
          type="button"
          aria-pressed={ativo}
          onClick={() => onChange(opcao.id)}
          className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
          style={ativo
            ? { backgroundColor: escurecerCor(cor, 0.55), color: '#fff' }
            : { color: escurecerCor(cor, 0.5) }}
        >
          {opcao.label}
        </button>
      );
    })}
  </div>
);

// Distribui as ilustrações ao longo do texto, uma a cada trecho de mesmo tamanho
const posicoesIlustracoes = (totalParagrafos, totalImagens) => {
  const mapa = new Map();
  for (let i = 0; i < totalImagens; i++) {
    const depoisDe = Math.min(
      totalParagrafos - 1,
      Math.max(0, Math.round(((i + 1) * totalParagrafos) / (totalImagens + 1)) - 1)
    );
    mapa.set(depoisDe, [...(mapa.get(depoisDe) || []), i]);
  }
  return mapa;
};

const HistoriaConteudo = ({ slug }) => {
  const historia = findHistoriaBySlug(slug);
  const [idioma, setIdioma] = useState('pt');
  const [progresso, setProgresso] = useState(0);
  const scrollRef = useRef(null);
  const artigoRef = useRef(null);

  // Progresso de leitura medido sobre o artigo (o scroll acontece no contêiner da página)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;
    const onScroll = () => {
      const artigo = artigoRef.current;
      if (!artigo) return;
      const inicio = artigo.offsetTop - container.clientHeight * 0.35;
      const fim = artigo.offsetTop + artigo.offsetHeight - container.clientHeight * 0.75;
      const valor = (container.scrollTop - inicio) / Math.max(1, fim - inicio);
      setProgresso(Math.min(1, Math.max(0, valor)));
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, [historia]);

  const indice = historiasSeres.findIndex((h) => h.id === historia?.id);
  const anterior = indice > 0 ? historiasSeres[indice - 1] : null;
  const proxima = indice >= 0 && indice < historiasSeres.length - 1 ? historiasSeres[indice + 1] : historiasSeres[0];
  const narradoresLindiflix = useMemo(() => getProfessoresLindiflix(historia?.narradores), [historia]);
  const escritoresLindiflix = useMemo(
    () => getProfessoresLindiflix(historia?.escritora || historia?.escritor),
    [historia]
  );

  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Histórias', path: '/historias', active: false },
    { label: historia?.subtitulo || 'História', path: `/historia/${slug}`, active: true },
  ], [historia, slug]);

  if (!historia) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffdf7]">
        <div className="text-center max-w-md px-4">
          <p className="text-2xl font-bold text-gray-800 mb-2">História não encontrada</p>
          <p className="text-gray-500 mb-6">Talvez esse ser tenha se transformado em outra coisa…</p>
          <Link to="/historias" className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-600 transition-colors no-underline">
            <ArrowLeft className="w-4 h-4" />
            Ver todas as histórias
          </Link>
        </div>
      </div>
    );
  }

  const { fundo, tinta } = historia.cores;
  const tintaEscura = escurecerCor(tinta, 0.5);
  const paragrafos = idioma === 'pt' ? historia.texto_pt : historia.texto_guarani;
  // O título em destaque acompanha o idioma escolhido; o outro fica logo abaixo
  const tituloPrincipal = idioma === 'pt' ? historia.subtitulo : historia.titulo;
  const tituloSecundario = idioma === 'pt' ? historia.titulo : historia.subtitulo;
  const secaoGuarani = secoesSeres.find((s) => s.titulo === historia.secao)?.tituloGuarani;
  const secao = idioma === 'pt' ? historia.secao : secaoGuarani || historia.secao;
  // A ilustração de abertura vai no topo e também no texto, junto com as demais
  const ilustracoes = historia.imagens || [];
  const capa = ilustracoes[0];
  const posicoes = posicoesIlustracoes(paragrafos.length, ilustracoes.length);
  const ogDescription = `${historia.titulo} – uma história do tempo das transformações, quando todos os seres se comunicavam na mesma linguagem e se reconheciam como gente.`;

  const handleShare = () => {
    const url = `${siteUrl}/historia/${slug}`;
    if (navigator.share) navigator.share({ title: historia.subtitulo, url });
    else navigator.clipboard?.writeText(url);
  };

  return (
    <div ref={scrollRef} className="min-h-screen dashboard-scroll relative" style={{ backgroundColor: clarearCor(fundo, 0.35) }}>
      <Helmet>
        <title>{historia.subtitulo} – OPIN</title>
        <meta name="description" content={ogDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${siteUrl}/historia/${slug}`} />
        <meta property="og:title" content={`${historia.subtitulo} – OPIN`} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={`${siteUrl}${capa || '/hero_grayscale.webp'}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <BarraLeitura progresso={progresso} historia={historia} />

      <PageHeader
        showNavbar={true}
        overlayColor={corComAlpha(escurecerCor(tinta, 0.45), 0.8)}
        blendMode="normal"
        backgroundImage={capa}
        navbarOnly={true}
      />

      <div className="px-6 pt-5 sm:pt-6" style={{ backgroundColor: fundo }}>
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} cor={tintaEscura} />
      </div>

      {/* Palco do ser: créditos e o personagem */}
      <section className="relative overflow-hidden" style={{ backgroundColor: fundo }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-10 sm:py-14 grid gap-10 md:grid-cols-[1fr_auto] items-center">
          <div className="min-w-0">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] mb-6" style={{ color: tintaEscura }}>
              {secao}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <Credito icon={Scroll} label="Narrada por" value={historia.narradores} cor={tinta} professores={narradoresLindiflix} />
              <Credito icon={Feather} label="Escrita por" value={historia.escritora || historia.escritor} cor={tinta} professores={escritoresLindiflix} />
              <Credito icon={BookOpen} label="Livro completo" value="No tempo das transformações – Nhembojeraa jypy" cor={tinta} to="/conteudo" />
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 text-gray-800 text-sm font-semibold border transition-transform hover:rotate-1 hover:scale-105"
                style={{ borderColor: corComAlpha(tinta, 0.5) }}
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </div>
          <div className="relative flex items-center justify-center w-full md:w-[340px] h-64 sm:h-72 md:h-80">
            <span aria-hidden="true" className="ser-mancha absolute w-56 h-56 sm:w-64 sm:h-64" style={{ backgroundColor: tinta }} />
            <img
              src={historia.iconUrl}
              alt={`Ilustração do ser da história ${historia.subtitulo}`}
              className="ser-flutua relative max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Texto da história */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-12 sm:py-16">
        <div className="max-w-[78ch] mx-auto flex justify-center mb-8">
          <SeletorIdioma idioma={idioma} onChange={setIdioma} cor={tinta} />
        </div>

        {/* Título no idioma escolhido, com o outro logo abaixo */}
        <header className="max-w-[78ch] mx-auto text-center mb-10">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight"
            style={{ fontFamily: "'Sora', sans-serif", color: escurecerCor(tinta, 0.55) }}
          >
            {tituloPrincipal}
          </h1>
          <p
            lang={idioma === 'pt' ? 'gun' : 'pt-BR'}
            className="mt-3 text-2xl sm:text-3xl italic font-semibold leading-tight"
            style={{ color: escurecerCor(tinta, 0.4) }}
          >
            {tituloSecundario}
          </p>
        </header>

        <article ref={artigoRef} lang={idioma === 'pt' ? 'pt-BR' : 'gun'}>
          {paragrafos.map((paragrafo, index) => {
            const texto = paragrafo.trim();
            const isDialogo = texto.startsWith('—') || texto.startsWith('“') || texto.startsWith('"');
            const imagensAqui = posicoes.get(index) || [];
            return (
              <React.Fragment key={`${idioma}-${index}`}>
                <div className="max-w-[78ch] mx-auto">
                  {index === 0 && !isDialogo ? (
                    <p className="text-lg sm:text-xl leading-[1.85] text-gray-800 mb-6">
                      <span
                        className="float-left text-6xl sm:text-7xl font-black leading-[0.85] mr-3 mt-1 select-none"
                        style={{ color: escurecerCor(tinta, 0.6), fontFamily: "'Sora', sans-serif" }}
                      >
                        {texto.charAt(0)}
                      </span>
                      {texto.slice(1)}
                    </p>
                  ) : (
                    <p
                      className={`text-lg sm:text-xl leading-[1.85] mb-6 ${isDialogo ? 'italic pl-5 py-2 rounded-r-2xl' : 'text-gray-800'}`}
                      style={isDialogo
                        ? { borderLeft: `4px solid ${tinta}`, backgroundColor: corComAlpha(fundo, 0.6), color: escurecerCor(tinta, 0.35) }
                        : undefined}
                    >
                      {texto}
                    </p>
                  )}
                </div>

                {imagensAqui.map((imgIdx) => (
                  <figure key={`img-${imgIdx}`} className="my-12 sm:my-16 max-w-4xl mx-auto">
                    <div
                      className="ser-pagina p-3 sm:p-4 rounded-lg"
                      style={{
                        backgroundColor: fundo,
                        transform: `rotate(${imgIdx % 2 === 0 ? -1.2 : 1.2}deg)`,
                      }}
                    >
                      <img
                        src={ilustracoes[imgIdx]}
                        alt={`Ilustração ${imgIdx + 1} da história ${historia.subtitulo}`}
                        loading="lazy"
                        className="w-full h-auto rounded block"
                      />
                    </div>
                  </figure>
                ))}
              </React.Fragment>
            );
          })}
        </article>

        {/* História anterior e próxima: o ser de cada uma espia por baixo do card */}
        <nav
          className={`max-w-4xl mx-auto mt-20 grid gap-4 items-stretch ${anterior ? 'sm:grid-cols-2' : 'sm:grid-cols-[auto_1fr]'}`}
          aria-label="Navegação entre histórias"
        >
          {anterior ? (
            <Link
              to={`/historia/${historiaSlug(anterior)}`}
              className="ser-proxima relative overflow-hidden flex items-center justify-between gap-4 pl-4 pr-6 py-5 rounded-3xl no-underline"
              style={{ backgroundColor: anterior.cores.fundo }}
            >
              <img src={anterior.iconUrl} alt="" className="ser-espia ser-espia-esquerda h-24 sm:h-28 w-auto object-contain shrink-0 self-end -mb-5" />
              <div className="min-w-0 relative z-10 text-right">
                <p className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: escurecerCor(anterior.cores.tinta, 0.5) }}>
                  História anterior
                </p>
                <p className="text-lg sm:text-xl font-bold leading-tight" style={{ color: escurecerCor(anterior.cores.tinta, 0.4) }}>
                  {idioma === 'pt' ? anterior.subtitulo : anterior.titulo}
                </p>
              </div>
            </Link>
          ) : (
            <Link
              to="/historias"
              className="flex items-center gap-2 px-5 py-4 rounded-3xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors no-underline"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              Todas as histórias
            </Link>
          )}
          <Link
            to={`/historia/${historiaSlug(proxima)}`}
            className="ser-proxima relative overflow-hidden flex items-center justify-between gap-4 pl-6 pr-4 py-5 rounded-3xl no-underline"
            style={{ backgroundColor: proxima.cores.fundo }}
          >
            <div className="min-w-0 relative z-10">
              <p className="text-xs font-extrabold uppercase tracking-wider mb-1" style={{ color: escurecerCor(proxima.cores.tinta, 0.5) }}>
                Próxima história
              </p>
              <p className="text-lg sm:text-xl font-bold leading-tight" style={{ color: escurecerCor(proxima.cores.tinta, 0.4) }}>
                {idioma === 'pt' ? proxima.subtitulo : proxima.titulo}
              </p>
            </div>
            <img src={proxima.iconUrl} alt="" className="ser-espia h-24 sm:h-28 w-auto object-contain shrink-0 self-end -mb-5" />
          </Link>
        </nav>
      </main>

      <Footer />
    </div>
  );
};

// key={slug}: trocar de história remonta a página, que volta ao topo,
// ao português e ao progresso zero
const HistoriaPage = () => {
  const { slug } = useParams();
  return <HistoriaConteudo key={slug} slug={slug} />;
};

export default HistoriaPage;
