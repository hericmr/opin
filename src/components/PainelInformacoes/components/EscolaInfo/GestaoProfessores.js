import React, { memo } from 'react';
import { UsersRound, Star } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';

const GestaoProfessores = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection title="Gestão e Professores" icon={UsersRound} secondaryIcon={Star}>
      <InfoItem label="Gestão/Nome" value={escola.gestao} />
      <InfoItem label="Outros Funcionários" value={escola.outros_funcionarios} />
      <InfoItem label="Professores Indígenas" value={escola.professores_indigenas} />
      <InfoItem label="Professores Não Indígenas" value={escola.professores_nao_indigenas} />
      <InfoItem 
        label="Professores Falam a Língua Indígena" 
        value={<BooleanValue value={escola.professores_falam_lingua} />} 
      />
      <InfoItem label="Formação dos Professores" value={escola.formacao_professores} />
      <InfoItem label="Formação Continuada" value={escola.formacao_continuada} />
    </InfoSection>
  );
});

export default GestaoProfessores; 