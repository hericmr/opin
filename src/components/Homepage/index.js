import React from "react";
import { Link } from "react-router-dom";

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-green-900">{value}</div>
    <div className="text-sm md:text-base text-green-800/80">{label}</div>
  </div>
);

const Section = ({ title, children, className = "" }) => (
  <section className={`py-12 md:py-16 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 lg:px-16">
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-6 md:mb-8">{title}</h2>
      )}
      {children}
    </div>
  </section>
);

export default function Homepage() {
  const bgUrl = (process.env.PUBLIC_URL || '') + '/site_bg.png';
  return (
    <div className="flex-1 overflow-auto bg-white text-green-900">
      {/* Hero inspirado no native-land: fundo, título, busca/CTA */}
      <section className="relative min-h-screen h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${bgUrl}')` }}>
        <div className="absolute inset-0 bg-green-950/40" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-start lg:items-center h-full px-4 lg:px-12">
          <div className="pt-28 lg:pt-0 text-white">
            <h1 className="text-6xl md:text-8xl lg:text-9xl leading-tight mt-2 font-papakilo">OPIN</h1>
            <p className="uppercase tracking-wide text-green-100 text-sm">Observatório dos Professores Indígenas do estado de São Paulo</p>
            <p className="mt-4 text-green-100/90 text-lg max-w-2xl">
              Um espaço dedicado a valorizar as histórias, os territórios e as escolas indígenas, contados pelos próprios professores e comunidades indígenas de São Paulo.
            </p>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-6 gap-3 w-full">
              <div className="col-span-1 lg:col-span-4">
                <div className="rounded-full bg-white/90 border border-green-200 px-4 py-2 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2619 15.0766 18.0303 16.6162L21.707 20.293C22.0975 20.6835 22.0975 21.3166 21.707 21.707C21.3166 22.0975 20.6835 22.0975 20.293 21.707L16.6162 18.0303C15.0766 19.2619 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2ZM11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4Z" fill="#134E4A"></path></svg>
                  <input placeholder="Pesquisar escolas, territórios..." className="w-full bg-transparent outline-none text-green-900 placeholder:text-green-800/60" />
                </div>
              </div>
              <div className="col-span-1 lg:col-span-2">
                <Link to="/mapa" className="block rounded-full bg-green-500 text-green-950 font-semibold px-4 py-2.5 text-center hover:bg-green-400 transition">
                  Explorar Mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      

      

      

      
      
    </div>
  );
}




