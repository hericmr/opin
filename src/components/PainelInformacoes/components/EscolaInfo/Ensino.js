import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';

const Ensino = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection title="Ensino" icon={Sparkles}>
      <InfoItem label="Modalidade de Ensino" value={escola.modalidade_ensino} />
      <InfoItem label="Número de Alunos" value={escola.numero_alunos} />
      <InfoItem label="Disciplinas Bilíngues" value={escola.disciplinas_bilingues} />
      <InfoItem 
        label="Material Pedagógico Não Indígena" 
        value={<BooleanValue value={escola.material_nao_indigena} />} 
      />
      <InfoItem 
        label="Material Pedagógico Indígena" 
        value={<BooleanValue value={escola.material_indigena} />} 
      />
      <InfoItem label="Práticas Pedagógicas Indígenas" value={escola.praticas_pedagogicas} />
      <InfoItem label="Formas de Avaliação" value={escola.formas_avaliacao} />
    </InfoSection>
  );
});

export default Ensino; 