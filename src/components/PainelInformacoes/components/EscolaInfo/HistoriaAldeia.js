import React, { memo } from 'react';
import { BookOpen } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';

const HistoriaAldeia = memo(({ escola }) => {
  if (!escola?.historia_aldeia) return null;

  return (
    <InfoSection 
      title="História da Aldeia" 
      icon={BookOpen}
      className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 shadow-sm"
    >
      <div className="prose prose-amber max-w-none">
        <div className="text-lg leading-relaxed text-neutral-800">
          {escola.historia_aldeia}
        </div>
      </div>
    </InfoSection>
  );
});

export default HistoriaAldeia; 