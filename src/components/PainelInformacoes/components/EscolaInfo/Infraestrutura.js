import React, { memo } from 'react';
import { Home } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';

const Infraestrutura = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection title="Infraestrutura" icon={Home}>
      <div className="p-2 border-b border-gray-200">
        <p className="text-base text-gray-800 whitespace-pre-wrap break-words">
          {escola.espaco_escolar}
        </p>
      </div>
      <InfoItem label="Acesso à Água" value={escola.acesso_agua} />
      <InfoItem label="Coleta de Lixo" value={escola.coleta_lixo} />
      <InfoItem 
        label="Acesso à Internet" 
        value={<BooleanValue value={escola.acesso_internet} />} 
      />
      <InfoItem label="Equipamentos Tecnológicos" value={escola.equipamentos} />
      <InfoItem label="Modo de Acesso à Escola" value={escola.modo_acesso} />
    </InfoSection>
  );
});

export default Infraestrutura; 