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
  <div className="flex items-start gap-2 rounded-lg p-2 text-sm">
    <Icon className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <div className="text-gray-500">{label}</div>
      <div className="text-gray-800 font-medium">{value}</div>
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 mt-3 [&>*]:bg-green-100">
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
