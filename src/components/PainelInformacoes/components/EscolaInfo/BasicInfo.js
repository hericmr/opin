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
  BookOpen,
  Heart,
  Target,
  GraduationCap,
} from 'lucide-react';
import InfoSection from '../InfoSection';

// Utilitário de capitalização simples
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// CompactCard reutilizável
const CompactCard = ({ icon: Icon, label, value, type = 'text', onClick, className = '' }) => {
  const renderValue = () => {
    switch (type) {
      case 'boolean':
        return value ? (
          <span className="flex items-center gap-1 text-green-600 text-sm">
            <Check className="w-3 h-3" />
            Sim
          </span>
        ) : (
          <span className="flex items-center gap-1 text-red-500 text-sm">
            <X className="w-3 h-3" />
            Não
          </span>
        );
      case 'link':
        return (
          <span className="flex items-center gap-1 text-blue-600 text-sm truncate max-w-[100px]">
            <ExternalLink className="w-3 h-3" />
            {value}
          </span>
        );
      default:
        return <span className="text-sm text-gray-800 truncate">{value}</span>;
    }
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white/70 p-2 rounded-lg ring-1 ring-inset ring-gray-100 hover:ring-green-200 transition-all text-sm cursor-pointer ${className}`}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-gray-600" />
          <span className="text-xs text-gray-500 font-medium">{label}</span>
        </div>
        {onClick && <ChevronRight className="w-3 h-3 text-gray-400" />}
      </div>
      <div>
        {renderValue()}
      </div>
    </div>
  );
};

// Renderiza blocos informativos simples e reutilizáveis
const InfoBlock = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 bg-white/70 p-2 rounded-md ring-1 ring-inset ring-gray-100 text-xs">
    <Icon className="w-3 h-3 text-green-600" />
    <span className="text-gray-700 font-medium">{label}:</span>
    <span className="font-semibold text-green-800">{capitalize(value)}</span>
  </div>
);

const BasicInfo = memo(({ escola }) => {
  const [expanded, setExpanded] = useState({});

  if (!escola) return null;

  const toggle = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const parseLinks = (links) =>
    (links || '').split(',').map((url) => url.trim()).filter(Boolean);

  const socialLinks = parseLinks(escola.links_redes_sociais);

  const openMap = () => {
    if (escola.latitude && escola.longitude) {
      window.open(`https://www.google.com/maps?q=${escola.latitude},${escola.longitude}`, '_blank');
    }
  };

  return (
    <InfoSection title="Informações Básicas" icon={MapPin}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 mb-4">
        {[
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
            icon: Users,
            label: 'Parcerias',
            value: escola.parcerias_municipio,
            type: 'boolean',
          },
          {
            icon: Globe,
            label: 'Redes sociais',
            value: escola.usa_redes_sociais,
            type: 'boolean',
          },
          escola.latitude && escola.longitude && {
            icon: MapPin,
            label: 'Localização',
            value: 'Ver no mapa',
            onClick: openMap,
          },
        ]
          .filter(Boolean)
          .map((item, index) => (
            <CompactCard key={index} {...item} />
          ))}
      </div>

      <div className="space-y-2">
        {escola.terra_indigena && (
          <InfoBlock icon={MapPin} label="Terra indígena" value={escola.terra_indigena} />
        )}

        {escola.diretoria_ensino && (
          <InfoBlock icon={Building} label="Diretoria de ensino" value={escola.diretoria_ensino} />
        )}

        {/* Projetos e Parcerias */}
        {(escola['Projetos em andamento'] || escola['Parcerias com universidades?'] || escola['Ações com ONGs ou coletivos?'] || escola['Desejos da comunidade para a escola']) && (
          <div className="bg-white/70 rounded-md ring-1 ring-green-100">
            <button
              onClick={() => toggle('projetos')}
              className="w-full flex justify-between items-center p-2 hover:bg-green-50 text-xs"
              aria-expanded={expanded.projetos}
            >
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <Target className="w-3 h-3 text-green-600" />
                Projetos e Parcerias
              </span>
              <ChevronRight
                className={`w-3 h-3 text-gray-400 transition-transform ${
                  expanded.projetos ? 'rotate-90' : ''
                }`}
              />
            </button>
            {expanded.projetos && (
              <div className="px-2 pb-2 border-t border-green-100 bg-green-50/30">
                <div className="mt-2 space-y-2">
                  {escola['Projetos em andamento'] && (
                    <div className="flex items-start gap-2 p-2 bg-white/80 rounded-md">
                      <BookOpen className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-700 mb-1">Projetos em Andamento</div>
                        <div className="text-xs text-gray-800 leading-snug">{escola['Projetos em andamento']}</div>
                      </div>
                    </div>
                  )}
                  
                  {escola['Parcerias com universidades?'] && (
                    <div className="flex items-start gap-2 p-2 bg-white/80 rounded-md">
                      <GraduationCap className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-700 mb-1">Parcerias com Universidades</div>
                        <div className="text-xs text-gray-800 leading-snug">{escola['Parcerias com universidades?']}</div>
                      </div>
                    </div>
                  )}
                  
                  {escola['Ações com ONGs ou coletivos?'] && (
                    <div className="flex items-start gap-2 p-2 bg-white/80 rounded-md">
                      <Users className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-700 mb-1">Ações com ONGs ou Coletivos</div>
                        <div className="text-xs text-gray-800 leading-snug">{escola['Ações com ONGs ou coletivos?']}</div>
                      </div>
                    </div>
                  )}
                  
                  {escola['Desejos da comunidade para a escola'] && (
                    <div className="flex items-start gap-2 p-2 bg-white/80 rounded-md">
                      <Heart className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-700 mb-1">Desejos da Comunidade</div>
                        <div className="text-xs text-gray-800 leading-snug">{escola['Desejos da comunidade para a escola']}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {escola.endereco && (
          <div className="bg-white/70 rounded-md ring-1 ring-gray-100">
            <button
              onClick={() => toggle('endereco')}
              className="w-full flex justify-between items-center p-2 hover:bg-gray-50 text-xs"
              aria-expanded={expanded.endereco}
            >
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <Building className="w-3 h-3" />
                Endereço completo
              </span>
              <ChevronRight
                className={`w-3 h-3 text-gray-400 transition-transform ${
                  expanded.endereco ? 'rotate-90' : ''
                }`}
              />
            </button>
            {expanded.endereco && (
              <div className="px-2 pb-2 border-t border-gray-100">
                <p className="text-xs text-gray-700 leading-snug">
                  {capitalize(escola.endereco)}
                </p>
              </div>
            )}
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className="bg-white/70 rounded-md ring-1 ring-blue-100">
            <button
              onClick={() => toggle('social')}
              className="w-full flex justify-between items-center p-2 hover:bg-blue-50 text-xs"
              aria-expanded={expanded.social}
            >
              <span className="flex items-center gap-2 text-gray-700 font-medium">
                <Globe className="w-3 h-3 text-blue-600" />
                Redes sociais ({socialLinks.length})
              </span>
              <ChevronRight
                className={`w-3 h-3 text-gray-400 transition-transform ${
                  expanded.social ? 'rotate-90' : ''
                }`}
              />
            </button>
            {expanded.social && (
              <div className="px-2 pb-2 border-t border-blue-100 bg-blue-50/30">
                <div className="mt-2 space-y-1">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 p-1.5 bg-white/80 rounded-md hover:bg-blue-100/50 group text-xs"
                    >
                      <LinkIcon className="w-3 h-3 text-blue-600" />
                      <span className="truncate flex-1 text-gray-700">{link}</span>
                      <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
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
