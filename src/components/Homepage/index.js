import React from "react";
import { Link } from "react-router-dom";

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-green-900">{value}</div>
    <div className="text-sm md:text-base text-green-800/80">{label}</div>
  </div>
);

const Section = ({ title, children, className = "" }) => (
  <section className={`py-10 md:py-16 ${className}`}>
    <div className="max-w-6xl mx-auto px-4">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-6 md:mb-8">{title}</h2>
      )}
      {children}
    </div>
  </section>
);

export default function Homepage() {
  return (
    <div className="flex-1 overflow-auto bg-green-50 text-green-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-100 to-green-50">
        <div className="max-w-6xl mx-auto px-4 pt-12 md:pt-20 pb-10 md:pb-14 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <p className="uppercase tracking-wide text-green-800/80 text-sm mb-2">Observatório dos Professores Indígenas</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-green-950">
              Conheça as terras, escolas e histórias dos professores indígenas
            </h1>
            <p className="mt-4 text-green-800/90 md:text-lg">
              Um espaço para explorar territórios, dados e materiais didáticos, fortalecendo vínculos
              com os povos indígenas e seus territórios.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/mapa" className="px-5 py-3 bg-green-800 text-white rounded-md hover:bg-green-900 transition">
                Explorar o mapa
              </Link>
              <Link to="/conteudo" className="px-5 py-3 bg-white text-green-900 border border-green-300 rounded-md hover:bg-green-100 transition">
                Ver materiais
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl bg-white/70 border border-green-200 shadow-sm flex items-center justify-center">
              <img src="/opin.png" alt="OPIN" className="max-h-52 md:max-h-64 object-contain p-6" />
            </div>
          </div>
        </div>
        <div className="border-t border-green-200/80">
          <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-5 gap-6">
            <Stat value="100M+" label="visitantes" />
            <Stat value="4K+" label="nações mapeadas" />
            <Stat value="20M+" label="chamadas à API" />
            <Stat value="10K+" label="diálogos" />
            <Stat value="60M+" label="formas compartilhadas" />
          </div>
        </div>
      </section>

      {/* Missão */}
      <Section title="Nossa missão">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-5 bg-white rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-semibold text-lg">Mapeamento</h3>
            <p className="mt-2 text-green-800/90">
              Mapeamos territórios, escolas e dados com foco em representações que respeitam as visões dos povos indígenas.
            </p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-semibold text-lg">Comunidade</h3>
            <p className="mt-2 text-green-800/90">
              Conectamos comunidades e colaboradores para construir conhecimento vivo e em constante atualização.
            </p>
          </div>
          <div className="p-5 bg-white rounded-lg border border-green-200 shadow-sm">
            <h3 className="font-semibold text-lg">Educação</h3>
            <p className="mt-2 text-green-800/90">
              Oferecemos recursos didáticos para apoiar o ensino e promover consciência territorial no cotidiano.
            </p>
          </div>
        </div>
      </Section>

      {/* Mapas / Explorar */}
      <Section title="Nossos mapas" className="bg-green-100/50 border-y border-green-200/70">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-5 bg-white rounded-lg border border-green-200 shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Mapa OPIN</h3>
              <p className="mt-2 text-green-800/90">
                Explore escolas, territórios e dados relacionados aos professores indígenas.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/mapa" className="inline-block px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 transition">
                Abrir mapa
              </Link>
            </div>
          </div>
          <div className="p-5 bg-white rounded-lg border border-green-200 shadow-sm flex flex-col">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Materiais didáticos</h3>
              <p className="mt-2 text-green-800/90">
                Acesse materiais, referências e conteúdos produzidos com e para as comunidades.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/conteudo" className="inline-block px-4 py-2 bg-white text-green-900 border border-green-300 rounded-md hover:bg-green-100 transition">
                Ver conteúdos
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Parceiros */}
      <Section title="Parceiros" className="">
        <div className="flex flex-wrap items-center gap-8 opacity-90">
          <img src="/lindi.svg" alt="LINDI" className="h-10" />
          <img src="/logo.webp" alt="OPIN" className="h-10" />
          <img src="/onca.svg" alt="Parceiro" className="h-10" />
          <img src="/passaro.svg" alt="Parceiro" className="h-10" />
        </div>
      </Section>

      {/* Aviso / Referência */}
      <Section className="pt-0">
        <div className="text-sm text-green-800/80">
          Inspirado em "Native Land Digital" — mapas, missão e seções públicas.
          Consulte a página original para conhecer o projeto: <a className="underline hover:text-green-900" href="https://native-land.ca/" target="_blank" rel="noreferrer">native-land.ca</a>.
        </div>
      </Section>
    </div>
  );
}




