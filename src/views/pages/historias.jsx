import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StaticPageMetaTags from '../../components/StaticPageMetaTags';
import { Search, X, Scroll, Feather, ChevronDown } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DashboardBreadcrumbs from '../../components/Dashboard/DashboardBreadcrumbs';
import Footer from '../../components/Footer';
import { historiasSeres, secoesSeres, introducaoLivro } from '../../data/historiasSeres';
import { historiaSlug, localDaHistoria, escurecerCor, getProfessoresLindiflix } from '../../utils/historiasSeres';
import MiniaturasProfessores from '../../components/Historias/MiniaturasProfessores';
import '../../styles/historiasSeres.css';

const normalizar = (texto = '') =>
  texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Linha de crédito do card: fotos dos professores do Lindiflix ou, sem elas, um ícone
const CreditoCard = ({ icon: Icon, label, value, tinta }) => {
  const professores = useMemo(() => getProfessoresLindiflix(value), [value]);
  if (!value) return null;
  return (
    <div className="flex items-center gap-2">
      {professores.length > 0 ? (
        <MiniaturasProfessores professores={professores} tamanho="pequena" />
      ) : (
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: escurecerCor(tinta, 0.5) }} />
      )}
      <span className="line-clamp-2">
        <span className="font-bold">{label}</span> {value}
      </span>
    </div>
  );
};

// Card de uma história: fundo com a paleta da ilustração e o ser flutuando
const HistoriaCard = ({ historia, index, idioma }) => {
  const { fundo, tinta } = historia.cores;
  const tituloPrincipal = idioma === 'pt' ? historia.subtitulo : historia.titulo;
  const tituloSecundario = idioma === 'pt' ? historia.titulo : historia.subtitulo;

  return (
    <Link
      to={`/historia/${historiaSlug(historia)}`}
      className="ser-card relative flex flex-col h-full rounded-2xl overflow-hidden no-underline"
      style={{ backgroundColor: fundo, '--ser-tinta': tinta }}
    >
      <div className="relative h-56 sm:h-60 flex items-center justify-center px-6 pt-6">
        {/* Mancha de cor atrás do ser */}
        <span
          aria-hidden="true"
          className="ser-mancha absolute w-40 h-40 sm:w-44 sm:h-44"
          style={{ backgroundColor: tinta, animationDelay: `${index * -0.7}s` }}
        />
        <img
          src={historia.iconUrl}
          alt=""
          loading="lazy"
          className="ser-flutua relative max-h-full max-w-[85%] object-contain"
          style={{ animationDelay: `${index * -0.45}s` }}
        />
      </div>

      <div className="relative flex-1 flex flex-col px-6 pb-6 pt-4">
        <h3
          className="text-xl sm:text-2xl font-bold leading-tight mb-1"
          style={{ color: escurecerCor(tinta, 0.45) }}
        >
          {tituloPrincipal}
        </h3>
        <p className="text-sm italic mb-4" style={{ color: escurecerCor(tinta, 0.6) }}>
          {tituloSecundario}
        </p>
        <div className="mt-auto space-y-2 text-xs text-gray-700 pr-12">
          <CreditoCard icon={Scroll} label="Narrada por" value={historia.narradores} tinta={tinta} />
          <CreditoCard icon={Feather} label="Escrita por" value={historia.escritora || historia.escritor} tinta={tinta} />
        </div>
        <span
          className="ser-ler absolute right-5 bottom-5 rounded-full px-3 py-1 text-xs font-bold text-white"
          style={{ backgroundColor: escurecerCor(tinta, 0.55) }}
        >
          Ler →
        </span>
      </div>
    </Link>
  );
};

