import React, { memo } from 'react';
import { Sun } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';
import { capitalizeWords } from '../../../../utils/textFormatting';

const BasicInfo = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection title="Informações Básicas" icon={Sun}>
      <InfoItem label="Nome da Escola" value={capitalizeWords(escola.titulo)} />
      <InfoItem label="Município" value={escola.municipio} />
      <InfoItem label="Endereço" value={escola.endereco} />
      <InfoItem label="Terra Indígena" value={escola.terra_indigena} />
      <InfoItem label="Tipo de Escola" value={escola.tipo_escola} />
      <InfoItem 
        label="Parcerias com o Município" 
        value={<BooleanValue value={escola.parcerias_municipio} />} 
      />
      <InfoItem label="Diretoria de Ensino" value={escola.diretoria_ensino} />
      <InfoItem label="Ano de Criação" value={escola.ano_criacao} />
    </InfoSection>
  );
});

export default BasicInfo; 