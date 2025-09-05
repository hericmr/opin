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
  <div className="bg-green-50 hover:bg-green-100 rounded-lg p-3 transition-all duration-200 hover:shadow-sm h-full flex flex-col">
    {/* Header com ícone e label */}
    <div className="flex items-center gap-2 mb-2 flex-shrink-0">
      <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />
      <span className="text-xs text-gray-600 font-medium">{label}</span>
    </div>
    {/* Conteúdo do valor */}
    <div className="flex-1 flex items-start">
      <div className="text-sm text-gray-800 font-medium break-words">{value}</div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 items-stretch">
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
