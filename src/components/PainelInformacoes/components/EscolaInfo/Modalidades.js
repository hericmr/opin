import React, { memo } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';

const Modalidades = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <>
      <InfoSection title="Modalidades" icon={Sparkles}>
        <InfoItem label="Modalidade de Ensino" value={escola.modalidade_ensino} />
        <InfoItem label="Número de Alunos" value={escola.numero_alunos} />
        <InfoItem label="Línguas Faladas" value={escola.linguas_faladas} />
      </InfoSection>
      
      <InfoSection 
        title="Materiais Pedagógicos" 
        icon={BookOpen}
        description="Diferenciados e não diferenciados, produzidos dentro e fora da comunidade."
      >
        <InfoItem 
          label="Material Pedagógico Não Indígena" 
          value={<BooleanValue value={escola.material_nao_indigena} />} 
        />
        <InfoItem 
          label="Material Pedagógico Indígena" 
          value={<BooleanValue value={escola.material_indigena} />} 
        />
      </InfoSection>
    </>
  );
});

export default Modalidades; 