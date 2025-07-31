import React, { memo } from 'react';
import { Compass } from 'lucide-react';
import InfoSection from '../InfoSection';
import MapLink from '../MapLink';

const Localizacao = memo(({ escola }) => {
  if (!escola) return null;

  return (
    <InfoSection title="Localização" icon={Compass}>
      <div className="flex justify-center py-2">
        <MapLink 
          latitude={escola.Latitude} 
          longitude={escola.Longitude}
          label="Abrir localização no mapa"
        />
      </div>
    </InfoSection>
  );
});

export default Localizacao; 