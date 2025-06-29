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
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';
import InfoSection from '../InfoSection';

// Utilitários de formatação
const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const normalizeAddress = (address) => {
  if (!address) return '';
  return capitalizeWords(address);
};

// Componente de card compacto e animado - versão refinada
const CompactCard = ({ icon: Icon, label, value, type = 'text', onClick, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const renderValue = () => {
    if (type === 'boolean') {
      return value ? (
        <div className="flex items-center gap-1 text-green-600">
          <Check className="w-2.5 h-2.5" />
          <span className="text-xs font-medium">Sim</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-red-500">
          <X className="w-2.5 h-2.5" />
          <span className="text-xs font-medium">Não</span>
        </div>
      );
    }
    
    if (type === 'link') {
      return (
        <div className="flex items-center gap-1 text-blue-600">
          <ExternalLink className="w-2.5 h-2.5" />
          <span className="text-xs truncate max-w-[100px]">{value}</span>
        </div>
      );
    }
    
    return <span className="text-xs font-medium text-gray-800 truncate">{value}</span>;
  };

  return (
    <div 
      className={`
        relative bg-white/80 backdrop-blur-sm rounded-lg p-2 
        transition-all duration-200 cursor-pointer group
        hover:shadow-sm hover:bg-white hover:-translate-y-0.5
        ring-1 ring-inset ring-gray-100/50 hover:ring-green-200/50
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={label}
    >
      {/* Gradient decorativo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <div className={`
            p-1.5 rounded-md transition-colors duration-200
            ${isHovered ? 'bg-green-100/80 text-green-600' : 'bg-gray-50/80 text-gray-600'}
          `}>
            <Icon className="w-3 h-3" />
          </div>
          {onClick && <ChevronRight className="w-2.5 h-2.5 text-gray-500 group-hover:text-green-500 transition-colors" />}
        </div>
        
        <div className="space-y-0.5">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium leading-tight">
            {label}
          </p>
          {renderValue()}
        </div>
      </div>
      
      {/* Pulse effect sutil para cards interativos */}
      {onClick && (
        <div className="absolute inset-0 rounded-lg ring-1 ring-green-300/30 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
      )}
    </div>
  );
};

// Componente principal refinado
const BasicInfo = memo(({ escola }) => {
  const [expandedSections, setExpandedSections] = useState({});
  
  if (!escola) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const openMap = () => {
    if (escola.latitude && escola.longitude) {
      window.open(`https://www.google.com/maps?q=${escola.latitude},${escola.longitude}`, '_blank');
    }
  };

  const parseLinks = (links) => {
    if (!links) return [];
    return links.split(',').map(url => url.trim()).filter(Boolean);
  };

  const socialLinks = parseLinks(escola.links_redes_sociais);

  return (
    <InfoSection 
      title="Informações Básicas" 
      icon={MapPin}
    >
      {/* Grid principal compacto */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 mb-4">
        <CompactCard
          icon={Building}
          label="Município"
          value={capitalizeWords(escola.municipio)}
        />
        
        <CompactCard
          icon={Calendar}
          label="Fundação"
          value={escola.ano_criacao}
          type="number"
        />
        
        <CompactCard
          icon={Users}
          label="Parcerias"
          value={escola.parcerias_municipio}
          type="boolean"
        />
        
        <CompactCard
          icon={Globe}
          label="Redes Sociais"
          value={escola.usa_redes_sociais}
          type="boolean"
        />
        
        {escola.latitude && escola.longitude && (
          <CompactCard
            icon={MapPin}
            label="Localização"
            value="Ver no mapa"
            onClick={openMap}
          />
        )}
      </div>

      {/* Seções expansíveis compactas */}
      <div className="space-y-2">
        {/* Terra Indígena */}
        {escola.terra_indigena && (
          <div className="bg-white/60 backdrop-blur-sm rounded-md p-2 ring-1 ring-inset ring-green-100/50">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 uppercase tracking-wide font-medium">Terra Indígena:</span>
              <span className="text-xs font-semibold text-green-800">{escola.terra_indigena}</span>
            </div>
          </div>
        )}

        {/* Diretoria de Ensino */}
        {escola.diretoria_ensino && (
          <div className="bg-white/60 backdrop-blur-sm rounded-md p-2 ring-1 ring-inset ring-green-100/50">
            <div className="flex items-center gap-2">
              <Building className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-700 uppercase tracking-wide font-medium">Diretoria de Ensino:</span>
              <span className="text-xs font-semibold text-green-800">{escola.diretoria_ensino}</span>
            </div>
          </div>
        )}

        {/* Endereço expansível */}
        {escola.endereco && (
          <div className="bg-white/60 backdrop-blur-sm rounded-md ring-1 ring-inset ring-gray-100/50 overflow-hidden">
            <button
              onClick={() => toggleSection('endereco')}
              className="w-full p-2 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              aria-expanded={expandedSections.endereco}
              aria-controls="endereco-content"
            >
              <div className="flex items-center gap-2">
                <Building className="w-3 h-3 text-gray-600" />
                <span className="text-xs font-medium text-gray-700">Endereço Completo</span>
              </div>
              <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${
                expandedSections.endereco ? 'rotate-90' : ''
              }`} />
            </button>
            
            {expandedSections.endereco && (
              <div className="px-2 pb-2 border-t border-gray-100/50" id="endereco-content">
                <div className="mt-2 p-2 bg-gray-50/50 rounded-md break-words">
                  <p className="text-xs text-gray-700 leading-snug">{normalizeAddress(escola.endereco)}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Links das redes sociais */}
        {socialLinks.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-md ring-1 ring-inset ring-blue-100/50 overflow-hidden">
            <button
              onClick={() => toggleSection('social')}
              className="w-full p-2 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
              aria-expanded={expandedSections.social}
              aria-controls="social-content"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">
                  Redes Sociais ({socialLinks.length})
                </span>
              </div>
              <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${
                expandedSections.social ? 'rotate-90' : ''
              }`} />
            </button>
            
            {expandedSections.social && (
              <div className="px-2 pb-2 border-t border-blue-100/50 bg-blue-50/30" id="social-content">
                <div className="mt-2 space-y-1">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-md hover:bg-blue-100/50 transition-colors group"
                    >
                      <LinkIcon className="w-2.5 h-2.5 text-blue-600" />
                      <span className="text-xs text-gray-700 truncate flex-1">{link}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </InfoSection>
  );
});

export default BasicInfo; 