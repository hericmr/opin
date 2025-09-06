import React, { memo, useState } from 'react';
import { Sparkles, BookOpen, Users, MessageCircle, Clock } from 'lucide-react';
import InfoSection from '../InfoSection';
import BooleanValue from '../../components/BooleanValue';

// Função utilitária para transformar o texto em lista
function parseModalidadeEnsino(text) {
  if (!text || typeof text !== 'string') return [];
  // Divide pelo traço longo (–, U+2013) e remove espaços extras
  return text
    .split('–')
    .map(item => item.trim())
    .filter(Boolean);
}

// Componente de lista expansível
const ExpandableList = ({ items, maxVisible = 3 }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="-mt-1">
      <ul className="list-none text-gray-800 text-xs pl-0 ml-0">
        {items.map((item, idx) => (
          <li key={idx} className="leading-tight m-0 p-0 pl-0 ml-0 flex items-start">
            <span className="mr-1 text-green-700 select-none" style={{minWidth: '1em', display: 'inline-block'}}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// MiniCard padronizado
const MiniCard = ({ icon: Icon, label, value, type = 'text' }) => {
  const renderValue = () => {
    if (type === 'number') {
      return (
        <div className="text-center w-full flex items-center justify-center h-full">
          <div className="text-3xl font-medium text-green-800" style={{fontSize: '1.875rem', fontWeight: '500', color: '#166534'}}>
            {value || '0'}
          </div>
        </div>
      );
    }
    return (
      <div className="text-sm text-gray-800 font-medium break-words text-center w-full">{value}</div>
    );
  };

  return (
    <div className="bg-green-50 hover:bg-green-100 rounded-lg p-3 transition-all duration-200 hover:shadow-sm h-[120px] flex flex-col">
      {/* Header com ícone e label */}
      <div className="flex items-center justify-center gap-2 mb-3 flex-shrink-0 h-[40px]">
        <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" />
        <span className="text-xs text-gray-600 font-medium leading-tight">{label}</span>
      </div>
      {/* Conteúdo do valor */}
      <div className="flex-1 flex items-center justify-center">
        {renderValue()}
      </div>
    </div>
  );
};

const Modalidades = memo(({ escola }) => {
  if (!escola) return null;

  // Cards principais de Modalidades
  const turnosValue = escola.turnos_funcionamento || escola['turnos_funcionamento'] || '';
  const modalidadeList = parseModalidadeEnsino(escola.modalidade_ensino);
  
  // Card de Modalidade de Ensino (separado para ocupar linha inteira)
  const modalidadeEnsinoCard = {
    icon: Sparkles,
    label: 'Modalidade de Ensino',
    value: <ExpandableList items={modalidadeList} maxVisible={3} />,
  };

  // Outros cards para o grid
  const gridItems = [
    turnosValue && {
      icon: Clock,
      label: 'Turnos de Funcionamento',
      value: turnosValue,
    },
    {
      icon: Users,
      label: 'Número de Alunos',
      value: escola.numero_alunos || '0',
      type: 'number',
    },
    {
      icon: MessageCircle,
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
      <InfoSection>
        {/* Modalidade de Ensino em linha inteira */}
        <div className="mb-4 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">Modalidade de Ensino</span>
          </div>
          <div className="ml-8">
            <ExpandableList items={modalidadeList} maxVisible={3} />
          </div>
        </div>
        
        {/* Grid com os outros cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 mt-1 items-stretch">
          {gridItems.map((item, idx) => (
            <MiniCard key={idx} icon={item.icon} label={item.label} value={item.value} type={item.type} />
          ))}
        </div>
      </InfoSection>
      
      <InfoSection 
        title="Materiais Pedagógicos" 
        icon={BookOpen}
        description="Diferenciados e não diferenciados, produzidos dentro e fora da comunidade."
      >
        <div className="grid grid-cols-2 gap-1 mt-1 items-stretch">
          {materiaisItems.map((item, idx) => (
            <MiniCard key={idx} icon={item.icon} label={item.label} value={item.value} />
          ))}
        </div>
      </InfoSection>
    </>
  );
});

export default Modalidades; 