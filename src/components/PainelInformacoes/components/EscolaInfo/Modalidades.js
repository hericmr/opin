import React, { memo } from 'react';
import { Sparkles, BookOpen, Users, MessageCircle, Clock } from 'lucide-react';
import InfoSection from '../InfoSection';
import BooleanValue from '../../components/BooleanValue';
import NativeLandCard from '../NativeLandCard';

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

// Usando NativeLandCard em vez de MiniCard customizado

const Modalidades = memo(({ escola }) => {
  if (!escola) return null;

  // Cards principais de Modalidades
  const turnosValue = escola.turnos_funcionamento || escola['turnos_funcionamento'] || '';
  const modalidadeList = parseModalidadeEnsino(escola.modalidade_ensino);
  

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
    {
      icon: BookOpen,
      label: 'PPP Próprio',
      value: <BooleanValue value={escola.ppp_proprio} />,
    },
    {
      icon: BookOpen,
      label: 'PPP com Comunidade',
      value: <BooleanValue value={escola.ppp_comunidade} />,
    },
  ];

  return (
    <>
      <InfoSection>
        {/* Modalidade de Ensino em linha inteira */}
        <div className="mb-4 rounded-lg p-4" style={{ backgroundColor: '#D1FAE5' }}>
          <div className="flex items-start gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-gray-700 mt-0.5 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">Modalidade de Ensino</span>
          </div>
          <div className="ml-8">
            <ExpandableList items={modalidadeList} maxVisible={3} />
          </div>
        </div>
        
        {/* Grid com os outros cards - estilo native-land.ca */}
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 mt-1 items-stretch overflow-visible" style={{ paddingTop: '12px', paddingLeft: '12px' }}>
          {gridItems.map((item, idx) => (
            <NativeLandCard key={idx} icon={item.icon} label={item.label} value={item.value} type={item.type} showIconCircle={true} />
          ))}
        </div>
      </InfoSection>
      
      <InfoSection 
        title="Materiais Pedagógicos" 
        icon={BookOpen}
        description="Diferenciados e não diferenciados, produzidos dentro e fora da comunidade."
      >
        {/* Primeiro card em linha inteira */}
        <div className="mb-3 overflow-visible" style={{ paddingTop: '12px', paddingLeft: '12px' }}>
          <NativeLandCard 
            icon={materiaisItems[0].icon} 
            label={materiaisItems[0].label} 
            value={materiaisItems[0].value} 
            showIconCircle={true}
          />
        </div>
        
        {/* Cards restantes - agrupados por múltiplos de 3 */}
        {materiaisItems.length > 1 && (
          <div className="space-y-3">
            {(() => {
              const remainingCards = materiaisItems.slice(1);
              const groups = [];
              
              // Agrupar em múltiplos de 3
              for (let i = 0; i < remainingCards.length; i += 3) {
                groups.push(remainingCards.slice(i, i + 3));
              }
              
              return groups.map((group, groupIdx) => (
                <div 
                  key={groupIdx}
                  className={`grid gap-2 sm:gap-3 items-stretch overflow-visible ${
                    group.length === 3 
                      ? 'grid-cols-3' 
                      : group.length === 2 
                        ? 'grid-cols-2' 
                        : 'grid-cols-1'
                  }`}
                  style={{ paddingTop: '12px', paddingLeft: '12px' }}
                >
                  {group.map((item, idx) => (
                    <NativeLandCard 
                      key={`${groupIdx}-${idx}`} 
                      icon={item.icon} 
                      label={item.label} 
                      value={item.value} 
                      showIconCircle={true}
                    />
                  ))}
                </div>
              ));
            })()}
          </div>
        )}
      </InfoSection>
    </>
  );
});

export default Modalidades; 