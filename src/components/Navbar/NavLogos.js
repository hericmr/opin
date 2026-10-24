import React from 'react';
import { getLocalImageUrl } from '../../utils/imageUtils';

const NavLogos = () => {
  return (
    <div className="hidden lg:flex items-center space-x-2 xl:space-x-4 ml-auto">
      <a
        href="https://unifesp.br/campus/san7/graduacao/cursos/licenciatura-intercultural-indigena"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center hover:opacity-80 transition-opacity flex-none"
      >
        <img
          src={getLocalImageUrl(`${import.meta.env.BASE_URL}lindi.svg`)}
          alt="LINDI - Licenciatura Intercultural Indígena"
          className="h-16 xl:h-20 w-auto object-contain"
          style={{ minWidth: 'max-content' }}
        />
      </a>

      <a
        href="https://unifesp.br"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center hover:opacity-80 transition-opacity flex-none"
      >
        <img
          src={getLocalImageUrl(`${import.meta.env.BASE_URL}logo.webp`)}
          alt="UNIFESP"
          className="h-8 xl:h-12 w-auto object-contain"
          style={{ minWidth: 'max-content' }}
        />
      </a>
    </div>
  );
};

export default NavLogos;
