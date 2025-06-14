import React, { memo } from 'react';

// Import all section components
import BasicInfo from './BasicInfo';
import PovosLinguas from './PovosLinguas';
import Ensino from './Ensino';
import Infraestrutura from './Infraestrutura';
import GestaoProfessores from './GestaoProfessores';
import RedesSociais from './RedesSociais';
import Localizacao from './Localizacao';

const EscolaInfo = memo(({ escola }) => {
  console.log("EscolaInfo recebeu:", escola);
  
  if (!escola) {
    console.log("EscolaInfo: escola é null ou undefined");
    return null;
  }

  return (
    <div className="space-y-4">
      <BasicInfo escola={escola} />
      <PovosLinguas escola={escola} />
      <Ensino escola={escola} />
      <Infraestrutura escola={escola} />
      <GestaoProfessores escola={escola} />
      <RedesSociais escola={escola} />
      <Localizacao escola={escola} />
    </div>
  );
});

export default EscolaInfo; 