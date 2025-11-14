import React, { memo, useState } from 'react';
import {
  MapPin,
  Globe,
  Calendar,
  Building,
  Link as LinkIcon,
  ExternalLink,
  ChevronRight,
  Navigation,
} from 'lucide-react';
import InfoSection from '../InfoSection';
import NativeLandCard from '../NativeLandCard';

const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// const InfoBlock = ({ icon: Icon, label, value }) => ( // Removido - não utilizado
//   <div className="flex items-center gap-2 bg-green-100 p-1.5 rounded-md text-xs">
//     <Icon className="w-5 h-5 text-green-600" />
//     <span className="text-gray-700 font-medium">{label}:</span>
//     <span className="font-semibold text-green-800">{capitalize(value)}</span>
//   </div>
// );

const AddressDetails = ({ escola }) => {
  const hasDetailedAddress = escola.logradouro || escola.numero || escola.bairro || escola.cep;
  
  if (!hasDetailedAddress) {
    return (
      <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-md">
        <p className="text-sm text-gray-900 leading-relaxed break-words" style={{ lineHeight: '1.6' }}>
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
    <div className="space-y-2">
      {addressFields.map(({ field, label }) => 
        escola[field] && (
          <div key={field} className="flex items-start gap-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-md">
            <MapPin className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-800 mb-1">{label}</div>
              <div className="text-sm text-gray-900 leading-relaxed break-words" style={{ lineHeight: '1.6' }}>{escola[field]}</div>
            </div>
          </div>
        )
      )}
      
      {(escola.cep || escola.estado) && (
        <div className="flex items-start gap-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-md">
          <MapPin className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-800 mb-1">Localização</div>
            <div className="text-sm text-gray-900 leading-relaxed break-words" style={{ lineHeight: '1.6' }}>
              {[escola.municipio, escola.estado, escola.cep].filter(Boolean).join(', ')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MapButton = ({ escola }) => {
  const hasCoordinates = escola.Latitude && escola.Longitude;
  
  if (!hasCoordinates) return null;

  const openMap = () => {
    window.open(`https://www.google.com/maps?q=${escola.Latitude},${escola.Longitude}`, '_blank');
  };

  return (
    <button
      onClick={openMap}
      className="w-full flex items-center justify-center gap-2 p-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-md transition-colors text-sm font-semibold mt-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
      <Navigation className="w-5 h-5" aria-hidden="true" />
      Ver no Google Maps
    </button>
  );
};

const SocialLinks = ({ links, expanded, onToggle }) => {
  const socialLinks = (links || '').split(',').map(url => url.trim()).filter(Boolean);
  
  if (socialLinks.length === 0) return null;

  return (
    <div className="bg-gray-100 rounded-md">
      <button
        onClick={() => onToggle('social')}
        className="w-full flex justify-between items-center p-2.5 hover:bg-gray-100 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded-md"
        aria-expanded={expanded.social}
      >
        <span className="flex items-center gap-2 text-gray-800 font-semibold">
          <Globe className="w-5 h-5 text-blue-600" aria-hidden="true" />
          Redes sociais ({socialLinks.length})
        </span>
        <ChevronRight
          className={`w-5 h-5 text-gray-500 transition-transform ${
            expanded.social ? 'rotate-90' : ''
          }`}
          aria-hidden="true"
        />
      </button>
      
      {expanded.social && (
        <div className="px-3 pb-3 border-t border-gray-200 bg-white">
          <div className="mt-2 space-y-2">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 group text-sm transition-colors"
              >
                <LinkIcon className="w-5 h-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
                <span className="truncate flex-1 text-gray-700 font-medium">{link}</span>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 flex-shrink-0" aria-hidden="true" />
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

// Helper function to check if a value is empty
const isEmptyValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (typeof value === 'number' && isNaN(value)) return true;
  // Keep 0, false, and React elements as valid
  if (typeof value === 'number') return false;
  if (typeof value === 'boolean') return false;
  if (React.isValidElement(value)) return false;
  return false;
};

// Helper function to check if a card has long content
const hasLongContent = (value) => {
  if (!value) return false;
  if (React.isValidElement(value)) return false; // React elements are not long text
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Verifica se tem mais de 30 caracteres OU se tem vírgulas (lista de itens)
    return trimmed.length > 30 || (trimmed.includes(',') && trimmed.length > 20);
  }
  return false;
};

// Helper function to get grid columns based on item count
const getGridCols = (count) => {
  if (count === 0) return 'grid-cols-1';
  if (count === 1) return 'grid-cols-1';
  // Sempre usar 2 colunas para distribuição equitativa
  return 'grid-cols-2';
};

  const basicInfoCards = [
    {
      icon: Building,
      label: 'Município',
      value: escola.municipio,
    },
    {
      icon: Calendar,
      label: 'Fundação',
      value: escola.ano_criacao,
      type: 'number',
    },
    {
      icon: Globe,
      label: 'Redes sociais',
      value: escola.usa_redes_sociais,
      type: 'boolean',
    },
  ].filter(item => !isEmptyValue(item.value));
  
  // Add diretoria_ensino if it exists
  const allBasicCards = [...basicInfoCards];
  if (escola.diretoria_ensino && !isEmptyValue(escola.diretoria_ensino)) {
    allBasicCards.push({
      icon: Building,
      label: 'Diretoria de ensino',
      value: escola.diretoria_ensino,
    });
  }

  return (
    <>
      {/* Povos Indígenas em destaque antes de tudo */}
      {escola.povos_indigenas && (
        <div className="mb-4">
          <div className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
            Povos Indígenas: <span className="font-semibold text-gray-900">{escola.povos_indigenas}</span>
          </div>
        </div>
      )}
      <InfoSection>
        {/* Cards informativos básicos - Layout inspirado no native-land.ca */}
        {(() => {
          const longContentCards = allBasicCards.filter(item => hasLongContent(item.value));
          const normalCards = allBasicCards.filter(item => !hasLongContent(item.value));
          
          return (
            <>
              {/* Cards com muito conteúdo - linha inteira (1 coluna) */}
              {longContentCards.length > 0 && (
                <div className="space-y-3 mb-4" style={{ paddingTop: '12px', paddingLeft: '12px' }}>
                  {longContentCards.map((item, index) => (
                    <NativeLandCard key={`long-${index}`} {...item} showIconCircle={true} />
                  ))}
                </div>
              )}
              
              {/* Cards normais - grid de 2 colunas */}
              {normalCards.length > 0 && (
                <div className={`grid ${getGridCols(normalCards.length)} gap-2 sm:gap-3 ${longContentCards.length > 0 ? 'mb-4' : 'mb-4'} items-stretch overflow-visible`} style={{ paddingTop: '12px', paddingLeft: '12px' }}>
                  {normalCards.map((item, index) => (
                    <NativeLandCard key={`normal-${index}`} {...item} showIconCircle={true} />
                  ))}
                </div>
              )}
            </>
          );
        })()}

        <div className="space-y-1.5">

          {/* Gaveta do endereço */}
          {escola.endereco && (
            <div className="bg-gray-100 rounded-md">
      <button
        onClick={() => toggle('endereco')}
        className="w-full flex justify-between items-center p-2.5 hover:bg-gray-100 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 rounded-md"
        aria-expanded={expanded.endereco}
      >
        <span className="flex items-center gap-2 text-gray-800 font-semibold">
          <Building className="w-5 h-5 text-gray-700" aria-hidden="true" />
          Endereço
        </span>
        <ChevronRight
          className={`w-5 h-5 text-gray-500 transition-transform ${
            expanded.endereco ? 'rotate-90' : ''
          }`}
          aria-hidden="true"
        />
      </button>
              {expanded.endereco && (
                <div className="px-3 pb-3 border-t border-gray-200 bg-white">
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
    </>
  );
});

export default BasicInfo;