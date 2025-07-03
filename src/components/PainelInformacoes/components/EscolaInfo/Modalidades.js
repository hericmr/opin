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
  const [expanded, setExpanded] = useState(false);
  if (!items || items.length === 0) return null;
  const visibleItems = expanded ? items : items.slice(0, maxVisible);
  const hasMore = items.length > maxVisible;

  return (
    <div className="-mt-1">
      <ul className="list-none text-gray-800 text-xs pl-0 ml-0">
        {visibleItems.map((item, idx) => (
          <li key={idx} className="leading-tight m-0 p-0 pl-0 ml-0 flex items-start">
            <span className="mr-1 text-green-700 select-none" style={{minWidth: '1em', display: 'inline-block'}}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          className="mt-0.5 text-xs text-green-700 hover:underline focus:outline-none"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  );
};

// MiniCard padronizado
const MiniCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-start bg-white/80 rounded-lg p-2 text-sm">
    <Icon className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-gray-800 font-medium p-0 m-0">{value}</div>
    </div>
  </div>
);

const Modalidades = memo(({ escola }) => {
  if (!escola) return null;

  // Cards principais de Modalidades
  const turnosValue = escola.turnos_funcionamento || escola['turnos_funcionamento'] || '';
  const modalidadeList = parseModalidadeEnsino(escola.modalidade_ensino);
  const modalidadeItems = [
    {
      icon: Sparkles,
      label: 'Modalidade de Ensino',
      value: <ExpandableList items={modalidadeList} maxVisible={3} />,
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