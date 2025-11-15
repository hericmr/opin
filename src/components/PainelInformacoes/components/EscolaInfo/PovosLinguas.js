import React, { memo } from 'react';
import { Heart } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import { getPovoIndigenaLabel } from '../../../../utils/povoIndigenaLabel';

const PovosLinguas = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection 
      title="Povos" 
      icon={Heart}
      defaultCollapsed={false}
    >
      <InfoItem 
        label={getPovoIndigenaLabel(escola.povos_indigenas)} 
        value={escola.povos_indigenas} 
        className="mb-2"
      />
    </InfoSection>
  );
});

export default PovosLinguas; 