// Abertura do livro: mostra o primeiro parágrafo e expande para a introdução completa
const Introducao = ({ idioma, setIdioma }) => {
  const [aberta, setAberta] = useState(false);
  const paragrafos = idioma === 'pt' ? introducaoLivro.texto_pt : introducaoLivro.texto_guarani;
  const visiveis = aberta ? paragrafos : paragrafos.slice(0, 1);

  return (
    <div className="text-left">
      <div className="flex justify-center mb-4">
        <div className="inline-flex p-0.5 rounded-full bg-white border border-emerald-800/20 text-xs">
          {[
            { id: 'pt', label: 'Português' },
            { id: 'guarani', label: 'Guarani Mbya' },
          ].map((opcao) => (
            <button
              key={opcao.id}
              type="button"
              aria-pressed={idioma === opcao.id}
              onClick={() => setIdioma(opcao.id)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                idioma === opcao.id ? 'bg-[#215A36] text-white' : 'text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              {opcao.label}
            </button>
          ))}
        </div>
      </div>

      <div id="introducao-livro" lang={idioma === 'pt' ? 'pt-BR' : 'gun'}>
        {visiveis.map((paragrafo, index) => (
          <p key={`${idioma}-${index}`} className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 last:mb-0">
            {paragrafo}
          </p>
        ))}
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          aria-expanded={aberta}
          aria-controls="introducao-livro"
          onClick={() => setAberta(!aberta)}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold text-[#215A36] border border-[#215A36]/30 bg-white hover:bg-emerald-50 transition-colors"
        >
          {aberta ? 'Ler menos' : 'Ler mais'}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${aberta ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

const HistoriasList = () => {
  const [busca, setBusca] = useState('');
  // Idioma da introdução e dos títulos dos cards
  const [idioma, setIdioma] = useState('pt');

  const breadcrumbs = useMemo(() => [
    { label: 'Início', path: '/', active: false },
    { label: 'Histórias', path: '/historias', active: true },
  ], []);

  const historiasFiltradas = useMemo(() => {
    if (!busca) return historiasSeres;
    const termo = normalizar(busca);
    return historiasSeres.filter((h) => {
      const local = localDaHistoria(h);
      const alvo = [h.subtitulo, h.titulo, h.narradores, h.escritora, local?.nome].join(' ');
      return normalizar(alvo).includes(termo);
    });
  }, [busca]);

  // Índice global para dessincronizar as animações dos seres
  let indiceCard = 0;

  return (
    <div className="min-h-screen dashboard-scroll relative bg-[#fffdf7] flex flex-col">
      <StaticPageMetaTags
        title="Histórias – OPIN"
        description="No tempo das transformações: histórias que se passaram nos tempos de origem, quando todos os seres se comunicavam na mesma linguagem e se reconheciam como gente."
        urlPath="/historias"
      />

      <PageHeader
        title="Histórias"
        showNavbar={true}
        overlayColor="rgba(166, 116, 255, 0.85)"
        blendMode="multiply"
        titlePosition="center"
        backgroundImage="/seres-transformações/pagina_93_img_1.webp"
        backgroundPosition="center 15%"
        desktopBackgroundPosition="center 25%"
      >
        <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
      </PageHeader>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-20">
        {/* Apresentação do livro */}
        <section className="relative max-w-3xl mx-auto text-center mb-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-800 mb-3">
            {idioma === 'pt' ? 'Nhembojeraa jypy' : 'No tempo das transformações'}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
            {idioma === 'pt' ? 'No tempo das transformações' : 'Nhembojeraa jypy'}
          </h2>
          <Introducao idioma={idioma} setIdioma={setIdioma} />
        </section>

        {/* Busca */}
        <div className="max-w-2xl mx-auto relative mb-14">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Procure um ser, uma história, uma aldeia ou quem contou..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="block w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 sm:text-base shadow-sm transition-all duration-200"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca('')}
              aria-label="Limpar busca"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {historiasFiltradas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhuma história encontrada.</p>
          </div>
        ) : (
          secoesSeres.map((secao, secaoIdx) => {
            const historias = historiasFiltradas.filter((h) => h.secao === secao.titulo);
            if (historias.length === 0) return null;
            return (
              <section key={secao.titulo} className="mb-16 last:mb-0">
                <div className="flex items-end gap-4 mb-8">
                  <span className="text-6xl sm:text-7xl font-black leading-none text-emerald-800/15 select-none">
                    {secaoIdx + 1}
                  </span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                      {idioma === 'pt' ? secao.titulo : secao.tituloGuarani}
                    </h2>
                    <p className="text-sm italic text-emerald-800 mt-1">
                      {idioma === 'pt' ? secao.tituloGuarani : secao.titulo}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {historias.map((historia) => (
                    <HistoriaCard key={historia.id} historia={historia} index={indiceCard++} idioma={idioma} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistoriasList;
