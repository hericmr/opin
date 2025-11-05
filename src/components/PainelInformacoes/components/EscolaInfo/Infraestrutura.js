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
import NativeLandCard from '../NativeLandCard';

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
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 mt-3 items-stretch overflow-visible" style={{ paddingTop: '12px', paddingLeft: '12px' }}>
        {items.map((item, idx) => (
          <NativeLandCard
            key={idx}
            icon={item.icon}
            label={item.label}
            value={item.value}
            showIconCircle={true}
          />
        ))}
      </div>
    </InfoSection>
  );
});

export default Infraestrutura;
