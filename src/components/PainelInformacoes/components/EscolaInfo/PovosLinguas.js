import React, { memo } from 'react';
import { Users, Languages } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';

const PovosLinguas = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection 
      title="Povos e Línguas" 
      icon={Users}
      defaultCollapsed={false}
    >
      <InfoItem 
        label="Povos Indígenas" 
        value={escola.povos_indigenas} 
        className="mb-2"
      />
      <InfoItem 
        label="Línguas Faladas" 
        value={escola.linguas_faladas} 
      />
    </InfoSection>
  );
});

export default PovosLinguas; 