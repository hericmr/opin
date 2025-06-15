import React, { memo } from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';

const PovosLinguas = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection 
      title="Povos e Línguas" 
      icon={Heart}
      secondaryIcon={MessageSquare}
      defaultCollapsed={false}
    >
      <InfoItem 
        label="Povos Indígenas" 
        value={escola.povos_indigenas} 
        className="mb-2"
        icon={Heart}
      />
      <InfoItem 
        label="Línguas Faladas" 
        value={escola.linguas_faladas}
        icon={MessageSquare}
      />
    </InfoSection>
  );
});

export default PovosLinguas; 