import React from 'react';
import LazyImage from '../LazyImage';

const NavLogos = ({ isMobileLandscape }) => {
  return (
    <div className="flex items-center space-x-3">
      <a 
        href="https://www.unifesp.br/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col items-center group transition-transform duration-200 hover:scale-105"
        aria-label="Visitar site da UNIFESP - Universidade Federal de São Paulo"
        title="UNIFESP - Universidade Federal de São Paulo"
      >
        <LazyImage
          src={`${process.env.PUBLIC_URL}/logo.webp`}
          alt="Logo UNIFESP"
          className="h-8 w-auto"
        />
        <span className="text-[8px] xl:text-[10px] tracking-wide font-[Caveat] text-amber-200 mt-0.5 text-center leading-tight">
          Licenciatura Intercultural
        </span>
      </a>
      <a 
        href="https://www.unifesp.br/lindi" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="group transition-transform duration-200 hover:scale-105"
        aria-label="Visitar site do LINDI - Licenciatura Intercultural Indígena"
        title="LINDI - Licenciatura Intercultural Indígena"
      >
        <LazyImage
          src={`${process.env.PUBLIC_URL}/lindi.webp`}
          alt="LINDI - Licenciatura Intercultural Indígena"
          className="h-20 w-auto"
        />
      </a>
    </div>
  );
};

export default NavLogos; 