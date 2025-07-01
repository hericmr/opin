import React, { memo } from 'react';
import { Sparkles, BookOpen, Users, Languages, Clock } from 'lucide-react';
import InfoSection from '../InfoSection';
import BooleanValue from '../../components/BooleanValue';

// MiniCard padronizado
const MiniCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2 bg-white/80 rounded-lg p-2 text-sm">
    <Icon className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-800 font-medium">{value}</div>
    </div>
  </div>
);

const Modalidades = memo(({ escola }) => {
  if (!escola) return null;

  // Cards principais de Modalidades
  const turnosValue = escola.turnos_funcionamento || escola['turnos_funcionamento'] || '';
  const modalidadeItems = [
    {
      icon: Sparkles,
      label: 'Modalidade de Ensino',
      value: escola.modalidade_ensino,
    },
    turnosValue && {
      icon: Clock,
      label: 'Turnos de Funcionamento',
      value: turnosValue,
    },
    {
      icon: Users,
      label: 'Número de Alunos',
      value: escola.numero_alunos,
    },
    {
      icon: Languages,
      label: 'Línguas Faladas',
      value: escola.linguas_faladas,
    },
  ].filter(Boolean);

  // Cards de Materiais Pedagógicos
  const materiaisItems = [
    {
      icon: BookOpen,
      label: 'Material Pedagógico Não Indígena',
      value: <BooleanValue value={escola.material_nao_indigena} />,
    },
    {
      icon: BookOpen,
      label: 'Material Pedagógico Indígena',
      value: <BooleanValue value={escola.material_indigena} />,
    },
  ];

  return (
    <>
      <InfoSection title="Modalidades" icon={Sparkles}>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 ${modalidadeItems.length === 1 ? 'justify-items-center' : ''}`}
        >
          {modalidadeItems.map((item, idx) => (
            <MiniCard key={idx} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>
      </InfoSection>
      
      <InfoSection 
        title="Materiais Pedagógicos" 
        icon={BookOpen}
        description="Diferenciados e não diferenciados, produzidos dentro e fora da comunidade."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
          {materiaisItems.map((item, idx) => (
            <MiniCard key={idx} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>
      </InfoSection>
    </>
  );
});

export default Modalidades; 