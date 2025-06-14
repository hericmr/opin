import React, { memo } from 'react';
import { Share2 } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';
import LinkValue from '../LinkValue';

const RedesSociais = memo(({ escola }) => {
  if (!escola) return null;

  const renderLinks = (links) => {
    if (!links) return null;
    const urlList = links.split(',').map(url => url.trim()).filter(Boolean);
    if (urlList.length === 0) return null;

    return (
      <div className="space-y-1">
        {urlList.map((url, index) => (
          <LinkValue key={index} href={url} />
        ))}
      </div>
    );
  };

  return (
    <InfoSection title="Redes Sociais e Mídia" icon={Share2}>
      <InfoItem 
        label="Utiliza Redes Sociais" 
        value={<BooleanValue value={escola.usa_redes_sociais} />} 
      />
      {escola.links_redes_sociais && (
        <div className="mt-2">
          <span className="font-medium text-neutral-700">Links das Redes Sociais:</span>
          {renderLinks(escola.links_redes_sociais)}
        </div>
      )}
      <InfoItem label="História da Aldeia" value={escola.historia_aldeia} />
    </InfoSection>
  );
});

export default RedesSociais; 