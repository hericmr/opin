import React, { memo } from 'react';
import { Sparkles, BookOpen, Users, MessageCircle, Clock } from 'lucide-react';
import InfoSection from '../InfoSection';
import BooleanValue from '../../components/BooleanValue';
import NativeLandCard from '../NativeLandCard';

// Função utilitária para transformar o texto em lista
function parseModalidadeEnsino(text) {
  if (!text || typeof text !== 'string') return [];
  
  // Primeiro, divide por quebras de linha (\n)
  // Depois, divide pelo traço longo (–, U+2013) para cada linha
  // Remove espaços extras e filtra itens vazios
  return text
    .split('\n')
    .flatMap(line => {
      // Se a linha contém traço longo, divide por ele também
      if (line.includes('–')) {
        return line.split('–').map(item => item.trim()).filter(Boolean);
      }
      // Caso contrário, retorna a linha inteira (se não estiver vazia)
      return line.trim() ? [line.trim()] : [];
    })
    .filter(Boolean);
}

// Componente para renderizar lista com bolinhas
const ListWithBullets = ({ items }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="text-sm text-gray-800 text-left w-full font-medium leading-relaxed break-words px-2">
      <ul className="list-none pl-0 ml-0 space-y-1.5">
        {items.map((item, idx) => (
          <li key={idx} className="leading-relaxed m-0 p-0 pl-0 ml-0 flex items-start" style={{ lineHeight: '1.7' }}>
            <span className="mr-2 text-gray-900 select-none font-bold flex-shrink-0" style={{minWidth: '0.75em', display: 'inline-block'}} aria-hidden="true">•</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper function to check if a value is empty
const isEmptyValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (typeof value === 'number' && isNaN(value)) return true;
  // Keep 0, false, and React elements as valid
  if (typeof value === 'number') return false;
  if (typeof value === 'boolean') return false;
  if (React.isValidElement(value)) return false;
  return false;
};

// Helper function to check if a card has long content
const hasLongContent = (value) => {
  if (!value) return false;
  if (React.isValidElement(value)) return false; // React elements are not long text
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // Verifica se tem mais de 30 caracteres OU se tem vírgulas (lista de itens)
    return trimmed.length > 30 || (trimmed.includes(',') && trimmed.length > 20);
  }
  return false;
};

// Helper function to get grid columns based on item count
const getGridCols = (count) => {
  if (count === 0) return 'grid-cols-1';
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  return 'grid-cols-3 lg:grid-cols-3';
};

// Usando NativeLandCard em vez de MiniCard customizado

const Modalidades = memo(({ escola }) => {
  if (!escola) return null;

  // Cards principais de Modalidades
  const turnosValue = escola.turnos_funcionamento || escola['turnos_funcionamento'] || '';
  const modalidadeList = parseModalidadeEnsino(escola.modalidade_ensino);
  

  // Cards para o grid (sem Modalidade de Ensino)
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
    // Cards de Materiais Pedagógicos integrados
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
  ].filter(Boolean).filter(item => !isEmptyValue(item.value));

  if (gridItems.length === 0 && modalidadeList.length === 0) return null;

  return (
    <>
      <InfoSection>
        {/* Modalidade de Ensino - sempre em linha inteira (1 coluna) */}
        {modalidadeList.length > 0 && (
          <div className="mb-3">
            <NativeLandCard
              icon={Sparkles}
              label="Modalidade de Ensino"
              value={<ListWithBullets items={modalidadeList} />}
              showIconCircle={true}
            />
          </div>
        )}
        
        {/* Separar cards com muito conteúdo dos cards normais */}
        {gridItems.length > 0 && (() => {
          const longContentCards = gridItems.filter(item => hasLongContent(item.value));
          const normalCards = gridItems.filter(item => !hasLongContent(item.value));
          
          return (
            <>
              {/* Cards com muito conteúdo - linha inteira (1 coluna) */}
              {longContentCards.length > 0 && (
                <div className={`space-y-3 ${modalidadeList.length > 0 ? 'mb-3' : 'mb-3'}`}>
                  {longContentCards.map((item, idx) => (
                    <NativeLandCard key={`long-${idx}`} icon={item.icon} label={item.label} value={item.value} type={item.type} showIconCircle={true} />
                  ))}
                </div>
              )}
              
              {/* Cards normais - grid de 3 colunas */}
              {normalCards.length > 0 && (
                <div className={`grid ${getGridCols(normalCards.length)} gap-3 ${longContentCards.length > 0 || modalidadeList.length > 0 ? '' : ''} items-stretch overflow-visible`}>
                  {normalCards.map((item, idx) => (
                    <NativeLandCard key={`normal-${idx}`} icon={item.icon} label={item.label} value={item.value} type={item.type} showIconCircle={true} />
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </InfoSection>
    </>
  );
});

export default Modalidades; 