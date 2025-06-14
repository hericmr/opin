import React, { memo } from 'react';
import { Building2 } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';

const Infraestrutura = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection title="Infraestrutura" icon={Building2}>
      <InfoItem label="Espaço Escolar e Estrutura" value={escola.espaco_escolar} />
      <InfoItem label="Cozinha/Merenda Escolar" value={escola.cozinha_merenda} />
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