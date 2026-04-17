import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-zinc-900 text-zinc-300 mt-auto">
    <div className="max-w-6xl mx-auto px-6 py-14 sm:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Logo + descrição */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-4 flex-wrap">
            <img
              src={`${import.meta.env.BASE_URL || '/opin'}/logo.webp`}
              alt="OPIN"
              className="h-12 w-auto"
            />
            <img
              src={`${import.meta.env.BASE_URL || '/opin'}/lindi.svg`}
              alt="LINDI"
              className="h-20 w-auto"
            />
          </div>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Observatório dos Professores Indígenas de São Paulo. Um projeto do{' '}
            <a
              href="https://www.unifesp.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              LINDI/UNIFESP
            </a>
            .
          </p>
        </div>

        {/* Explorar */}
        <div>
          <h3 className="text-white text-base font-semibold uppercase tracking-wider mb-5">Explorar</h3>
          <ul className="space-y-3 text-base">
            <li><Link to="/mapa" className="hover:text-white transition-colors">Mapa de Escolas</Link></li>
            <li><Link to="/search" className="hover:text-white transition-colors">Busca</Link></li>
            <li><Link to="/algunsdados" className="hover:text-white transition-colors">Alguns Dados</Link></li>
          </ul>
        </div>

        {/* Recursos */}
        <div>
          <h3 className="text-white text-base font-semibold uppercase tracking-wider mb-5">Recursos</h3>
          <ul className="space-y-3 text-base">
            <li><Link to="/conteudo" className="hover:text-white transition-colors">Materiais Didáticos</Link></li>
            <li><Link to="/lindiflix" className="hover:text-white transition-colors">Lindiflix</Link></li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-700 mt-12 pt-6 text-sm text-zinc-500">
        <span>© {new Date().getFullYear()} OPIN / LINDI — UNIFESP</span>
      </div>
    </div>
  </footer>
);

export default Footer;
