import React, { memo } from 'react';
import { FichaSecao } from '../Ficha';

const ProjetosParcerias = memo(({ escola }) => {
  if (!escola || !escola.outras_informacoes || !escola.outras_informacoes.trim()) return null;

  return (
    <FichaSecao titulo="Outras informações">
      <p className="text-base text-gray-900 leading-relaxed whitespace-pre-line">
        {escola.outras_informacoes.trim()}
      </p>
    </FichaSecao>
  );
});

export default ProjetosParcerias;
