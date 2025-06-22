import React, { memo } from 'react';
import { MapPin } from 'lucide-react';
import InfoSection from '../InfoSection';
import InfoItem from '../InfoItem';
import BooleanValue from '../BooleanValue';
import LinkValue from '../LinkValue';
import MapLink from '../MapLink';
import { capitalizeWords, normalizeAddress } from '../../../../utils/textFormatting';

const BasicInfo = memo(({ escola }) => {
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
    <InfoSection title="Localização" icon={MapPin}>
      <div className="flex flex-col gap-2">
        <InfoItem label="Município" value={capitalizeWords(escola.municipio)} />
        <InfoItem 
          label="Endereço" 
          value={normalizeAddress(escola.endereco)} 
          className="flex flex-col gap-1"
        />
        <div className="mb-2">
          <MapLink latitude={escola.latitude} longitude={escola.longitude} label="Abrir localização no mapa" />
        </div>
        <InfoItem label="Terra Indígena" value={escola.terra_indigena} />
        <InfoItem 
          label="Parcerias com o Município" 
          value={<BooleanValue value={escola.parcerias_municipio} />} 
        />
        <InfoItem label="Diretoria de Ensino" value={escola.diretoria_ensino} />
        <InfoItem label="Ano de Criação" value={escola.ano_criacao} />
        
        {/* Seção de Redes Sociais integrada */}
        <div className="mt-4 pt-4 border-t border-gray-200">
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
        </div>
      </div>
    </InfoSection>
  );
});

export default BasicInfo; 