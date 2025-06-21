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
      >
        <LazyImage
          src={`${process.env.PUBLIC_URL}/logo.webp`}
          alt="Logo"
          className="h-8 w-auto"
        />
        <span className="text-[8px] xl:text-[10px] tracking-wide font-[Caveat] text-amber-200 mt-0.5 text-center leading-tight">
          é terra indígena!
        </span>
      </a>
      <a href="https://www.unifesp.br/lindi" target="_blank" rel="noopener noreferrer" className="group">
        <LazyImage
          src={`${process.env.PUBLIC_URL}/lindi.webp`}
          alt="LINDI"
          className="h-20 w-auto"
        />
      </a>
    </div>
  );
};

export default NavLogos; 