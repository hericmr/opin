import React, { useState, useRef, useEffect } from "react";
import Footer from '../../components/Footer';
import { Link } from "react-router-dom";
import StaticPageMetaTags from '../../components/StaticPageMetaTags';

// Removed unused components Stat and Section

import GlobalSearch from "../../components/GlobalSearch";
export default function Homepage({ dataPoints = [] }) {
  const bgUrl = import.meta.env.BASE_URL + 'site_bg.webp';
  const textRef = useRef(null);
  const [logoWidth, setLogoWidth] = useState(null);

  useEffect(() => {
    const updateLogoWidth = () => {
      if (textRef.current) {
        setLogoWidth(textRef.current.offsetWidth);
      }
    };

    // Use requestAnimationFrame to ensure measurement happens after layout
    const rafId = requestAnimationFrame(() => {
      updateLogoWidth();
    });

    window.addEventListener('resize', updateLogoWidth);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateLogoWidth);
    };
  }, []);

  return (
    <div className="flex-1 overflow-auto bg-white text-green-900">
      <StaticPageMetaTags 
        title="OPIN – Observatório dos Professores Indígenas do Estado de São Paulo"
        description="Plataforma de dados, memória e educação sobre as escolas e professores indígenas do Estado de São Paulo."
        urlPath="/"
      />
      {/* Hero inspirado no native-land: fundo, título, busca/CTA */}
      <section className="relative min-h-screen h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${bgUrl}')` }}>
        <div className="absolute inset-0 bg-green-950/40" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-start lg:items-center h-full px-4 lg:px-12 pt-28 lg:pt-32">
          <div className="text-white" style={{ textAlign: 'left' }}>
            {/* Logo OPIN maior */}
            <div className="mb-2" style={{ width: logoWidth ? `${logoWidth}px` : 'auto', marginLeft: 0, paddingLeft: 0, textAlign: 'left' }}>
              <img
                src={`${import.meta.env.BASE_URL}logo_index.webp`}
                alt="OPIN - Observatório dos Professores Indígenas"
                className="h-20 md:h-28 lg:h-36 xl:h-44 object-contain object-left"
                style={{ width: logoWidth ? `${logoWidth}px` : 'auto', maxWidth: '100%', display: 'block', marginLeft: 0, paddingLeft: 0, marginRight: 'auto', objectPosition: 'left' }}
              />
            </div>

            {/* Slogan abaixo do logo */}
            <div className="mt-0.5" style={{ marginLeft: 0, paddingLeft: 0, textAlign: 'left' }}>
              <p
                ref={textRef}
                className="uppercase tracking-wide text-green-100 text-2xl md:text-2xl lg:text-3xl xl:text-4xl"
                style={{ fontFamily: 'PapakiloLight, sans-serif', marginLeft: 0, paddingLeft: 0, textAlign: 'left' }}
              >
                OBSERVATÓRIO DOS PROFESSORES INDÍGENAS
              </p>
            </div>
            <p className="mt-4 text-green-100/90 text-lg max-w-2xl">
              Um espaço de memória, território e educação. Histórias, escolas e experiências narradas por professores e comunidades indígenas do Estado de São Paulo.
            </p>
            <div className="mt-10 w-full max-w-4xl">
              <div className="max-w-2xl">
                <GlobalSearch dataPoints={dataPoints} />
              </div>
              
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/escolas"
                  className="rounded-full bg-[#9ce66b] text-green-950 font-bold px-5 py-3 text-center hover:bg-[#85d15a] shadow-xl shadow-green-500/10 whitespace-nowrap"
                >
                  Consultar escolas
                </Link>
                <Link
                  to="/mapa"
                  className="rounded-full bg-[#9ce66b] text-green-950 font-bold px-5 py-3 text-center hover:bg-[#85d15a] shadow-xl shadow-green-500/10 whitespace-nowrap"
                >
                  Explorar Mapa
                </Link>
                <Link
                  to="/historias"
                  className="rounded-full bg-[#9ce66b] text-green-950 font-semibold px-5 py-3 text-center hover:bg-[#85d15a] shadow-xl shadow-green-500/10 whitespace-nowrap"
                >
                  Histórias
                </Link>
                <Link
                  to="/algunsdados"
                  className="rounded-full bg-[#9ce66b] text-green-950 font-semibold px-5 py-3 text-center hover:bg-[#85d15a] shadow-xl shadow-green-500/10 whitespace-nowrap"
                >
                  Alguns dados
                </Link>
                <Link
                  to="/conteudo"
                  className="rounded-full bg-[#9ce66b] text-green-950 font-semibold px-5 py-3 text-center hover:bg-[#85d15a] shadow-xl shadow-green-500/10 whitespace-nowrap"
                >
                  Materiais Didáticos
                </Link>
                <Link
                  to="/lindiflix"
                  className="rounded-full bg-[#9ce66b] text-green-950 font-semibold px-5 py-3 text-center hover:bg-[#85d15a] shadow-xl shadow-green-500/10 whitespace-nowrap"
                >
                  Lindiflix
                </Link>
                <Link
                  to="/jogos"
                  className="rounded-full bg-[#9ce66b] text-green-950 font-semibold px-5 py-3 text-center hover:bg-[#85d15a] shadow-xl shadow-green-500/10 whitespace-nowrap"
                >
                  Jogos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}



