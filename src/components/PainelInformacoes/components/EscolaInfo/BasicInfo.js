import React, { memo, useState } from 'react';
import {
  MapPin,
  Users,
  Globe,
  Calendar,
  Building,
  Link as LinkIcon,
  ExternalLink,
  ChevronRight,
  Check,
  X,
  Navigation,
} from 'lucide-react';
import InfoSection from '../InfoSection';

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const CompactCard = ({ icon: Icon, label, value, type = 'text' }) => {
  const renderValue = () => {
    switch (type) {
      case 'boolean':
        return value ? (
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <Check className="w-5 h-5" />
            Sim
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-500 text-sm">
            <X className="w-5 h-5" />
            Não
          </span>
        );
      default:
        return <span className="text-sm text-gray-800 truncate">{value}</span>;
    }
  };

  return (
    <div className="p-1 rounded-md transition-all">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      {renderValue()}
    </div>
  );
};

const InfoBlock = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 bg-green-100 p-1.5 rounded-md text-xs">
    <Icon className="w-5 h-5 text-green-600" />
    <span className="text-gray-700 font-medium">{label}:</span>
    <span className="font-semibold text-green-800">{capitalize(value)}</span>
  </div>
);

const AddressDetails = ({ escola }) => {
  const hasDetailedAddress = escola.logradouro || escola.numero || escola.bairro || escola.cep;
  
  if (!hasDetailedAddress) {
    return (
      <div className="mt-2 p-2 bg-green-100 rounded-md">
        <p className="text-xs text-gray-700 leading-snug">
          {capitalize(escola.endereco)}
        </p>
      </div>
    );
  }

  const addressFields = [
    { field: 'logradouro', label: 'Logradouro' },
    { field: 'numero', label: 'Número' },
    { field: 'complemento', label: 'Complemento' },
    { field: 'bairro', label: 'Bairro' },
  ];

  return (
    <div className="mt-2 space-y-1">
      {addressFields.map(({ field, label }) => 
        escola[field] && (
          <div key={field} className="flex items-start gap-2 p-1.5 bg-green-100 rounded-md">
            <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-700 mb-0.5">{label}</div>
              <div className="text-xs text-gray-800 leading-snug">{escola[field]}</div>
            </div>
          </div>
        )
      )}
      
      {(escola.cep || escola.estado) && (
        <div className="flex items-start gap-2 p-1.5 bg-green-100 rounded-md">
          <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-700 mb-0.5">Localização</div>
            <div className="text-xs text-gray-800 leading-snug">
              {[escola.municipio, escola.estado, escola.cep].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapButton = ({ escola }) => {
  const hasCoordinates = escola.latitude && escola.longitude;
  
  if (!hasCoordinates) return null;

  const openMap = () => {
    window.open(`https://www.google.com/maps?q=${escola.latitude},${escola.longitude}`, '_blank');
  };

  return (
    <button
      onClick={openMap}
      className="mt-2 w-full flex items-center justify-center gap-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors text-xs font-medium"
    >
      <Navigation className="w-5 h-5" />
      Ver no Google Maps
    </button>
  );
};

const SocialLinks = ({ links, expanded, onToggle }) => {
  const socialLinks = (links || '').split(',').map(url => url.trim()).filter(Boolean);
  
  if (socialLinks.length === 0) return null;

  return (
    <div className="bg-green-100 rounded-md">
      <button
        onClick={() => onToggle('social')}
        className="w-full flex justify-between items-center p-1.5 hover:bg-green-200 text-xs"
        aria-expanded={expanded.social}
      >
        <span className="flex items-center gap-2 text-gray-700 font-medium">
          <Globe className="w-5 h-5 text-blue-600" />
          Redes sociais ({socialLinks.length})
        </span>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform ${
            expanded.social ? 'rotate-90' : ''
          }`}
        />
      </button>
      
      {expanded.social && (
        <div className="px-2 pb-2 border-t border-green-200 bg-white">
          <div className="mt-1 space-y-1">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 p-1.5 bg-green-100 rounded-md hover:bg-green-200 group text-xs"
              >
                <LinkIcon className="w-5 h-5 text-blue-600" />
                <span className="truncate flex-1 text-gray-700">{link}</span>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const BasicInfo = memo(({ escola }) => {
  const [expanded, setExpanded] = useState({});

  if (!escola) return null;

  const toggle = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const basicInfoCards = [
    {
      icon: Building,
      label: 'Município',
      value: capitalize(escola.municipio),
    },
    {
      icon: Calendar,
      label: 'Fundação',
      value: escola.ano_criacao,
    },
    {
      icon: Globe,
      label: 'Redes sociais',
      value: escola.usa_redes_sociais,
      type: 'boolean',
    },
  ].filter(item => item.value);

  return (
    <InfoSection title="Localização" icon={MapPin}>
      {/* Cards informativos básicos */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 mb-3 [&>*]:bg-green-100">
        {basicInfoCards.map((item, index) => (
          <CompactCard key={index} {...item} />
        ))}
      </div>

      <div className="space-y-1.5">
        {/* Diretoria de ensino */}
        {escola.diretoria_ensino && (
          <InfoBlock 
            icon={Building} 
            label="Diretoria de ensino" 
            value={escola.diretoria_ensino} 
          />
        )}

        {/* Gaveta do endereço */}
        {escola.endereco && (
          <div className="bg-green-100 rounded-md">
            <button
              onClick={() => toggle('endereco')}
              className="w-full flex justify-between items-center p-1.5 hover:bg-green-200 text-xs"
              aria-expanded={expanded.endereco}
            >
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <Building className="w-5 h-5" />
                Endereço
              </span>
              <ChevronRight
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expanded.endereco ? 'rotate-90' : ''
                }`}
              />
            </button>
            
            {expanded.endereco && (
              <div className="px-2 pb-2 border-t border-green-200 bg-white">
                <AddressDetails escola={escola} />
                <MapButton escola={escola} />
              </div>
            )}
          </div>
        )}

        {/* Redes sociais */}
        <SocialLinks 
          links={escola.links_redes_sociais}
          expanded={expanded}
          onToggle={toggle}
        />
      </div>
    </InfoSection>
  );
});

export default BasicInfo;