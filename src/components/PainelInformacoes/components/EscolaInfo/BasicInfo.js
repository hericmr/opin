import React, { memo } from 'react';
import { MapPin } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';
import { capitalizeWords, normalizeAddress } from '../../../../utils/textFormatting';

const BasicInfo = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection title="Localização" icon={MapPin}>
      <div className="flex flex-col gap-2">

        <InfoItem label="Município" value={capitalizeWords(escola.municipio)} />
        <InfoItem label="Endereço" value={normalizeAddress(escola.endereco)} />
        <InfoItem label="Terra Indígena" value={escola.terra_indigena} />
        <InfoItem label="Tipo de Escola" value={escola.tipo_escola} />
        <InfoItem 
          label="Parcerias com o Município" 
          value={<BooleanValue value={escola.parcerias_municipio} />} 
        />
        <InfoItem label="Diretoria de Ensino" value={escola.diretoria_ensino} />
        <InfoItem label="Ano de Criação" value={escola.ano_criacao} />
      </div>
    </InfoSection>
  );
});

export default BasicInfo; 