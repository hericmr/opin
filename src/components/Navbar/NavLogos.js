import React from 'react';
import LazyImage from '../LazyImage';

const NavLogos = ({ isMobileLandscape }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center space-x-3 relative">
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
            src={`${process.env.PUBLIC_URL}/lindi.svg`}
            alt="LINDI - Licenciatura Intercultural Indígena"
            className="h-20 w-auto"
          />
        </a>
      </div>
    </div>
  );
};

export default NavLogos; 