import React, { memo } from 'react';
import {
  Info,
} from 'lucide-react';
import InfoSection from '../InfoSection';
import NativeLandCard from '../NativeLandCard';

const ProjetosParcerias = memo(({ escola }) => {
  if (!escola || !escola.outras_informacoes || !escola.outras_informacoes.trim()) return null;

  return (
    <InfoSection>
      <div className="grid grid-cols-1 gap-3 items-start overflow-visible">
        <div className="relative">
          <NativeLandCard
            icon={Info}
            label="Outras Informações"
            value={escola.outras_informacoes}
            layout="vertical"
            showIconCircle={true}
            className="h-auto"
            preserveNewlines={true}
          />
        </div>
      </div>
    </InfoSection>
  );
});

export default ProjetosParcerias;
