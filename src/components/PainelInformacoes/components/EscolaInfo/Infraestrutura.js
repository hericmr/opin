import React, { memo } from 'react';
import {
  Home,
  Droplet,
  Trash2,
  Wifi,
  Monitor,
  MapPin,
  Utensils,
  Apple,
  ChefHat,
} from 'lucide-react';
import InfoSection from '../InfoSection';
import BooleanValue from '../BooleanValue';

const MiniCard = ({ icon: Icon, label, value }) => (
  <div className="bg-green-50 hover:bg-green-100 rounded-lg p-2 sm:p-3 transition-all duration-200 hover:shadow-sm h-[120px] flex flex-col">
    {/* Header com ícone e label */}
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-3 flex-shrink-0 h-[40px]">
      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0" />
      <span className="text-xs text-gray-600 font-medium leading-tight">{label}</span>
    </div>
    {/* Conteúdo do valor */}
    <div className="flex-1 flex items-center justify-center">
      <div className="text-sm text-gray-800 font-medium break-words text-center w-full">{value}</div>
    </div>
  </div>
);

const Infraestrutura = memo(({ escola }) => {
  if (!escola) return null;

  const items = [
    {
      icon: Droplet,
      label: 'Acesso à Água',
      value: escola.acesso_agua,
    },
    {
      icon: Trash2,
      label: 'Coleta de Lixo',
      value: escola.coleta_lixo,
    },
    {
      icon: Wifi,
      label: 'Acesso à Internet',
      value: <BooleanValue value={escola.acesso_internet} />,
    },
    {
      icon: Monitor,
      label: 'Equipamentos Tecnológicos',
      value: escola.equipamentos,
    },
    {
      icon: MapPin,
      label: 'Modo de Acesso à Escola',
      value: escola.modo_acesso,
    },
    {
      icon: Utensils,
      label: 'Cozinha',
      value: <BooleanValue value={escola.cozinha} />,
    },
    {
      icon: Apple,
      label: 'Merenda Escolar',
      value: <BooleanValue value={escola.merenda_escolar} />,
    },
    {
      icon: ChefHat,
      label: 'Merenda Diferenciada',
      value: <BooleanValue value={escola.diferenciada} />,
    },
  ];

  return (
    <InfoSection title="Infraestrutura" icon={Home}>
      {escola.espaco_escolar && (
        <div className="p-2 text-sm text-gray-800 border-b border-gray-200 whitespace-pre-wrap">
          {escola.espaco_escolar}
        </div>
      )}
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-0.5 sm:gap-1 mt-3 items-stretch">
        {items.map((item, idx) => (
          <MiniCard
            key={idx}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </InfoSection>
  );
});

export default Infraestrutura;
